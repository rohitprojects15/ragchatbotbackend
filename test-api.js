const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('Testing RAG Chatbot API...\n');

  try {
    console.log('1. Testing Health Check...');
    const health = await axios.get(BASE_URL + '/health');
    console.log('   Health:', health.data);

    console.log('\n2. Testing Chat Query...');
    const chatResponse = await axios.post(BASE_URL + '/api/chat/query', {
      query: 'What are the latest news about technology?'
    });
    console.log('   Response:', chatResponse.data);

    console.log('\n3. Testing Session History...');
    const sessionId = chatResponse.data.sessionId;
    const sessionHistory = await axios.get(BASE_URL + '/api/session/' + sessionId);
    console.log('   History:', sessionHistory.data);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();
