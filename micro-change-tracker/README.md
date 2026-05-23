# Micro-Change Tracker

A simple app for 1% daily improvement. It tracks tiny habits, small environmental actions, home workouts, AI coaching, and beginner investing guidance.

## Features
- Daily micro-change tracker with tiny habits and environment actions
- Free mode with quality action tracking and focused AI prompts
- Premium mode at $46.32 for unlimited coach access, better focus guidance, premium workouts, and investing support
- Home-friendly workout routines and recovery advice
- Private-style focus notes and habit reflection
- Simple investing mindset education and money habit support

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   node server.js
   ```
3. Open the browser to `http://127.0.0.1:3000`

## Notes
- The app uses local storage to save habits and reflections.
- Premium is simulated as a 30-day upgrade flow with a mock activation.
- The AI mentor uses a local API proxy; add a Hugging Face API key in `.env` for live responses.
