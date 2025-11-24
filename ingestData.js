require('dotenv').config();
const { fetchNewsArticles } = require('./src/services/newsService');
const { generateEmbedding } = require('./src/services/embeddingService');
const { client, COLLECTION_NAME, initCollection } = require('./src/config/vectorDB');

async function ingestNewsData() {
  try {
    console.log('Starting data ingestion...');

    await initCollection();

    console.log('Fetching news articles...');
    const articles = await fetchNewsArticles(50);
    console.log('Fetched ' + articles.length + ' articles');

    console.log('Generating embeddings and storing in Qdrant...');
    
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      
      try {
        // Truncate content to avoid API limits (max 8000 characters)
        const truncatedContent = article.content.substring(0, 8000);
        const textToEmbed = article.title + '. ' + truncatedContent;
        console.log('Processing ' + (i + 1) + '/' + articles.length + ': ' + article.title.substring(0, 50) + '...');

        const embedding = await generateEmbedding(textToEmbed);

        await client.upsert(COLLECTION_NAME, {
          wait: true,
          points: [
            {
              id: article.id,
              vector: embedding,
              payload: {
                title: article.title,
                content: article.content,
                url: article.url,
                source: article.source,
                publishedAt: article.publishedAt,
              },
            },
          ],
        });

        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error('Error processing article ' + article.title + ':', error.response?.data?.detail || error.message);
      }
    }

    console.log('Data ingestion completed successfully!');
    console.log('Total articles stored: ' + articles.length);

    const collectionInfo = await client.getCollection(COLLECTION_NAME);
    console.log('Collection info:', collectionInfo);

    process.exit(0);
  } catch (error) {
    console.error('Error during data ingestion:', error);
    process.exit(1);
  }
}

ingestNewsData();
