const Parser = require('rss-parser');
const crypto = require('crypto');
const parser = new Parser();

const NEWS_FEEDS = [
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
];

async function fetchNewsArticles(limit = 20) {
  try {
    const allArticles = [];

    for (const feedUrl of NEWS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const articles = feed.items.slice(0, Math.ceil(limit / NEWS_FEEDS.length)).map((item, index) => ({
          id: crypto.randomUUID(),
          title: item.title || 'No Title',
          content: item.contentSnippet || item.content || item.description || '',
          url: item.link || '',
          source: feed.title || feedUrl,
          publishedAt: item.pubDate || new Date().toISOString(),
        }));

        allArticles.push(...articles);
      } catch (error) {
        console.error('Error fetching from ' + feedUrl + ':', error.message);
      }
    }

    return allArticles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching news articles:', error);
    throw error;
  }
}

module.exports = { fetchNewsArticles };
