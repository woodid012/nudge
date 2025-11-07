export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { message, provider, history, context } = req.body;

        // Get API keys from environment variables
        const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
        const openaiApiKey = process.env.OPENAI_API_KEY;

        // Use provider from request or default to anthropic if env var is set
        let selectedProvider = provider;
        if (!selectedProvider) {
            selectedProvider = anthropicApiKey ? 'anthropic' : 'openai';
        }

        // Validate API key is available
        const apiKey = selectedProvider === 'anthropic' ? anthropicApiKey : openaiApiKey;
        if (!apiKey) {
            res.status(500).json({ error: `${selectedProvider === 'anthropic' ? 'ANTHROPIC' : 'OPENAI'}_API_KEY environment variable not set` });
            return;
        }

        // Build context string
        let contextInfo = '';
        if (context) {
            contextInfo = `\n\nCONTEXT: Current date is ${context.date}, time is ${context.time} (${context.timezone}).`;
            if (context.location) {
                contextInfo += ` User's location: ${context.location.latitude.toFixed(2)}°N, ${context.location.longitude.toFixed(2)}°E.`;
            }
            contextInfo += ' Use this context to give relevant, timely advice.';
        }

        const systemPrompt = 'You are Nudge, a decisive AI assistant that makes decisions for users. CRITICAL: You MUST respond in MAXIMUM 2 sentences. Make ONE clear decision - do NOT give options or present choices. Be direct and decisive. Tell the user exactly what to do, not what they could do. No fluff, just one actionable decision.' + contextInfo;

        let apiUrl, headers, requestBody;

        if (selectedProvider === 'anthropic') {
            apiUrl = 'https://api.anthropic.com/v1/messages';
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            };
            requestBody = JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 200,
                system: systemPrompt,
                messages: history || [{ role: 'user', content: message }]
            });
        } else {
            apiUrl = 'https://api.openai.com/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            const messages = [
                {
                    role: 'system',
                    content: systemPrompt
                }
            ];
            if (history && history.length > 0) {
                messages.push(...history);
            } else {
                messages.push({ role: 'user', content: message });
            }
            requestBody = JSON.stringify({
                model: 'gpt-4',
                max_tokens: 200,
                messages: messages
            });
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: requestBody
        });

        const data = await response.json();

        if (!response.ok) {
            res.status(response.status).json({ error: data.error?.message || 'API request failed' });
            return;
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
