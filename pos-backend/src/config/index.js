import dotenv from 'dotenv';
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  appName: process.env.APP_NAME || 'posbackend',
  appUrl: process.env.APP_URL || 'http://localhost:5000',
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  mongo: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGO_DB_NAME,
    autoIndex: process.env.MONGO_AUTO_INDEX === 'true',
    debug: process.env.MONGO_DEBUG === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

  cors: {
    origin: (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()),
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
  },

  business: {
    currency: process.env.DEFAULT_CURRENCY || 'PKR',
    timezone: process.env.DEFAULT_TIMEZONE || 'Asia/Karachi',
    locale: process.env.DEFAULT_LOCALE || 'en',
    lowStockThreshold: Number(process.env.LOW_STOCK_THRESHOLD) || 10,
  },
};

// Fail fast on missing critical vars
['mongo.uri', 'jwt.secret', 'jwt.refreshSecret'].forEach((path) => {
  const val = path.split('.').reduce((o, k) => o?.[k], config);
  if (!val) throw new Error(`Missing env var: ${path.toUpperCase()}`);
});

export default config;