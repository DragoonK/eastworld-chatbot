# Brightstar Chatbot

AI-powered admissions assistant for Brightstar International School of Phnom Penh. Built with Next.js + Claude API.

## Quick Setup (in Cursor)

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
Open `.env.local` and replace the placeholder with your real key:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```
Get a key at: https://console.anthropic.com

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000 — use the demo page or click the chat bubble (if you embed the widget) in the bottom right.

## Deploy to Vercel

### Option A: Through Vercel website
1. Push this project to a GitHub repo
2. Go to https://vercel.com and import the repo
3. In the Vercel dashboard, go to Settings → Environment Variables
4. Add: `ANTHROPIC_API_KEY` = your key
5. Deploy

### Option B: Through Vercel CLI
```bash
npm i -g vercel
vercel
```
Then add your API key in the Vercel dashboard under Environment Variables.

## Embed on your website

Once deployed to Vercel (e.g. at brightstar-chatbot.vercel.app), you can embed the chat widget on your existing site by adding this script to your site's HTML footer:

```html
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://your-vercel-url.vercel.app';
    iframe.style.cssText = 'position:fixed;bottom:0;right:0;width:480px;height:700px;border:none;z-index:9999;pointer-events:none;';
    iframe.allow = 'clipboard-write';
    document.body.appendChild(iframe);
  })();
</script>
```

Or better yet — just copy the `ChatWidget.js` component directly into your existing site codebase if it's React-based, and import the API route too.

## Project Structure

```
brightstar-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js      ← Secure backend (holds API key)
│   ├── components/
│   │   └── ChatWidget.js     ← The chat UI
│   ├── layout.js
│   └── page.js               ← Demo page
├── .env.local                 ← Your API key (never commit this)
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

## Cost
Claude Sonnet API costs roughly $3 per million input tokens. For a chatbot handling 20-50 conversations per day, expect roughly $5-15/month. Much cheaper than Chatbase's $19/month plan, and you own everything.
