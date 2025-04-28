const axios = require('axios');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM';

function convertToSSML(text) {
  // Convert [pause Xs] to SSML break tags
  const ssmlText = text.replace(/\[pause (\d+)s\]/g, '<break time="$1s"/>');
  
  // Wrap the entire text in SSML tags
  return `<speak>${ssmlText}</speak>`;
}

async function generateSpeech(text) {
  if (!text) {
    throw new Error('Text is required for speech generation');
  }

  try {
    console.log('Generating speech for text:', text.substring(0, 50) + '...');
    
    // Convert our pause tags to SSML
    const ssmlText = convertToSSML(text);
    
    const response = await axios.post(
      ELEVENLABS_API_URL,
      {
        text: ssmlText,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    console.log('Successfully generated speech');
    return response.data;
  } catch (error) {
    console.error('Error generating speech:', error.response?.data || error.message);
    throw new Error(`Failed to generate speech: ${error.response?.data?.error?.message || error.message}`);
  }
}

module.exports = {
  generateSpeech
}; 