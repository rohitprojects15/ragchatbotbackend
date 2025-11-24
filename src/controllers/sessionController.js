const redis = require('../config/redis');

async function getSessionHistory(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const chatHistory = await redis.get('chat:' + sessionId);
    
    if (!chatHistory) {
      return res.json({ sessionId, history: [] });
    }

    const history = JSON.parse(chatHistory);
    res.json({ sessionId, history });
  } catch (error) {
    console.error('Error fetching session history:', error);
    res.status(500).json({ error: 'Failed to fetch session history' });
  }
}

async function clearSession(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    await redis.del('chat:' + sessionId);
    res.json({ message: 'Session cleared successfully', sessionId });
  } catch (error) {
    console.error('Error clearing session:', error);
    res.status(500).json({ error: 'Failed to clear session' });
  }
}

module.exports = { getSessionHistory, clearSession };
