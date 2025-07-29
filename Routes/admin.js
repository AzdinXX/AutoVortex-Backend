const express = require('express');
const router = express.Router();
const adminAuth = require('../Middleware/adminAuth');
const db = require('../db');


router.get('/api/admin/stats', adminAuth, (req, res) => {
  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM cars) as cars,
      (SELECT COUNT(*) FROM users) as users,
      (SELECT COUNT(*) FROM rentals) as rentals
  `;
  
  db.query(statsQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching stats', error: err.message });
    }
    res.json(results[0]);
  });
});


router.get('/api/users', adminAuth, (req, res) => {
  const query = 'SELECT id, username, email, role, phone, image, created_at FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
    res.json(results);
  });
});


router.delete('/api/users/:id', adminAuth, (req, res) => {
  const userId = req.params.id;
  

  db.query('SELECT role FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking user', error: err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (results[0].role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    

    db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting user', error: err.message });
      }
      res.json({ message: 'User deleted successfully' });
    });
  });
});


router.patch('/api/users/:id/status', adminAuth, (req, res) => {
  const userId = req.params.id;
  const { isActive } = req.body;
  
  db.query('UPDATE users SET is_active = ? WHERE id = ?', [isActive, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating user status', error: err.message });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User status updated successfully' });
  });
});

router.get('/api/cars', adminAuth, (req, res) => {
  const query = 'SELECT * FROM cars';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching cars', error: err.message });
    }
    res.json(results);
  });
});


router.post('/api/cars', adminAuth, (req, res) => {
  const { brand, model, year, price, description, image } = req.body;
  
  const query = 'INSERT INTO cars (brand, model, year, price, description, image) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(query, [brand, model, year, price, description, image], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding car', error: err.message });
    }
    

    db.query('SELECT * FROM cars WHERE id = ?', [results.insertId], (err, carResults) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching new car', error: err.message });
      }
      res.status(201).json(carResults[0]);
    });
  });
});


router.put('/api/cars/:id', adminAuth, (req, res) => {
  const carId = req.params.id;
  const { brand, model, year, price, description, image } = req.body;
  
  const query = 'UPDATE cars SET brand = ?, model = ?, year = ?, price = ?, description = ?, image = ? WHERE id = ?';
  
  db.query(query, [brand, model, year, price, description, image, carId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating car', error: err.message });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }
    

    db.query('SELECT * FROM cars WHERE id = ?', [carId], (err, carResults) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching updated car', error: err.message });
      }
      res.json(carResults[0]);
    });
  });
});


router.delete('/api/cars/:id', adminAuth, (req, res) => {
  const carId = req.params.id;
  
  db.query('DELETE FROM cars WHERE id = ?', [carId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting car', error: err.message });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.json({ message: 'Car deleted successfully' });
  });
});

module.exports = router; 