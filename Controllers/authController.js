const bcrypt = require('bcrypt');
const db = require('../db');
const upload = require('../Middleware/multer');

exports.register = async (req, res) => {
  const { username, email, password, phone } = req.body;
  const image = req.file?.filename || null;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "client";

    const sql = 'INSERT INTO users (username, email, password, role, phone, image) VALUES (?, ?, ?, ?, ?, ?)';
   db.query(sql, [username, email, hashedPassword, role, phone, image], (err, result) => {
  if (err) return res.status(500).json({ message: 'Database error', error: err });
  const newUser = {
    id: result.insertId,
    username,
    email,
    role,
    phone,
    image  
  };
  res.status(201).json({
    message: 'Account created!',
    user: newUser
  });
});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    if (results.length === 0) return res.status(401).json({ success: false, message: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Incorrect password' });

    res.json({
       id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
        phone: user.phone

    });
  });
};