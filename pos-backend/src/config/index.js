// import dotenv from 'dotenv';
// dotenv.config();

// const config = {
//   env: process.env.NODE_ENV || 'development',
//   port: Number(process.env.PORT) || 5000,
//   appName: process.env.APP_NAME || 'posbackend',
//   appUrl: process.env.APP_URL || 'http://localhost:5000',
//   apiPrefix: process.env.API_PREFIX || '/api/v1',

//   mongo: {
//     uri: process.env.MONGODB_URI,
//     dbName: process.env.MONGO_DB_NAME,
//     autoIndex: process.env.MONGO_AUTO_INDEX === 'true',
//     debug: process.env.MONGO_DEBUG === 'true',
//   },

//   jwt: {
//     secret: process.env.JWT_SECRET,
//     expiresIn: process.env.JWT_EXPIRES_IN || '15m',
//     refreshSecret: process.env.JWT_REFRESH_SECRET,
//     refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
//   },

//   bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

//   cors: {
//     origin: (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()),
//     credentials: process.env.CORS_CREDENTIALS === 'true',
//   },

//   rateLimit: {
//     windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
//     max: Number(process.env.RATE_LIMIT_MAX) || 100,
//   },

//   business: {
//     currency: process.env.DEFAULT_CURRENCY || 'PKR',
//     timezone: process.env.DEFAULT_TIMEZONE || 'Asia/Karachi',
//     locale: process.env.DEFAULT_LOCALE || 'en',
//     lowStockThreshold: Number(process.env.LOW_STOCK_THRESHOLD) || 10,
//   },
// };

// // Fail fast on missing critical vars
// ['mongo.uri', 'jwt.secret', 'jwt.refreshSecret'].forEach((path) => {
//   const val = path.split('.').reduce((o, k) => o?.[k], config);
//   if (!val) throw new Error(`Missing env var: ${path.toUpperCase()}`);
// });

// export default config;

// src/config/index.js
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ---------------------------------------------------------------
// Load .env relative to THIS file, not the process CWD.
// Works no matter where `npm run dev` is invoked from.
//   src/config/index.js -> ../../.env  = project root
// ---------------------------------------------------------------
const envPath = path.resolve(__dirname, '../../.env');
const loaded  = dotenv.config({ path: envPath });

if (loaded.error) {
  console.error(`[config] Failed to load .env from: ${envPath}`);
  console.error(`[config] Reason: ${loaded.error.message}`);
  console.error('[config] CWD:', process.cwd());
} else if (process.env.NODE_ENV !== 'production') {
  console.log(`[config] .env loaded from ${envPath}`);
}

// ---------------------------------------------------------------
// Small parsing helpers
// ---------------------------------------------------------------
const str  = (v, fallback)          => (v === undefined || v === '' ? fallback : v);
const num  = (v, fallback)          => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const bool = (v, fallback = false)  => {
  if (v === undefined || v === '') return fallback;
  return String(v).toLowerCase() === 'true';
};
const list = (v, fallback = [])     => {
  if (v === undefined || v === '') return fallback;
  return String(v).split(',').map(s => s.trim()).filter(Boolean);
};

// ---------------------------------------------------------------
// Build config
// ---------------------------------------------------------------
const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  port: num(process.env.PORT, 5000),
  appName: str(process.env.APP_NAME, 'posbackend'),
  appUrl: str(process.env.APP_URL, 'http://localhost:5000'),
  apiPrefix: str(process.env.API_PREFIX, '/api/v1'),

  mongo: {
    uri: process.env.MONGODB_URI,
    dbName: str(process.env.MONGO_DB_NAME, undefined),
    autoIndex: bool(process.env.MONGO_AUTO_INDEX, false),
    debug: bool(process.env.MONGO_DEBUG, false),
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: str(process.env.JWT_EXPIRES_IN, '15m'),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: str(process.env.JWT_REFRESH_EXPIRES_IN, '7d'),
  },

  bcryptSaltRounds: num(process.env.BCRYPT_SALT_ROUNDS, 12),

  cors: {
    origin: list(process.env.CORS_ORIGIN, ['http://localhost:3000']),
    credentials: bool(process.env.CORS_CREDENTIALS, false),
  },

  rateLimit: {
    windowMs: num(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: num(process.env.RATE_LIMIT_MAX, 100),
  },

  redis: {
    url: process.env.REDIS_URL,
    host: str(process.env.REDIS_HOST, '127.0.0.1'),
    port: num(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    db: num(process.env.REDIS_DB, 0),
    cacheTtl: num(process.env.CACHE_TTL, 3600),
  },

  queue: {
    prefix: str(process.env.QUEUE_PREFIX, 'pos'),
    concurrency: num(process.env.QUEUE_CONCURRENCY, 5),
  },

  logger: {
    level: str(process.env.LOG_LEVEL, 'info'),
    dir: str(process.env.LOG_DIR, 'logs'),
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: num(process.env.MAIL_PORT, 587),
    secure: bool(process.env.MAIL_SECURE, false),
    user: process.env.MAIL_USER || undefined,
    password: process.env.MAIL_PASSWORD || undefined,
    from: str(process.env.MAIL_FROM, 'posbackend <no-reply@posbackend.local>'),
  },

  storage: {
    driver: str(process.env.STORAGE_DRIVER, 'local'),
    uploadDir: str(process.env.UPLOAD_DIR, 'uploads'),
    maxUploadSizeMb: num(process.env.MAX_UPLOAD_SIZE_MB, 10),
    s3: {
      region: process.env.S3_REGION || undefined,
      bucket: process.env.S3_BUCKET || undefined,
      accessKey: process.env.S3_ACCESS_KEY || undefined,
      secretKey: process.env.S3_SECRET_KEY || undefined,
      endpoint: process.env.S3_ENDPOINT || undefined,
    },
  },

  payment: {
    defaultGateway: str(process.env.PAYMENT_DEFAULT_GATEWAY, 'cash'),
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || undefined,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || undefined,
    },
  },

  sync: {
    enabled: bool(process.env.SYNC_ENABLED, false),
    batchSize: num(process.env.SYNC_BATCH_SIZE, 100),
    tokenTtl: num(process.env.SYNC_TOKEN_TTL, 86400),
  },

  business: {
    currency: str(process.env.DEFAULT_CURRENCY, 'PKR'),
    timezone: str(process.env.DEFAULT_TIMEZONE, 'Asia/Karachi'),
    locale: str(process.env.DEFAULT_LOCALE, 'en'),
    lowStockThreshold: num(process.env.LOW_STOCK_THRESHOLD, 10),
  },
};

// ---------------------------------------------------------------
// Validation — fail fast, and report the ACTUAL env var name
// ---------------------------------------------------------------
const required = [
  { path: 'mongo.uri',           env: 'MONGODB_URI',        label: 'MongoDB connection string' },
  { path: 'jwt.secret',          env: 'JWT_SECRET',         label: 'JWT signing secret' },
  { path: 'jwt.refreshSecret',   env: 'JWT_REFRESH_SECRET', label: 'JWT refresh secret' },
];

const missing = [];
for (const { path: p, env, label } of required) {
  const value = p.split('.').reduce((o, k) => o?.[k], config);
  if (!value || String(value).trim() === '') missing.push({ env, label, path: p });
}

if (missing.length > 0) {
  console.error('\n[config] Missing required environment variables:');
  for (const { env, label, path: p } of missing) {
    console.error(`  - ${env}   (${label})   [config.${p}]`);
  }
  console.error(`\n[config] Expected .env at: ${envPath}`);
  console.error('[config] CWD:', process.cwd());
  console.error('[config] Check that the file is named exactly ".env" (no .txt, no leading chars).');
  console.error('[config] On Windows: enable "File name extensions" in Explorer to verify.\n');
  throw new Error(`Missing env var(s): ${missing.map(m => m.env).join(', ')}`);
}

// Sanity checks
if (config.jwt.secret.length < 32) {
  console.warn('[config] Warning: JWT_SECRET is shorter than 32 chars. Use a longer random secret.');
}
if (config.jwt.refreshSecret.length < 32) {
  console.warn('[config] Warning: JWT_REFRESH_SECRET is shorter than 32 chars. Use a longer random secret.');
}

export default config;