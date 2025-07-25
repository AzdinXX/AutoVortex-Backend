
const bcrypt = require('bcrypt');
const db = require('./db');

const adminEmail = 'Admin@gmail.com';
const adminPassword = 'FGH555';
const username = 'Admin';
const role = 'admin';

bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, adminEmail, hashedPassword, role], (err, result) => {
    if (err) {
      console.error('Error inserting admin user:', err);
    } else {
      console.log('Admin user created!');
    }
  });
});