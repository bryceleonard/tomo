require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateMeditationScript } = require('./llmService');

const app = express();

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Keep the process running despite uncaught exceptions
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  // Keep the process running despite unhandled promise rejections
});

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// OpenAI API endpoint
app.post('/api/generate', async (req, res) => {
  const { prompt, duration } = req.body;
  console.log('Received request:', { prompt, duration });

  if (!prompt || !duration) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Prompt and duration are required' });
  }

  try {
    console.log('Generating meditation script...');
    const meditationScript = await generateMeditationScript(prompt, duration);
    console.log('Successfully generated meditation script');
    res.json({ 
      choices: [{
        message: {
          content: meditationScript
        }
      }]
    });
  } catch (error) {
    console.error('Error generating meditation:', error);
    res.status(500).json({ 
      error: 'Error generating meditation',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 