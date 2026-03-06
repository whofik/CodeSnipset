const rateLimit = require('express-rate-limit');

function setupRateLimiter(app) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      error: 'Too many requests',
      message: 'Please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use(limiter);
}

module.exports = {
  setupRateLimiter
};
