// Sri Lanka News API
// Developer: GridX Dev
// Version: 1.0.0

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const logger = require('./utils/logger');
const routes = require('./routes/news');
const { refreshAll } = require('./services/newsService');

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
}));

// Global branding headers
app.use((_req, res, next) => {
  res.setHeader('X-Developer', 'GridX Dev');
  res.setHeader('X-Powered-By', 'Sri Lanka News API');
  next();
});

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use('/', routes);

app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found.' }));
app.use((err, _req, res, _next) => {
  logger.error(err.message);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// Local dev only
if (require.main === module) {
  if (!config.firecrawlApiKey) {
    logger.error('API_KEY is not set.');
    process.exit(1);
  }
  app.listen(config.port, () => {
    console.log('=================================');
    console.log('Sri Lanka News API');
    console.log('Developer: GridX Dev');
    console.log('Version: 1.0.0');
    console.log('==============');
    refreshAll();
    setInterval(refreshAll, config.refreshInterval);
  });
}

module.exports = app;
