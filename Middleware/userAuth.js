const db = require('../db');

module.exports = (req, res, next) => {
  const userId = req.body?.user_id || req.query?.user_id;
  
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  db.query('SELECT id, role FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = { id: userId, role: results[0].role };
    next();
  });
};