# Fasiri — African Language AI

A Next.js chatbot that translates English to 19+ African languages using the Fasiri API, with AI chat powered by Grok.

## Features

- Translate to Luganda, Yoruba, Swahili, Twi, Acholi, and 15+ more languages
- Text-to-Speech for Ugandan languages (powered by Sunbird AI)
- Chat AI mode — every response is translated into your chosen language
- Translation history panel (restore previous translations)
- Dark / light mode toggle
- Character counter with limit enforcement
- Quality score bar per translation
- Provider badges (Sunbird, Khaya, HuggingFace)
- Fully responsive, mobile-first

## Getting Started

1. Clone this repo
2. Copy the env file and fill in your keys:

   cp .env.local.example .env.local

3. Get a free Fasiri API key:

   curl -X POST https://fasiri-bu9u.onrender.com/api/v1/auth/keys \
     -H "Content-Type: application/json" \
     -d '{"name": "demo"}'

4. Get your Grok API key from https://console.groq.com/keys

5. Install and run:

   npm install
   npm run dev

Open http://localhost:3000

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript + Tailwind CSS v4
- Groq (llama-3.3-70b) for chat AI
- Fasiri API for translation + TTS
- Playfair Display + DM Sans fonts
