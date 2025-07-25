const express = require('express');
const router  = express.Router();
const db      = require('../db');

// add comment
router.post('/api/comments', (req, res) => {
  const { user_id, comment, rating } = req.body;
  const sql = 'INSERT INTO comments (user_id, comment, rating) VALUES (?, ?, ?)';
  db.query(sql, [user_id, comment, rating], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to add comment' });
    res.status(201).json({ message: 'Comment added successfully' });
  });
});

// grt comments
router.get('/api/comments', (req, res) => {
  const sql = `
    SELECT c.id, c.comment, c.rating, c.created_at, u.username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch comments' });
    res.json(results);
  });
});

//delete comment
router.delete('/api/comments/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM comments WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete comment' });
    res.json({ message: 'Comment deleted successfully' });
  });
});

module.exports = router;