const logger = require('./logger');

async function retry(fn, { attempts = 3, delayMs = 2000, label = 'operation' } = {}) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      logger.warn(`${label} failed (attempt ${i}/${attempts}): ${err.message}`);
      if (i === attempts) throw err;
      await new Promise(r => setTimeout(r, delayMs * i));
    }
  }
}

module.exports = { retry };
