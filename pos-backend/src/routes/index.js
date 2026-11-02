import { Router } from 'express';

const router = Router();

// Health check
router.get('/health', (_req, res) =>
  res.json({ success: true, status: 'ok', uptime: process.uptime() })
);

// Mount module routes here as you build them:
// router.use('/auth',     authRoutes);
// router.use('/products', productRoutes);
// router.use('/sales',    saleRoutes);

export default router;