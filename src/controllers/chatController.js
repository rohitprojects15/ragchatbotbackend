const { generateResponse } = require('../services/ragService');
const redis = require('../config/redis');
const crypto = require('crypto');

async function handleChatQuery(req, res) {
  try {
    const { query, sessionId } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const session = sessionId || crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // Generate AI response
    const result = await generateResponse(query, session);

    // Create message objects
    const userMessage = {
      id: `user_${Date.now()}`,
      content: query,
      role: 'user',
      timestamp: timestamp,
      status: 'sent'
    };

    const assistantMessage = {
      id: `assistant_${Date.now()}`,
      content: result.response,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      status: 'sent',
      sources: result.sources
    };

    // Get existing chat history from Redis
    const redisKey = `chat:${session}`;
    let chatHistory = [];

    try {
      const existingHistory = await redis.get(redisKey);
      if (existingHistory) {
        chatHistory = JSON.parse(existingHistory);

        // Clean up: Remove duplicates and ensure all messages have 'id' field
        // (temporary cleanup for transition period)
        const cleanedHistory = [];
        const seenMessages = new Set();

        for (const msg of chatHistory) {
          // Create a unique key based on content and role
          const messageKey = `${msg.role}:${msg.content}:${msg.timestamp}`;

          // Only keep messages with 'id' field (new format) or unique old messages
          if (msg.id) {
            if (!seenMessages.has(messageKey)) {
              cleanedHistory.push(msg);
              seenMessages.add(messageKey);
            }
          } else if (!seenMessages.has(messageKey)) {
            // Old format message without duplicates - keep it but skip if duplicate exists
            const hasDuplicate = chatHistory.some(m =>
              m.id && m.role === msg.role && m.content === msg.content
            );
            if (!hasDuplicate) {
              cleanedHistory.push(msg);
              seenMessages.add(messageKey);
            }
          }
        }

        chatHistory = cleanedHistory;
      }
    } catch (redisError) {
      console.warn('Warning: Could not fetch existing history from Redis:', redisError);
    }

    // Add new messages to history
    chatHistory.push(userMessage);
    chatHistory.push(assistantMessage);

    // Store updated history in Redis with TTL (24 hours = 86400 seconds)
    try {
      await redis.setex(redisKey, 86400, JSON.stringify(chatHistory));
      console.log(`✅ Stored ${chatHistory.length} messages for session: ${session}`);
    } catch (redisError) {
      console.error('❌ Failed to store chat history in Redis:', redisError);
      // Continue anyway - don't fail the request if Redis is down
    }

    res.json({
      sessionId: session,
      messageId: assistantMessage.id,
      query,
      response: result.response,
      sources: result.sources,
      timestamp: assistantMessage.timestamp,
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
