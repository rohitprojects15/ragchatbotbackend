const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initCollection } = require('./config/vectorDB');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/session', require('./routes/session'));

// Initialize Vector DB Collection (non-blocking)
async function startServer() {
  // Start server first
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`💬 Chat API: http://localhost:${PORT}/api/chat/query`);
  });

  // Initialize collection in background
  try {
    console.log('🔄 Initializing Qdrant collection...');
    await initCollection();
    console.log('✅ Qdrant collection ready');
  } catch (error) {
    console.error('⚠️  Warning: Qdrant initialization failed:', error.message);
    console.error('   Make sure to run "npm run ingest" before using chat API');
  }
}

startServer();