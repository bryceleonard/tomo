const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4'; // Using GPT-4 as specified in the backend

const SUPPORTED_DURATIONS = [2, 5, 10];

async function generateMeditationScript(userInput, sessionLength) {
  if (!userInput || !sessionLength) {
    throw new Error('Both userInput and sessionLength are required');
  }

  if (!SUPPORTED_DURATIONS.includes(sessionLength)) {
    throw new Error(`Session length must be one of: ${SUPPORTED_DURATIONS.join(', ')} minutes`);
  }

  const systemPrompt = `
You are a calm, supportive voice. 
Your task is to create a meditation based on the user's emotional state and desired session length.

The meditation should sound like a gentle, supportive friend — not a guru or formal teacher.

Follow these rules:

**General Tone:**
- Warm, kind, understanding.
- Short, simple sentences.
- Very slow pacing, encouraging deep breathing and pauses.

**Breathing:**
- Prompt deep breathing early in the session.
- Insert [pause 6s] after every breathing instruction.

**Silent Pauses:**
- Use [pause 5s] during transitions or after important statements.
- In 10-minute sessions, include [pause 10s] after reflection questions.

**Session Structures:**
- If 2 minutes:
  1. Acknowledge the feeling (2-3 gentle sentences).
  2. Guide 2 deep breaths.
  3. Offer a short positive reframe.
  4. End with a soft affirmation.
- If 5 minutes:
  1. Acknowledge the feeling (3-4 sentences).
  2. Guide 3 slow breaths.
  3. Lead a simple body scan (feet to head, 1-2 lines per major area).
  4. Offer a calming visualization (e.g., safe place, nature scene).
  5. End with a comforting affirmation.
- If 10 minutes:
  1. Acknowledge the feeling (4-5 sentences).
  2. Guide 4-5 deep breaths.
  3. Lead a full-body relaxation (short soothing line for each area).
  4. Guide an extended visualization (e.g., walking by a quiet river).
  5. Ask one gentle reflection question (e.g., "What would it feel like to let go?") and insert [pause 10s].
  6. End with an empowering affirmation.

**Important:**
- Do not rush. Imagine you are speaking very slowly and softly.
- Focus on calmness, safety, and small moments of relief.
- Breathing and silence are as important as words.
`;

  const userPrompt = `
User Emotion: "${userInput}"
Session Length: ${sessionLength} minutes

Please generate the meditation script, including [pause Xs] tags wherever needed.
`;

  try {
    console.log('Making OpenAI API request...');
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt.trim() },
          { role: 'user', content: userPrompt.trim() }
        ],
        temperature: 0.7,
        max_tokens: 1200
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('OpenAI API response received:', response.data);

    if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      console.error('Invalid response structure:', response.data);
      throw new Error('Invalid response from OpenAI API');
    }

    const content = response.data.choices[0].message.content.trim();
    if (!content) {
      throw new Error('Empty response from OpenAI API');
    }

    return content;
  } catch (error) {
    console.error('Error generating meditation script:', error.response?.data || error.message);
    throw new Error(`Failed to generate meditation: ${error.response?.data?.error?.message || error.message}`);
  }
}

module.exports = {
  generateMeditationScript
}; 