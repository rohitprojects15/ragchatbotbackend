require('dotenv').config();
const { QdrantClient } = require('@qdrant/js-client-rest');

// Log for debugging
console.log('Qdrant URL:', process.env.QDRANT_URL);

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = 'news_articles';
const VECTOR_SIZE = 1024; // Jina embeddings v3 dimension

async function initCollection() {
  try {
    const collections = await client.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!exists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine',
        },
      });
      console.log(` Created collection: ${COLLECTION_NAME}`);
    } else {
      console.log(` Collection ${COLLECTION_NAME} already exists`);
    }
  } catch (error) {
    console.error('L Error initializing collection:', error);
    throw error;
  }
}

module.exports = { client, COLLECTION_NAME, initCollection };
