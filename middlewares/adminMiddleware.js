// middlewares/adminMiddleware.js

const mainAdminMiddleware = (req, res, next) => {
  if (req.user && req.user.type === 'admin' && req.user.user_name === 'mainadmin') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied: Admins only' });
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.type === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied: Admins only' });
  
}
module.exports = { mainAdminMiddleware, adminMiddleware };
