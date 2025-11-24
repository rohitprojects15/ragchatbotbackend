require('dotenv').config();
const { QdrantClient } = require('@qdrant/js-client-rest');
const Redis = require('ioredis');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

async function verifySetup() {
  console.log('🔍 Verifying RAG Chatbot Setup...\n');

  // 1. Check Qdrant
  try {
    console.log('1️⃣  Testing Qdrant connection...');
    const qdrantClient = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });
    const collections = await qdrantClient.getCollections();
    console.log('   ✅ Qdrant: Connected!');
    console.log('   Collections:', collections.collections.length);
  } catch (error) {
    console.error('   ❌ Qdrant: Failed -', error.message);
  }

  // 2. Check Redis
  try {
    console.log('\n2️⃣  Testing Redis connection...');
    const redis = new Redis(process.env.UPSTASH_REDIS_REST_TOKEN);
    await redis.set('test-key', 'test-value', 'EX', 10);
    const value = await redis.get('test-key');
    redis.disconnect();
    console.log('   ✅ Redis: Connected!');
  } catch (error) {
    console.error('   ❌ Redis: Failed -', error.message);
  }

  // 3. Check Gemini
  try {
    console.log('\n3️⃣  Testing Gemini AI...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say "Hello"');
    console.log('   ✅ Gemini: Connected!');
    console.log('   Response:', result.response.text().substring(0, 50));
  } catch (error) {
    console.error('   ❌ Gemini: Failed -', error.message);
  }

  // 4. Check Jina
  try {
    console.log('\n4️⃣  Testing Jina Embeddings...');
    const response = await axios.post(
      'https://api.jina.ai/v1/embeddings',
      {
        input: ['test'],
        model: 'jina-embeddings-v3',
        dimensions: 1024
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.JINA_API_KEY,
        },
      }
    );
    console.log('   ✅ Jina: Connected!');
    console.log('   Embedding dimension:', response.data.data[0].embedding.length);
  } catch (error) {
    console.error('   ❌ Jina: Failed -', error.response?.data?.detail || error.message);
  }

  console.log('\n✅ Setup verification complete!\n');
  console.log('Next steps:');
  console.log('1. Make sure server is running: npm run dev');
  console.log('2. Ingest data: npm run ingest');
  console.log('3. Test API: node test-api.js');
  
  process.exit(0);
}

verifySetup();
