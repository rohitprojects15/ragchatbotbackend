const redis = require('../config/redis');

async function getSessionHistory(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const redisKey = `chat:${sessionId}`;
    const chatHistory = await redis.get(redisKey);

    if (!chatHistory) {
      console.log(`📭 No history found for session: ${sessionId}`);
      return res.json({
        sessionId,
        messages: [],  // Frontend expects 'messages', not 'history'
        totalMessages: 0
      });
    }

    const messages = JSON.parse(chatHistory);
    console.log(`📬 Retrieved ${messages.length} messages for session: ${sessionId}`);

    res.json({
      sessionId,
      messages,  // Frontend expects 'messages', not 'history'
      totalMessages: messages.length
    });
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
