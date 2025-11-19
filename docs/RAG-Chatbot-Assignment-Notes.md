# RAG-Powered News Chatbot - Assignment Notes

## Assignment Overview

**Role**: Full Stack Developer at Voosh

**Project**: Build a full-stack chatbot that answers queries over a news corpus using Retrieval-Augmented Generation (RAG) pipeline.

**Key Requirement**: Every new user should be a new session with a unique session identifier.

---

## What You Need to Build

### 1. RAG Pipeline (The Core AI System)

**Steps**:
1. **Ingest ~50 news articles**
   - Use RSS feeds or web scraping
   - Sources: Reuters sitemaps, news-please library

2. **Create embeddings**
   - Use Jina Embeddings (free tier) or any open-source embeddings

3. **Store in vector database**
   - Options: Qdrant, Chroma, FAISS, Pinecone

4. **Query flow**:
   - User asks a question
   - Retrieve top-k relevant passages from vector DB
   - Send passages + question to Google Gemini API
   - Gemini generates final answer based on retrieved context

### 2. Backend (Node.js + Express)

**Required Endpoints**:
- Chat endpoint (REST API or WebSocket)
- Fetch session history
- Clear/reset session

**Storage Requirements**:
- **Redis** (Required): In-memory chat history per session
- **SQL Database** (Optional): MySQL/Postgres for persisting final transcripts

**Features**:
- Session management with unique IDs
- Caching strategy for performance

### 3. Frontend (React + SCSS)

**Chat Interface Must Have**:
- Display of past messages
- Input box for new messages
- Streaming bot responses (if possible) or typed-out reply
- Reset session button
- Clean, responsive design

### 4. Caching & Performance

- Cache session history and conversations in Redis
- Document in README:
  - TTL configuration
  - Cache warming strategies

---

## Required Tech Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| **Embeddings** | Jina Embeddings or open-source | Free tier available |
| **Vector DB** | Qdrant, Chroma, FAISS, or Pinecone | Choose one |
| **LLM API** | Google Gemini | Free trial |
| **Backend** | Node.js + Express | Required |
| **Cache** | Redis or in-memory DB | Required |
| **Database** | MySQL or Postgres | Optional |
| **Frontend** | React + SCSS | Required |

---

## Free Deployment Options (Zero Cost!)

### Frontend Hosting (React)
| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Vercel** | Unlimited projects | ⭐ Recommended |
| **Netlify** | 100GB bandwidth/month | Good option |
| **GitHub Pages** | Static hosting | Simple option |
| **Cloudflare Pages** | Unlimited bandwidth | Great option |

### Backend Hosting (Node.js/Express)
| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Render.com** | 750 hours/month | ⭐ Recommended, spins down after 15min |
| **Railway** | Free trial credits | Good for quick setup |
| **Fly.io** | Free tier available | Good performance |
| **Vercel** | Serverless functions | Can host APIs |

### Vector Database
| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Qdrant Cloud** | 1GB storage | ⭐ Easy cloud option |
| **Chroma** | Unlimited (local) | Run on your backend |
| **FAISS** | Unlimited (local) | Facebook's library |
| **Pinecone** | 1 index, 100k vectors | Cloud option |

### Redis (In-Memory Cache)
| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Upstash Redis** | 10k commands/day | ⭐ Recommended |
| **Redis Cloud** | 30MB storage | Official Redis |
| **Local Redis** | Unlimited | For development |

### Optional SQL Database
| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Neon.tech** | 512MB storage | ⭐ Serverless Postgres |
| **Supabase** | 500MB storage | Postgres with extras |
| **PlanetScale** | Free MySQL tier | Great for MySQL |

### LLM & Embeddings
| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Google Gemini** | 60 requests/min | Required for assignment |
| **Jina Embeddings** | Free tier available | Good for embeddings |
| **Hugging Face** | Free API | Alternative embeddings |

---

## Recommended Free Stack (Total Cost: $0)

```
✅ Frontend: Vercel (Free)
✅ Backend: Render.com (Free tier)
✅ Vector DB: Qdrant Cloud (Free tier) or Chroma (local)
✅ Redis: Upstash Redis (Free tier)
✅ Database: Neon.tech Postgres (Free tier) - Optional
✅ Embeddings: Jina Embeddings (Free tier)
✅ LLM: Google Gemini API (Free tier)

💰 TOTAL COST: $0
```

---

## Deliverables

Submit to: **richa@voosh.in**

### 1. List of Tech Stack Used
- Document each technology and justify your choice

### 2. Git Repositories
- **Two public repos** (frontend & backend)
- Each with clear README.md
- Well-structured code

### 3. Demo Video
Create a video (mp4 or unlisted YouTube) showing:
- Starting the frontend
- Sending queries and observing Gemini responses
- Viewing chat history
- Resetting session

### 4. Code Walkthrough
Written or video explanation covering:
- How embeddings are created, indexed, and stored
- How Redis caching & session history works
- How frontend calls API/Socket and handles responses
- Design decisions and potential improvements

### 5. Live Deployment
- Hosted, publicly accessible link
- Use any free hosting service
- Must be testable

---

## Evaluation Criteria

| Area | Weight | Focus |
|------|--------|-------|
| **End-to-End Correctness** | 35% | Does everything work? |
| **Code Quality** | 30% | Clean, maintainable code |
| **System Design & Caching** | 20% | Architecture decisions |
| **Frontend UX & Demo** | 5% | User experience |
| **Hosting** | 10% | Live deployment |

---

## Important Notes & Tips

### Limitations of Free Tiers
1. **Render.com**: Spins down after 15 min inactivity (30-60s cold start)
2. **Gemini API**: Rate limit of 60 requests/min
3. **Redis Cloud/Upstash**: Storage/command limits
4. **Vector DBs**: Storage limits on free tiers

### Pro Tips
- Run vector DB + Redis **locally during development** (unlimited, free)
- For production, use cloud free tiers
- Keep news corpus **under 50 articles** to stay within limits
- **Document which free services** you used in README
- You can use existing code/libraries (just understand them)
- Focus on making the RAG pipeline work correctly

### Development Strategy
1. Build locally first with local Redis, vector DB
2. Test thoroughly
3. Deploy to free cloud services
4. Document everything in README
5. Create demo video
6. Write code walkthrough

---

## Helpful Resources

### News Ingestion
- **news-please**: https://github.com/fhamborg/news-please
- **Reuters sitemaps**: https://www.reuters.com/arc/outboundfeeds/sitemap-index/?outputType=xml

### APIs & Services
- **Jina Embeddings**: https://jina.ai/embeddings
- **Google AI Studio** (API keys): https://aistudio.google.com/apikey

### Vector Databases
- **Qdrant quickstart**: https://qdrant.tech/documentation/quickstart/
- **Pinecone quickstart**: https://docs.pinecone.io/guides/get-started/quickstart

### Hosting
- **Render.com**: https://render.com/

### Redis
- **Redis Python client**: https://github.com/redis/redis-py

### Frontend Development
- **v0**: For generating UI
- **bolt.new**: For quick prototyping
- Or use any LLM for assistance

---

## Project Timeline Suggestion

### Phase 1: Backend & RAG Pipeline (Days 1-3)
- [ ] Set up Node.js + Express project
- [ ] Collect 50 news articles (RSS/scraping)
- [ ] Implement embedding generation
- [ ] Set up vector database
- [ ] Integrate Google Gemini API
- [ ] Test RAG pipeline

### Phase 2: Session & Caching (Day 4)
- [ ] Implement Redis session management
- [ ] Create session endpoints
- [ ] Add caching strategy
- [ ] Test session isolation

### Phase 3: Frontend (Days 5-6)
- [ ] Create React app with SCSS
- [ ] Build chat interface
- [ ] Implement API/WebSocket communication
- [ ] Add streaming/typing effect
- [ ] Add reset session button

### Phase 4: Testing & Documentation (Day 7)
- [ ] Test end-to-end flow
- [ ] Write comprehensive READMEs
- [ ] Document tech stack choices
- [ ] Document caching strategy

### Phase 5: Deployment (Day 8)
- [ ] Deploy backend to Render.com
- [ ] Deploy frontend to Vercel
- [ ] Set up cloud Redis & vector DB
- [ ] Test live deployment

### Phase 6: Demo & Submission (Day 9)
- [ ] Record demo video
- [ ] Write code walkthrough
- [ ] Prepare submission email
- [ ] Submit to richa@voosh.in

---

## Questions to Consider

Before starting, think about:
1. Which vector database fits your use case?
2. Will you use REST API or WebSockets for chat?
3. How will you handle rate limits?
4. What's your caching strategy?
5. How will you structure your code?

---

## Final Checklist Before Submission

- [ ] Both repos are public on GitHub
- [ ] READMEs are clear and comprehensive
- [ ] Code is clean and well-commented
- [ ] All endpoints work correctly
- [ ] Session management works
- [ ] Caching is implemented
- [ ] Frontend is responsive
- [ ] Demo video is recorded
- [ ] Code walkthrough is written
- [ ] Everything is deployed and accessible
- [ ] Tested the live deployment
- [ ] Email prepared with all deliverables

---

Good luck! 🚀
