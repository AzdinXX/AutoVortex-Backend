const db = require('../db');
const bcrypt = require('bcrypt');

exports.updateUserProfile = async (req, res) => {
  const { username, phone, password } = req.body;
  const image = req.file?.filename;
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: 'Missing user ID' });
  }

  try {
    const fieldsToUpdate = [];
    const values = [];

    if (username) {
      fieldsToUpdate.push('username = ?');
      values.push(username);
    }

    if (phone) {
      fieldsToUpdate.push('phone = ?');
      values.push(phone);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fieldsToUpdate.push('password = ?');
      values.push(hashedPassword);
    }

    if (image) {
      fieldsToUpdate.push('image = ?');
      values.push(image);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(userId);

    const sql = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      db.query('SELECT id, username, email, role, phone, image FROM users WHERE id = ?', [userId], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Fetch failed' });

        return res.status(200).json({ message: 'Profile updated successfully', user: rows[0] });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};