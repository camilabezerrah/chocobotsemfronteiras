require('dotenv').config();

const checkAdminAuth = (req, res, next) => {
  const sentPassword = req.headers['authorization'];
  if (!sentPassword || sentPassword !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

module.exports = checkAdminAuth;