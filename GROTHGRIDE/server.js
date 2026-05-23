const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('src'));

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'mistralai/Mistral-7B-Instruct-v0.1';

const callHuggingFaceAPI = async (question) => {
  // Check if question involves visual content
  const visualKeywords = /\b(image|picture|photo|see|look|show|visual|diagram|chart|graph|what does this|describe this)\b/i;
  if (visualKeywords.test(question)) {
    return "I can't see them.";
  }

  if (!HF_API_KEY || HF_API_KEY === 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
    return generateLocalAnswer(question);
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${AI_MODEL}`,
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: 'POST',
        body: JSON.stringify({
          inputs: `You are lifeVest AI mentor. Answer this question helpfully and accurately:\n\n${question}`,
          parameters: {
            max_length: 200,
            temperature: 0.7,
          },
        }),
      }
    );

    const result = await response.json();
    if (result[0]?.generated_text) {
      const text = result[0].generated_text;
      const answer = text.split('\n\n').pop();
      return answer || text;
    }
    return generateLocalAnswer(question);
  } catch (error) {
    console.error('HuggingFace API error:', error);
    return generateLocalAnswer(question);
  }
};

const generateLocalAnswer = (question) => {
  const q = question.toLowerCase();

  const answers = [
    {
      match: /workout|exercise|training|gym|fit/,
      text: 'Mix strength training (3x per week), cardio (2x), and recovery (1x). Warm up 10 minutes, train for 30-45 minutes, cool down for 5-10 minutes. Prioritize form over weight. Eat protein and rest well between sessions.'
    },
    {
      match: /invest|investment|money|saving|savings|finance/,
      text: 'Start by building an emergency fund (3-6 months of expenses). Then invest in low-cost index funds or ETFs for long-term growth. Learn about compound interest and diversify your portfolio. Never invest money you can\'t afford to lose.'
    },
    {
      match: /job|job ideas|part-time|work|gig/,
      text: 'Good part-time options: freelance writing/design on Fiverr/Upwork, tutoring (online or in-person), virtual assistant work, delivery services, or seasonal retail. Choose based on your skills and schedule. Start with platforms like TaskRabbit or Fiverr.'
    },
    {
      match: /study|school|homework|exam|learn/,
      text: 'Use the Pomodoro technique: 45 minutes focused study, then 5-minute break. After 4 cycles, take a 30-minute break. Study hardest subjects first. Review before sleep. Create study guides and explain concepts out loud.'
    },
    {
      match: /kids|children|young|school/,
      text: 'For kids: keep routines consistent, balance study with play and family time. Encourage curiosity and outdoor activity. Use positive reinforcement and avoid excessive screen time. Make learning fun with games and real-world examples.'
    },
    {
      match: /senior|older|grandparent|elder/,
      text: 'Seniors thrive with gentle movement (walks, stretching, swimming), mental exercises (puzzles, reading), social engagement, and structured routines. Prioritize sleep, nutrition, and regular health check-ups. Stay connected with family and community.'
    },
    {
      match: /world|how it works|society|economy|culture/,
      text: 'The world operates through interconnected systems: economic markets, governments, technology, and human relationships. Understanding supply/demand, global trade, and cultural diversity helps you navigate opportunities and make informed decisions.'
    },
    {
      match: /hack|hacker|security|bad people|protection/,
      text: 'Protect yourself: use strong, unique passwords (16+ characters), enable two-factor authentication, never share personal details, verify URLs before entering credentials, keep software updated, use reputable security software, and be cautious of phishing emails.'
    },
  ];

  const found = answers.find((item) => item.match.test(q));
  if (found) return found.text;

  return 'That\'s a great question! For more specific advice on this topic, consider consulting resources related to your area of interest or speaking with an expert. In the meantime, focus on building consistency in whatever goal you\'re working toward.';
};

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const answer = await callHuggingFaceAPI(question);
  res.json({ answer });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

app.listen(PORT, () => {
  console.log(`lifeVest server running on http://127.0.0.1:${PORT}`);
  console.log(`Frontend available at http://127.0.0.1:${PORT}`);
  if (!HF_API_KEY || HF_API_KEY === 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
    console.log('⚠️  HuggingFace API key not set. Using local answers.');
    console.log('Get a free API key at https://huggingface.co/settings/tokens');
  }
});
