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
    logger.error('FIRECRAWL_API_KEY is not set.');
    process.exit(1);
  }
  app.listen(config.port, () => {
    logger.info(`Sri Lanka News API running on port ${config.port}`);
    refreshAll();
    setInterval(refreshAll, config.refreshInterval);
  });
}

module.exports = app;
