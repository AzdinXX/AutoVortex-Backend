const db = require('../db');

exports.createRental = (req, res) => {
  const { user_id, car_id, start_date, end_date, message } = req.body;
  
  if (!user_id || !car_id || !start_date || !end_date) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = `
    INSERT INTO rentals (user_id, car_id, start_date, end_date, status, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, car_id, start_date, end_date, 'pending', message], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.status(201).json({ message: 'Rental request created!' });
  });
};