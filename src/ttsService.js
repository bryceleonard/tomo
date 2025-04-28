const axios = require('axios');

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

async function generateSpeech(text) {
  try {
    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/21m00Tcm4TlvDq8ikWAM`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating speech:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  generateSpeech,
}; 