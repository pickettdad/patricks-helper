# Patrick's Answer Helper v2.0

An AI-powered speech-to-writing tool for students who can express themselves verbally but struggle with written output.

## What It Does

1. **Reads a question aloud** to the student (text-to-speech)
2. **Records their spoken answer** (speech recognition)
3. **Confirms what it heard** — student can approve or retry
4. **Asks smart follow-up questions** to draw out a more complete answer
5. **Compiles everything** into clean, writable sentences
6. **Shows a distraction-free "WRITE THIS" screen** — one sentence per line for easy copying onto paper

## Key Features

- **Teacher Setup Panel** (PIN-protected) — configure questions, AI context, completion criteria
- **"Keep / Try Again" confirmation** — student verifies what was heard before it's committed
- **Smart follow-up questions** — AI uses memory-jogging strategies when student says "I don't know"
- **Progress tracking** — visual progress bar toward word/detail goals
- **Encouraging tone** — positive reinforcement after every response
- **"WRITE THIS" overlay** — distraction-free final answer display with "Read it to me" option
- **Confetti celebration** on completion
- **Works in Google Sites** — iframe detection with full-screen button

## Setup (Vercel + GitHub)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Patrick's Answer Helper v2.0"
git remote add origin https://github.com/YOUR_USERNAME/patricks-helper.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. In **Settings → Environment Variables**, add:
   - Key: `CLAUDE_API_KEY`
   - Value: your Claude API key (starts with `sk-ant-...`)
3. Deploy!

### 3. Embed in Google Sites (Optional)
1. Copy your Vercel URL (e.g., `https://patricks-helper.vercel.app`)
2. In Google Sites: **Insert → Embed → Embed URL**
3. The "Open Full Screen" button will appear automatically

## File Structure

```
├── index.html          # Main app (single-file frontend)
├── api/
│   └── claude.js       # Vercel serverless function (secure API proxy)
├── vercel.json         # Vercel configuration
├── package.json        # Project metadata
└── README.md           # This file
```

## For Teachers

### Setting Up
1. Click **⚙️ Teacher Setup** (PIN required after first setup)
2. Enter the question Patrick needs to answer
3. Add AI Context (Patrick won't see this) — e.g., "Patrick is in Grade 3. Keep language simple."
4. Set your completion criteria:
   - **Number of Details** — stops after N distinct responses
   - **Word Count** — stops after N total words
   - **Complete Answer** — AI decides when enough detail has been gathered
5. Set a 4-digit PIN to protect settings

### Recommended Settings
- **Goal Type:** Number of Details = 4
- **Max Follow-ups:** 5
- **Silence Timeout:** 5 seconds
- **AI Context example:** "Patrick is in Grade 3. He communicates well verbally but struggles with writing. Ask friendly follow-up questions. Keep language simple."

## Security
- API key stored in Vercel environment variables (never in code)
- Serverless function validates request size and shape
- Teacher panel protected by PIN
- Request timeout prevents hanging connections

## Browser Support
- **Chrome** (recommended) — full speech recognition support
- **Edge** — speech recognition supported
- Other browsers may not support Web Speech API
