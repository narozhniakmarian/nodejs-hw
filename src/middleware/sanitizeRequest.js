import sanitize from 'mongo-sanitize';

export const sanitizeRequest = (req, res, next) => {
  const skipPaths = ['/auth/login', '/auth/register', '/webhook'];

  if (skipPaths.includes(req.path)) {
    return next();
  }

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
};
