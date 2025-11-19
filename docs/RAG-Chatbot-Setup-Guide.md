# RAG Chatbot - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Get API Keys & Accounts](#get-api-keys--accounts)
3. [Local Development Setup](#local-development-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Cloud Services Setup](#cloud-services-setup)
7. [Deployment](#deployment)
8. [Testing](#testing)

---

## Prerequisites

### Install Required Software

1. **Node.js & npm**
   ```bash
   # Check if installed
   node --version  # Should be v18+
   npm --version
   ```
   If not installed: Download from https://nodejs.org/

2. **Git**
   ```bash
   # Check if installed
   git --version
   ```
   If not installed: Download from https://git-scm.com/

3. **Redis** (for local development)
   ```bash
   # Windows: Download from https://github.com/microsoftarchive/redis/releases
   # Or use Docker:
   docker run -d -p 6379:6379 redis:latest
   ```

4. **Python** (for news scraping scripts)
   ```bash
   python --version  # Should be 3.8+
   ```

---

## Get API Keys & Accounts

### 1. Google Gemini API Key (Required)

**Steps**:
1. Go to https://aistudio.google.com/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and save the API key
5. **Important**: Keep this secret!

**Save it**:
```
GEMINI_API_KEY=your_api_key_here
```

### 2. Jina Embeddings API Key (Required)

**Steps**:
1. Go to https://jina.ai/
2. Click "Sign Up" (free account)
3. Go to API section
4. Generate API key
5. Copy and save

**Save it**:
```
JINA_API_KEY=your_jina_api_key_here
```

**Alternative** (if Jina doesn't work):
- Use Hugging Face models (completely free, no API key needed)
- Use OpenAI embeddings (requires API key, costs money)

### 3. Create GitHub Account
1. Go to https://github.com
2. Sign up if you don't have an account
3. You'll push your code here

### 4. Upstash Redis (Free Cloud Redis)

**Steps**:
1. Go to https://upstash.com/
2. Sign up with GitHub or email
3. Click "Create Database"
4. Choose "Redis"
5. Select region closest to you
6. Click "Create"
7. Copy connection details:
   - UPSTASH_REDIS_REST_URL
   - UPSTASH_REDIS_REST_TOKEN

**Save it**:
```
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
```

### 5. Qdrant Cloud (Free Vector Database)

**Steps**:
1. Go to https://cloud.qdrant.io/
2. Sign up with GitHub or email
3. Click "Create Cluster"
4. Choose "Free tier" (1GB)
5. Select region
6. Click "Create"
7. Get API key from cluster settings

**Save it**:
```
QDRANT_URL=your_cluster_url
QDRANT_API_KEY=your_api_key
```

**Alternative**: Use Chroma locally (no setup needed)

### 6. Neon.tech (Optional - Free Postgres)

**Only if you want optional SQL database**:
1. Go to https://neon.tech/
2. Sign up with GitHub
3. Create new project
4. Copy connection string

**Save it**:
```
DATABASE_URL=postgresql://user:password@host/dbname
```

---

## Local Development Setup

### Step 1: Create Project Structure

```bash
# Create main project folder
mkdir rag-news-chatbot
cd rag-news-chatbot

# Create backend and frontend folders
mkdir backend frontend
```

Your structure should look like:
```
rag-news-chatbot/
├── backend/
└── frontend/
```

---

## Backend Setup

### Step 1: Initialize Backend Project

```bash
cd backend
npm init -y
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install express cors dotenv

# Redis client
npm install ioredis

# For vector DB (choose one):
npm install @qdrant/js-client-rest
# OR for Chroma:
npm install chromadb

# For embeddings & AI
npm install @google/generative-ai
npm install axios

# For news scraping
npm install cheerio node-fetch rss-parser

# Development dependencies
npm install --save-dev nodemon

# Optional: For WebSocket
npm install socket.io
```

### Step 3: Create Backend Structure

```bash
# Inside backend folder
mkdir src
cd src
mkdir routes controllers services utils config

# Create files
touch index.js
cd config
touch database.js redis.js vectorDB.js
cd ../services
touch embeddingService.js ragService.js newsService.js
cd ../controllers
touch chatController.js sessionController.js
cd ../routes
touch chat.js session.js
cd ../utils
touch logger.js
cd ../..
```

Backend structure:
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── vectorDB.js
│   ├── controllers/
│   │   ├── chatController.js
│   │   └── sessionController.js
│   ├── routes/
│   │   ├── chat.js
│   │   └── session.js
│   ├── services/
│   │   ├── embeddingService.js
│   │   ├── ragService.js
│   │   └── newsService.js
│   ├── utils/
│   │   └── logger.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Step 4: Create .env File

```bash
# Create .env in backend folder
touch .env
```

Add this content to `.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Jina Embeddings
JINA_API_KEY=your_jina_api_key_here

# Redis (Local)
REDIS_HOST=localhost
REDIS_PORT=6379

# Or Upstash Redis (Cloud)
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token

# Qdrant
QDRANT_URL=your_cluster_url
QDRANT_API_KEY=your_api_key

# Optional: Database
DATABASE_URL=your_database_url

# Session
SESSION_TTL=3600
```

### Step 5: Create .gitignore

```bash
touch .gitignore
```

Add to `.gitignore`:
```
node_modules/
.env
*.log
.DS_Store
dist/
build/
```

### Step 6: Update package.json Scripts

Edit `package.json` and add:
```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js",
  "test": "echo \"No tests yet\""
}
```

### Step 7: Create Basic Express Server

Create `src/index.js`:
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes (we'll add these later)
// app.use('/api/chat', require('./routes/chat'));
// app.use('/api/session', require('./routes/session'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 8: Test Backend

```bash
# Start the server
npm run dev
```

Open browser and go to `http://localhost:5000/health`
You should see: `{"status":"ok","message":"Server is running"}`

---

## Frontend Setup

### Step 1: Create React App

```bash
# Go back to main folder
cd ../frontend

# Create React app
npx create-react-app .
# OR if you want TypeScript:
# npx create-react-app . --template typescript
```

### Step 2: Install Dependencies

```bash
# Install SCSS support
npm install sass

# Install axios for API calls
npm install axios

# Optional: UI libraries
npm install react-icons
```

### Step 3: Create Frontend Structure

```bash
cd src
mkdir components pages services styles utils

cd components
mkdir Chat MessageList MessageInput SessionControls
cd ..

cd styles
touch global.scss variables.scss
cd ..
```

Frontend structure:
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── Chat.jsx
│   │   │   └── Chat.scss
│   │   ├── MessageList/
│   │   │   ├── MessageList.jsx
│   │   │   └── MessageList.scss
│   │   ├── MessageInput/
│   │   │   ├── MessageInput.jsx
│   │   │   └── MessageInput.scss
│   │   └── SessionControls/
│   │       ├── SessionControls.jsx
│   │       └── SessionControls.scss
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   └── HomePage.scss
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── global.scss
│   │   └── variables.scss
│   ├── utils/
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

### Step 4: Create .env File

```bash
# In frontend folder
touch .env
```

Add:
```env
REACT_APP_API_URL=http://localhost:5000
```

### Step 5: Test Frontend

```bash
npm start
```

Browser should open at `http://localhost:3000`

---

## Cloud Services Setup

### 1. Setup Vercel (Frontend Hosting)

**Steps**:
1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your frontend repo (we'll create this later)
5. Configure:
   - Framework: React
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Add environment variable:
   - `REACT_APP_API_URL` = your backend URL

### 2. Setup Render.com (Backend Hosting)

**Steps**:
1. Go to https://render.com/
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your backend repo
5. Configure:
   - Name: `rag-chatbot-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
6. Add all environment variables from your `.env` file

---

## Deployment Checklist

### Before Deploying

- [ ] All API keys are working
- [ ] Backend runs locally without errors
- [ ] Frontend runs locally without errors
- [ ] Backend and frontend can communicate
- [ ] Redis connection works
- [ ] Vector DB connection works
- [ ] RAG pipeline returns correct answers
- [ ] Session management works
- [ ] All environment variables are set

### Create GitHub Repositories

```bash
# Backend
cd backend
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rag-chatbot-backend.git
git push -u origin main

# Frontend
cd ../frontend
git init
git add .
git commit -m "Initial frontend setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rag-chatbot-frontend.git
git push -u origin main
```

---

## Testing Checklist

### Backend Tests
- [ ] GET `/health` returns 200
- [ ] POST `/api/chat` accepts message and returns response
- [ ] GET `/api/session/:id/history` returns chat history
- [ ] DELETE `/api/session/:id` clears session
- [ ] Redis stores session data
- [ ] Vector DB returns relevant passages
- [ ] Gemini API returns answers

### Frontend Tests
- [ ] App loads without errors
- [ ] Can type and send messages
- [ ] Messages display correctly
- [ ] Session ID is generated
- [ ] Reset button clears chat
- [ ] Responses stream or type out
- [ ] UI is responsive

### Integration Tests
- [ ] End-to-end chat flow works
- [ ] Multiple sessions are isolated
- [ ] Cache improves response time
- [ ] Handles errors gracefully

---

## Quick Start Commands

### Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - Redis (if local)
redis-server
```

### Access Points
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Backend Health: http://localhost:5000/health

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in .env
PORT=5001
```

### Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Or use Upstash instead of local Redis
```

### CORS Error
Make sure backend has:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### API Key Not Working
- Check if API key is in `.env`
- Restart server after changing `.env`
- Make sure no quotes around values in `.env`

---

## Next Steps

1. ✅ Complete this setup guide
2. 📝 Implement RAG pipeline
3. 🔧 Build API endpoints
4. 🎨 Create chat UI
5. 🧪 Test everything locally
6. 🚀 Deploy to cloud
7. 📹 Record demo video
8. 📧 Submit assignment

---

## Useful Commands

```bash
# Check if ports are available
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Test API endpoint
curl http://localhost:5000/health

# Check Redis
redis-cli ping

# Git commands
git status
git add .
git commit -m "message"
git push

# npm commands
npm install
npm start
npm run dev
```

---

## Need Help?

- **Node.js**: https://nodejs.org/docs
- **React**: https://react.dev/
- **Express**: https://expressjs.com/
- **Redis**: https://redis.io/docs/
- **Qdrant**: https://qdrant.tech/documentation/
- **Gemini API**: https://ai.google.dev/docs

---

Good luck with your setup! 🚀
