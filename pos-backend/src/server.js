import http from 'http';
import app from './app.js';
import config from './config/index.js';
import { connectDB, disconnectDB } from './config/database.js';

const server = http.createServer(app);

const start = async () => {
  try {
    await connectDB();
    server.listen(config.port, () => {
      console.log(`🚀 ${config.appName} running at ${config.appUrl}${config.apiPrefix}`);
      console.log(`   env=${config.env}  port=${config.port}`);
    });
  } catch (err) {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`\n${signal} received — shutting down...`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000);
};

['SIGINT', 'SIGTERM'].forEach((s) => process.on(s, () => shutdown(s)));
process.on('unhandledRejection', (err) => { console.error('💥 Unhandled:', err); shutdown('unhandledRejection'); });

start();