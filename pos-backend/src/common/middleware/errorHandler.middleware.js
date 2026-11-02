import { AppError } from '../errors/AppError.js';
import config from '../../config/index.js';

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route not found: ${req.originalUrl}` },
  });
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err.code || 'INTERNAL_ERROR';

  if (statusCode >= 500) console.error('💥', err);

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message || 'Something went wrong',
      ...(err.details && { details: err.details }),
      ...(config.env === 'development' && { stack: err.stack }),
    },
  });
};