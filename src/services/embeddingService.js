const axios = require('axios');

const JINA_API_KEY = process.env.JINA_API_KEY;
const JINA_API_URL = 'https://api.jina.ai/v1/embeddings';

async function generateEmbedding(text) {
  try {
    const response = await axios.post(
      JINA_API_URL,
      {
        input: [text],
        model: 'jina-embeddings-v3',
        task: 'retrieval.passage',
        dimensions: 1024
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JINA_API_KEY}`,
        },
      }
    );

    return response.data.data[0].embedding;
  } catch (error) {
    const errorDetail = error.response?.data?.detail || error.response?.data || error.message;
    console.error('Error generating embedding:', errorDetail);
    throw new Error(errorDetail);
  }
}

async function generateQueryEmbedding(text) {
  try {
    const response = await axios.post(
      JINA_API_URL,
      {
        input: [text],
        model: 'jina-embeddings-v3',
        task: 'retrieval.query',
        dimensions: 1024
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JINA_API_KEY}`,
        },
      }
    );

    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error generating query embedding:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { generateEmbedding, generateQueryEmbedding };
