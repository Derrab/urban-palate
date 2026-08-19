function adminAuth(req, res, next) {
  const adminKey = process.env.ADMIN_KEY;
  
  if (!adminKey) {
    console.warn('ADMIN_KEY not set in environment variables');
    return res.status(401).json({ error: 'Admin authentication not configured.' });
  }

  const providedKey = req.query.key || req.headers['x-admin-key'];
  
  if (providedKey !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized. Invalid admin key.' });
  }
  
  next();
}

module.exports = adminAuth;