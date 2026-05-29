const { Router } = require('express');
const { getNews, getAllNews, refreshAll, refreshCategory } = require('../services/newsService');

const router = Router();

// Auto-fetch on cache miss (critical for Vercel serverless)
async function respond(res, category) {
  let data = getNews(category);
  if (!data) {
    await refreshCategory(category);
    data = getNews(category);
  }
  if (!data) return res.status(503).json({ success: false, message: `Could not fetch "${category}" news.` });
  res.json({ success: true, ...data });
}

async function respondAll(res) {
  let data = getAllNews();
  const isEmpty = Object.values(data.categories).every(a => a.length === 0);
  if (isEmpty) await refreshAll();
  res.json({ success: true, ...getAllNews() });
}

router.get('/', (_req, res) => res.json({
  name: 'Sri Lanka News API',
  version: '1.0.0',
  endpoints: ['/news', '/news/latest', '/news/sports', '/news/business', '/news/international', '/news/entertainment'],
}));

router.get('/news',               (req, res) => respondAll(res));
router.get('/news/latest',        (req, res) => respond(res, 'latest'));
router.get('/news/international', (req, res) => respond(res, 'international'));
router.get('/news/sports',        (req, res) => respond(res, 'sports'));
router.get('/news/business',      (req, res) => respond(res, 'business'));
router.get('/news/entertainment', (req, res) => respond(res, 'entertainment'));

router.post('/news/refresh', async (_req, res) => {
  await refreshAll();
  res.json({ success: true, message: 'Refresh triggered.' });
});

module.exports = router;
