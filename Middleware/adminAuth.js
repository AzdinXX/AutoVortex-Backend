const db = require('../db');

module.exports = (req, res, next) => {
  const adminId = req.body?.admin_id || req.query?.admin_id;
  
  if (!adminId) {
    return res.status(401).json({ error: "Admin authentication required" });
  }

  db.query('SELECT id, role FROM users WHERE id = ? AND role = "admin"', [adminId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: "Admin access required" });
    }
    
    req.admin = { id: adminId, role: results[0].role };
    next();
  });
}; 