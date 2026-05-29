const { Router } = require('express');
const { getNews, getAllNews, refreshAll } = require('../services/newsService');

const router = Router();

const respond = (res, data, category) => {
  if (!data) {
    return res.status(503).json({
      success: false,
      message: `News for "${category}" not yet available. Try again shortly.`,
    });
  }
  res.json({ success: true, ...data });
};

router.get('/', (req, res) => res.json({
  name: 'Sri Lanka News API',
  version: '1.0.0',
  endpoints: ['/news', '/news/latest', '/news/sports', '/news/business', '/news/international', '/news/entertainment'],
}));

router.get('/news', (req, res) => res.json({ success: true, ...getAllNews() }));

router.get('/news/latest',        (req, res) => respond(res, getNews('latest'),        'latest'));
router.get('/news/international', (req, res) => respond(res, getNews('international'), 'international'));
router.get('/news/sports',        (req, res) => respond(res, getNews('sports'),        'sports'));
router.get('/news/business',      (req, res) => respond(res, getNews('business'),      'business'));
router.get('/news/entertainment', (req, res) => respond(res, getNews('entertainment'), 'entertainment'));

// Manual refresh (useful for dev/testing)
router.post('/news/refresh', async (req, res) => {
  await refreshAll();
  res.json({ success: true, message: 'Refresh triggered.' });
});

module.exports = router;
