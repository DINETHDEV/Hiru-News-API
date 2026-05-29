require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  firecrawlApiKey: process.env.FIRECRAWL_API_KEY,
  refreshInterval: parseInt(process.env.REFRESH_INTERVAL_MS) || 5 * 60 * 1000, // 5 min
  rateLimit: {
    windowMs: 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 60,
  },
  sources: {
    latest:       'https://www.hirunews.lk/',
    international:'https://www.hirunews.lk/international-news',
    sports:       'https://www.hirunews.lk/sports-news',
    business:     'https://www.hirunews.lk/business-news',
    entertainment:'https://www.hirunews.lk/entertainment-news',
  },
};
