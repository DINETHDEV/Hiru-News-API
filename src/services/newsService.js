const config = require('../config');
const cache = require('../cache/newsCache');
const { scrapeNews } = require('./scraper');
const logger = require('../utils/logger');

const CATEGORIES = Object.keys(config.sources); // ['latest','international','sports','business','entertainment']

async function refreshCategory(category) {
  try {
    const articles = await scrapeNews(config.sources[category], category);
    cache.set(category, articles);
    logger.info(`Cached ${articles.length} articles for [${category}]`);
  } catch (err) {
    logger.error(`Failed to refresh [${category}]: ${err.message}`);
  }
}

async function refreshAll() {
  logger.info('Refreshing all news categories...');
  await Promise.allSettled(CATEGORIES.map(refreshCategory));
  logger.info('Refresh complete.');
}

function getNews(category) {
  const entry = cache.getWithMeta(category);
  if (!entry) return null;
  return {
    category,
    count: entry.data.length,
    updatedAt: entry.updatedAt,
    articles: entry.data,
  };
}

function getAllNews() {
  const result = {};
  for (const cat of CATEGORIES) {
    const entry = cache.getWithMeta(cat);
    result[cat] = entry ? entry.data : [];
  }
  return {
    updatedAt: new Date().toISOString(),
    categories: result,
  };
}

function startAutoRefresh() {
  refreshAll(); // initial load
  setInterval(refreshAll, config.refreshInterval);
  logger.info(`Auto-refresh every ${config.refreshInterval / 1000}s`);
}

module.exports = { startAutoRefresh, getNews, getAllNews, refreshAll };
