import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import { unauthorized, forbidden } from '../errors/AppError.js';

export const authenticate = (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw unauthorized('No token provided');

    req.user = jwt.verify(token, config.jwt.secret);
    next();
  } catch (err) {
    next(err.name === 'JsonWebTokenError' ? unauthorized('Invalid token') : err);
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(forbidden('Insufficient permissions'));
  }
  next();
};