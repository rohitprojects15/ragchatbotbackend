require('dotenv').config();
const Redis = require('ioredis');

const redis = new Redis(process.env.UPSTASH_REDIS_REST_TOKEN);

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

module.exports = redis;
