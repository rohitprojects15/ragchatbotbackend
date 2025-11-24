const { client, COLLECTION_NAME } = require('../config/vectorDB');
let model;
try {
  model = require('../config/database').model;
} catch (error) {
  console.warn('Gemini not available, using mock mode');
}
const { generateQueryEmbedding } = require('./embeddingService');
const redis = require('../config/redis');

async function retrieveRelevantArticles(query, topK = 5) {
  try {
    const queryEmbedding = await generateQueryEmbedding(query);

    const searchResult = await client.search(COLLECTION_NAME, {
      vector: queryEmbedding,
      limit: topK,
      with_payload: true,
    });

    return searchResult.map(result => ({
      title: result.payload.title,
      content: result.payload.content,
      source: result.payload.source,
      url: result.payload.url,
      score: result.score,
    }));
  } catch (error) {
    console.error('Error retrieving articles:', error);
    throw error;
  }
}

async function generateResponse(query, sessionId) {
  try {
    const relevantArticles = await retrieveRelevantArticles(query, 5);

    if (relevantArticles.length === 0) {
      return {
        response: "I couldn't find any relevant news articles for your query. Please try a different question.",
        sources: [],
      };
    }

    const context = relevantArticles
      .map((article, idx) => 
        'Article ' + (idx + 1) + ':\nTitle: ' + article.title + '\nSource: ' + article.source + '\nContent: ' + article.content
      )
      .join('\n\n');

    const chatHistory = await redis.get('chat:' + sessionId);
    const history = chatHistory ? JSON.parse(chatHistory) : [];

    const conversationContext = history
      .slice(-4)
      .map(msg => msg.role + ': ' + msg.content)
      .join('\n');

    const prompt = 'You are a helpful news assistant. Answer the user question based ONLY on the provided news articles. If the articles do not contain relevant information, say so.\n\nConversation History:\n' + conversationContext + '\n\nNews Articles:\n' + context + '\n\nUser Question: ' + query + '\n\nProvide a clear, concise answer citing the sources.';

    let responseText;
    try {
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    } catch (error) {
      // Fallback: Generate response from article titles
      const summary = relevantArticles.map((a, i) => `${i+1}. ${a.title} (${a.source})`).join('\n');
      responseText = `Based on recent news articles, here are the relevant stories:\n\n${summary}\n\nNote: Full AI generation is temporarily unavailable. Please check these articles for more details.`;
    }

    history.push(
      { role: 'user', content: query, timestamp: new Date().toISOString() },
      { role: 'assistant', content: responseText, timestamp: new Date().toISOString() }
    );

    await redis.setex('chat:' + sessionId, 3600, JSON.stringify(history));

    return {
      response: responseText,
      sources: relevantArticles.map(a => ({
        title: a.title,
        url: a.url,
        source: a.source,
      })),
    };
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

module.exports = { generateResponse, retrieveRelevantArticles };
