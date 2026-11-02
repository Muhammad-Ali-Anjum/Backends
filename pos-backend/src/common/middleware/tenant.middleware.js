// Attaches storeId from JWT for multi-tenant queries.
export const tenant = (req, _res, next) => {
  if (req.user?.storeId) req.storeId = req.user.storeId;
  next();
};