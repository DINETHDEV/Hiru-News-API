# Sri Lanka News API

Live Sri Lanka news, built for integration with **Lumi AI**.

**Developer:** GridX Dev

## 🌐 Live API

| Category | URL |
|---|---|
| 📰 Latest News | https://hiru-news-ow4q995r5-no-bug-s-projects.vercel.app/news/latest |
| 📰 All News | https://hiru-news-ow4q995r5-no-bug-s-projects.vercel.app/news |
| 🏏 Sports | https://hiru-news-ow4q995r5-no-bug-s-projects.vercel.app/news/sports |
| 💼 Business | https://hiru-news-ow4q995r5-no-bug-s-projects.vercel.app/news/business |
| 🌍 International | https://hiru-news-ow4q995r5-no-bug-s-projects.vercel.app/news/international |
| 🎬 Entertainment | https://hiru-news-ow4q995r5-no-bug-s-projects.vercel.app/news/entertainment |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set your FIRECRAWL_API_KEY

# 3. Start the server
npm start

# Development (auto-reload)
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `FIRECRAWL_API_KEY` | — | **Required.** Your scraper API key |
| `PORT` | `3000` | Server port |
| `REFRESH_INTERVAL_MS` | `300000` | Cache refresh interval (ms) |
| `RATE_LIMIT_MAX` | `60` | Max requests per minute per IP |

## API Endpoints

### `GET /`
API info and available endpoints.

### `GET /news`
All categories combined.

```json
{
  "success": true,
  "updatedAt": "2026-05-30T02:00:00.000Z",
  "categories": {
    "latest": [...],
    "international": [...],
    "sports": [...],
    "business": [...],
    "entertainment": [...]
  }
}
```

### `GET /news/latest`
### `GET /news/international`
### `GET /news/sports`
### `GET /news/business`
### `GET /news/entertainment`

All category endpoints return:

```json
{
  "success": true,
  "category": "sports",
  "count": 25,
  "updatedAt": "2026-05-30T02:00:00.000Z",
  "articles": [
    {
      "id": "abc123",
      "title": "Article headline",
      "url": "https://www.hirunews.lk/...",
      "category": "sports",
      "publishedAt": null,
      "scrapedAt": "2026-05-30T02:00:00.000Z"
    }
  ]
}
```

### `POST /news/refresh`
Manually trigger a cache refresh (useful for testing).

## Project Structure

```
src/
├── server.js              # Express app entry point
├── config/
│   └── index.js           # Centralised config from env vars
├── routes/
│   └── news.js            # All route handlers
├── services/
│   ├── scraper.js         # Web scraping + markdown parsing
│   └── newsService.js     # Cache management + auto-refresh
├── cache/
│   └── newsCache.js       # In-memory cache store
└── utils/
    ├── logger.js          # Winston logger
    └── retry.js           # Retry with exponential backoff
```

## Features

- Scrapes [hirunews.lk](https://www.hirunews.lk)
- Auto-refreshes every 5 minutes (configurable)
- In-memory cache — instant responses after first load
- Retry logic with exponential backoff (3 attempts)
- CORS enabled for cross-origin access
- Rate limiting (60 req/min per IP)
- Structured logging via Winston

## Lumi AI Integration

Point Lumi AI at `http://localhost:3000/news` (or your deployed URL) to fetch all categories in one call, or use individual category endpoints for targeted queries.
