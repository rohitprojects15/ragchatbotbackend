const { generateResponse } = require('../services/ragService');
const crypto = require('crypto');

async function handleChatQuery(req, res) {
  try {
    const { query, sessionId } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const session = sessionId || crypto.randomUUID();

    const result = await generateResponse(query, session);

    res.json({
      sessionId: session,
      query,
      response: result.response,
      sources: result.sources,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ 
      error: 'Failed to process your request',
      details: error.message 
    });
  }
}

module.exports = { handleChatQuery };
