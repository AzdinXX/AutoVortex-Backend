const db = require('../db');

exports.getAllCars = (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).send("Server error");
    res.json(results);
  });
};

exports.addCar = (req, res) => {
  const { user } = req.body;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  const { brand, model, year, price_per_day, image, description, available, created_at } = req.body;
  db.query(
    "INSERT INTO cars (brand, model, year, price_per_day, image, description, available, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [brand, model, year, price_per_day, image, description, available, created_at],
    (err) => {
      if (err) return res.status(500).send("Error adding car");
      res.status(201).send("New car added!");
    }
  );
};

exports.deleteCar = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM cars WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.json({ message: 'Car deleted' });
  });
};

exports.getCarById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM cars WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (result.length === 0) return res.status(404).json({ message: 'Car not found' });
    res.json(result[0]);
  });
};

exports.updateCar = (req, res) => {
  const { brand, model, year, price_per_day, image, description, available, created_at } = req.body;
  const { id } = req.params;
  
  db.query(
    'UPDATE cars SET brand=?, model=?, year=?, price_per_day=?, image=?, description=?, available=?, created_at=? WHERE id=?',
    [brand, model, year, price_per_day, image, description, available, created_at, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Update failed' });
      res.json({ id, ...req.body });
    }
  );
};