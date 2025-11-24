# RAG Chatbot Backend - Quick Start

## Setup Complete! ✅

Your backend is now fully implemented with:
- ✅ News scraping service (RSS feeds)
- ✅ Jina AI embeddings (v3, 1024 dimensions)
- ✅ Qdrant vector database
- ✅ Redis session management
- ✅ Google Gemini LLM
- ✅ Complete RAG pipeline
- ✅ REST API endpoints

## Next Steps (IMPORTANT - DO THIS NOW!)

### 1. Ingest News Data (REQUIRED BEFORE TESTING)

Run this command to fetch 50 news articles and store them in Qdrant:

```bash
npm run ingest
```

This will:
- Fetch 50 articles from BBC, NYT, WSJ RSS feeds
- Generate embeddings using Jina AI
- Store in Qdrant vector database
- Takes ~5-10 minutes

### 2. Start the Server (if not running)

```bash
npm run dev
```

### 3. Test the API

#### Using curl:

```bash
# Test health check
curl http://localhost:5000/health

# Test chat query
curl -X POST http://localhost:5000/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the latest news about technology?"}'

# Get session history
curl http://localhost:5000/api/session/SESSION_ID
```

#### Using the test script:

```bash
node test-api.js
```

## API Endpoints

### 1. POST /api/chat/query
Send a question and get an AI response with sources

**Request:**
```json
{
  "query": "What's happening in the world?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "sessionId": "abc-123",
  "query": "What's happening in the world?",
  "response": "Based on recent news...",
  "sources": [
    {
      "title": "Article Title",
      "url": "https://...",
      "source": "BBC News"
    }
  ],
  "timestamp": "2024-11-24T10:00:00.000Z"
}
```

### 2. GET /api/session/:sessionId
Get chat history for a session

### 3. DELETE /api/session/:sessionId
Clear session history

## Connect to Frontend

Update your frontend to call:
```
http://localhost:5000/api/chat/query
```

## Troubleshooting

If you get errors:
1. Make sure you ran `npm run ingest` first
2. Check `.env` file has all API keys
3. Verify Qdrant collection exists
4. Check Redis connection

## Environment Variables

Already configured in `.env`:
- GEMINI_API_KEY
- JINA_API_KEY
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN
- QDRANT_API_KEY
- QDRANT_URL
