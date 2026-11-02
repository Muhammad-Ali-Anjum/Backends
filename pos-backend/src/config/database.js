import mongoose from 'mongoose';
import config from './index.js';

export const connectDB = async () => {
  mongoose.set('strictQuery', true);
  if (config.mongo.debug) mongoose.set('debug', true);

  await mongoose.connect(config.mongo.uri, {
    dbName: config.mongo.dbName,
    autoIndex: config.mongo.autoIndex,
  });

  console.log(`✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

  mongoose.connection.on('error', (err) =>
    console.error('❌ MongoDB error:', err.message)
  );
  mongoose.connection.on('disconnected', () =>
    console.warn('⚠️  MongoDB disconnected')
  );
};

export const disconnectDB = async () => mongoose.disconnect();