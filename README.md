# RAG News Chatbot - Backend

> **Assignment**: Full Stack Developer Position at Voosh
> **Project**: RAG-Powered News Chatbot

Backend service for a news chatbot using Retrieval-Augmented Generation (RAG). Fetches news from RSS feeds, stores them in a vector database, and generates intelligent responses using Google Gemini AI.

## Tech Stack

- **Runtime**: Node.js with Express.js
- **AI/LLM**: Google Gemini API (gemini-1.5-flash for generation, text-embedding-004 for embeddings)
- **Vector Database**: Qdrant Cloud (semantic search)
- **Cache/Session**: Redis (Upstash) for in-memory session storage
- **Web Scraping**: Cheerio, Axios, RSS Parser
- **Real-time**: Socket.io support (optional WebSocket streaming)

## Why These Technologies?

**Google Gemini**: Free tier with good quality, handles both embeddings and text generation with the same API.

**Qdrant**: Cloud-hosted vector database with free tier, excellent for semantic search, easy JavaScript SDK.

**Redis (Upstash)**: Serverless Redis with free tier, perfect for session storage, no infrastructure to manage.

**Node.js + Express**: Fast development, great for APIs, non-blocking I/O works well with streaming.

## Installation

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/rohitprojects15/ragchatbotbackend.git
   cd ragchatbotbackend
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   JINA_API_KEY=your_jina_api_key
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   QDRANT_API_KEY=your_qdrant_key
   QDRANT_URL=your_qdrant_url
   PORT=5000
   ```

3. **Ingest news data**
   ```bash
   npm run ingest
   ```
   This fetches ~50 news articles from RSS feeds and stores them in Qdrant.

4. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

## How It Works

### RAG Pipeline

1. **News Ingestion**: Fetches articles from RSS feeds (Reuters, BBC, TechCrunch, etc.)
2. **Embedding**: Uses Google Gemini to create embeddings for each article
3. **Storage**: Stores embeddings in Qdrant vector database
4. **Query**: When user asks a question:
   - Convert question to embedding
   - Search Qdrant for top 5 relevant articles
   - Pass articles + question to Gemini
   - Generate contextual answer
   - Return response with sources

### Session Management

- Each user gets a unique session ID (format: `session_<timestamp>_<random>`)
- Chat history stored in Redis with 24-hour TTL
- History includes user messages and bot responses with timestamps

### Caching & Performance

**Redis Caching**:
- Key format: `chat:<sessionId>`
- Stores entire conversation history per session
- TTL: 24 hours (86400 seconds)
- Automatically cleans up old sessions

**Cache Configuration**:
- TTL can be changed in `chatController.js` (line 56)
- Supports cache warming by pre-loading common queries
- Deduplication logic prevents duplicate message storage

## API Endpoints


### Send Message
```
POST /api/chat/query
Body: { "query": "What's the latest tech news?", "sessionId": "session_123" }
```

### Get Session History
```
GET /api/session/:sessionId
```

### Clear Session
```
DELETE /api/session/:sessionId
```

## Project Structure

```
src/
├── config/
│   ├── vectorDB.js       # Qdrant setup
│   └── redis.js          # Redis connection
├── controllers/
│   ├── chatController.js     # Message handling + Redis storage
│   └── sessionController.js  # Session CRUD
├── routes/
│   ├── chat.js
│   └── session.js
├── services/
│   ├── embeddingService.js   # Gemini embeddings
│   ├── newsService.js        # RSS fetching
│   └── ragService.js         # RAG logic
└── index.js                  # App entry
```

## Assignment Requirements ✓

### RAG Pipeline
- [x] Ingests 50+ news articles from RSS feeds
- [x] Embeddings using Google Gemini (text-embedding-004)
- [x] Vector storage in Qdrant
- [x] Top-k retrieval for queries
- [x] Gemini API for answer generation

### Backend API
- [x] REST API with Express
- [x] Socket.io support ready
- [x] Session management with unique IDs
- [x] Fetch session history endpoint
- [x] Clear session endpoint

### Storage
- [x] Redis for in-memory chat history (per session)
- [x] TTL configuration (24 hours)
- [x] Session persistence

### Caching
- [x] Redis-based session caching
- [x] Configurable TTLs
- [x] Automatic cleanup

## Deployment

The backend can be deployed to:
- Render: Connect GitHub repo
- AWS/GCP: Docker container

Make sure to set all environment variables in your hosting platform.

## Notes

- News data updates when you run `npm run ingest`
- Redis sessions expire after 24 hours
- Vector search uses cosine similarity with score threshold 0.7
- Supports both REST and WebSocket (REST currently active)

---

**Assignment for**: Voosh Full Stack Developer Position
**Submitted by**: Rohit Gundeti (rohitrg1522@gmail.com)