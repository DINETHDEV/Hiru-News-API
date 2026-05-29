const FirecrawlApp = require('@mendable/firecrawl-js').default;
const config = require('../config');
const { retry } = require('../utils/retry');
const logger = require('../utils/logger');

const firecrawl = new FirecrawlApp({ apiKey: config.firecrawlApiKey });

/**
 * Scrape a URL and extract news articles from the markdown content.
 * Returns an array of { title, url, summary } objects.
 */
async function scrapeNews(url, category) {
  return retry(async () => {
    logger.info(`Scraping [${category}]: ${url}`);
    const result = await firecrawl.scrapeUrl(url, {
      formats: ['markdown'],
      onlyMainContent: true,
    });

    if (!result.success) throw new Error(`Scrape error: ${result.error}`);

    return parseArticles(result.markdown, url, category);
  }, { attempts: 3, delayMs: 2000, label: `scrape:${category}` });
}

/**
 * Parse markdown into article objects.
 * Hiru News markdown typically has lines like: [Title](url)
 */
function parseArticles(markdown, baseUrl, category) {
  if (!markdown) return [];

  const articles = [];
  const seen = new Set();

  // Match markdown links: [Title](url)
  const linkRegex = /\[([^\]]{10,200})\]\((https?:\/\/[^\)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(markdown)) !== null) {
    const title = match[1].trim();
    const url = match[2].trim();

    // Filter: must be a hirunews article link, skip duplicates/nav links
    if (!url.includes('hirunews.lk') || seen.has(url)) continue;
    if (/^(Home|Menu|Search|Login|Register|About|Contact|Privacy|Terms)/i.test(title)) continue;

    seen.add(url);
    articles.push({
      id: Buffer.from(url).toString('base64').slice(0, 16),
      title,
      url,
      category,
      publishedAt: null, // Hiru News doesn't expose timestamps in markdown
      scrapedAt: new Date().toISOString(),
    });

    if (articles.length >= 30) break;
  }

  return articles;
}

module.exports = { scrapeNews };
