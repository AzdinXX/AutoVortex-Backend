const db = require('../db');

module.exports = (req, res, next) => {
  // Check for user_id in body or query (for regular users)
  const userId = req.body?.user_id || req.query?.user_id;
  
  // Check for Authorization header (for admin requests)
  const authHeader = req.headers.authorization;
  
  if (!userId && !authHeader) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  // If we have user_id, use that
  if (userId) {
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
  } else {
    // For admin requests, we'll use a simple approach - check if user exists
    // In a real app, you'd verify JWT tokens here
    const adminId = req.body?.admin_id || req.query?.admin_id;
    
    if (!adminId) {
      return res.status(401).json({ error: "Admin authentication required" });
    }
    
    db.query('SELECT id, role FROM users WHERE id = ? AND role = "admin"', [adminId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ error: "Admin access denied" });
      }

      req.user = { id: adminId, role: results[0].role };
      next();
    });
  }
};