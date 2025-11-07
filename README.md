# Nudge AI

A concise AI decision maker powered by Claude (Anthropic) or GPT-4 (OpenAI).

## Features

- Quick, decisive AI responses (max 2 sentences)
- Context-aware (uses date, time, timezone, and location)
- Conversation history support
- Auto-retry on API overload
- Clean, modern UI

## Deployment on Vercel

### 1. Deploy from GitHub

1. Push this repository to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "Add New..." → "Project"
4. Import your repository
5. Vercel will auto-detect the configuration

### 2. Add Environment Variables

Before your first deployment, add at least one API key:

**In Vercel Dashboard:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add one or both of the following:

| Variable Name | Description | Where to get it |
|--------------|-------------|-----------------|
| `ANTHROPIC_API_KEY` | Your Anthropic Claude API key | [console.anthropic.com](https://console.anthropic.com/) |
| `OPENAI_API_KEY` | Your OpenAI API key | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

4. Click "Save"
5. Redeploy your project

### 3. Done!

Your app will be live at your Vercel URL. Every push to GitHub will trigger automatic redeployment.

## Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Create .env file from example
cp .env.example .env

# Add your API keys to .env file
# Then run locally
vercel dev
```

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Vercel Serverless Functions (Node.js)
- AI: Anthropic Claude or OpenAI GPT-4

## License

MIT
