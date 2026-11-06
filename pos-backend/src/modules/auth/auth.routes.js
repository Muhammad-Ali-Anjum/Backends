const router = require('express').Router();
const ctrl = require('./auth.controller');
const { registerSchema, loginSchema, refreshSchema, validate } = require('./auth.validators');
const { authenticate } = require('../../common/middleware/auth.middleware');

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login',    validate(loginSchema),    ctrl.login);
router.post('/refresh',  validate(refreshSchema),  ctrl.refresh);   // ⭐ new
router.get('/me',        authenticate,             ctrl.me);

module.exports = router;