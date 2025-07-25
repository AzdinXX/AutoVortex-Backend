const db = require('../db');

exports.getAllNotifications = (req, res) => {
  const sql = `
    SELECT rentals.*, users.username AS user_name, users.phone AS user_phone, 
           users.image AS user_image, cars.brand AS car_name
    FROM rentals
    JOIN users ON rentals.user_id = users.id
    JOIN cars ON rentals.car_id = cars.id
    ORDER BY rentals.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};


exports.deleteNotification = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM rentals WHERE id = ?', [id], err => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.status(200).json({ message: 'Deleted' });
  });
};


exports.getUserNotifications = (req, res) => {
  const userId = req.params.id;
  db.query("SELECT COUNT(*) AS unreadCount FROM rentals WHERE user_id = ? AND status = 'pending'", [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data[0]); 
  });
};

exports.acceptNotification = (req, res) => {
  const rentalId = req.params.id;
  db.query('UPDATE rentals SET status=? WHERE id=?', ["confirmed", rentalId], (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: 'Rental accepted' });
  });
};

exports.rejectNotification = (req, res) => {
  const rentalId = req.params.id;
  db.query('UPDATE rentals SET status=? WHERE id=?', ["cancelled", rentalId], (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: 'Rental rejected' });
  });
};

exports.getUserNotifications = (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM rentals WHERE user_id = ?", [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};