# Meditations Backend Service

This is a secure backend service that acts as a proxy between your mobile app and the OpenAI API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your OpenAI API key:
```
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST /api/generate
Send a prompt to OpenAI and get a response.

Request body:
```json
{
  "prompt": "Your prompt here"
}
```

### GET /health
Check if the server is running.

## Security Notes

- Never expose your OpenAI API key in the frontend
- Keep your `.env` file secure and never commit it to version control
- Consider adding rate limiting and authentication for production use 