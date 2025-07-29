const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

exports.getAllCars = (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).send("Server error");
    res.json(results);
  });
};

exports.addCar = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      // Check if user is admin (you might want to add proper authentication middleware)
      const { brand, model, year, price_per_day, description, available, created_at } = req.body;
      
      if (!brand || !model || !year || !price_per_day) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Get the uploaded file name if exists
      const image = req.file ? req.file.filename : null;

      db.query(
        "INSERT INTO cars (brand, model, year, price_per_day, image, description, available, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [brand, model, year, price_per_day, image, description, available || true, created_at || new Date().toISOString().slice(0, 10)],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Error adding car" });
          }
          res.status(201).json({ 
            message: "New car added!",
            carId: result.insertId,
            image: image
          });
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

exports.deleteCar = (req, res) => {
  const { id } = req.params;
  
  // First get the car to check if it has an image
  db.query('SELECT image FROM cars WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Delete the car
    db.query('DELETE FROM cars WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ message: "Delete failed" });
      
      // TODO: Delete the image file from uploads folder if it exists
      // const fs = require('fs');
      // if (result[0].image) {
      //   fs.unlink(`uploads/${result[0].image}`, (err) => {
      //     if (err) console.error('Error deleting image file:', err);
      //   });
      // }
      
      res.json({ message: 'Car deleted' });
    });
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
  upload(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      const { brand, model, year, price_per_day, description, available } = req.body;
      const { id } = req.params;
      
      if (!brand || !model || !year || !price_per_day) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Get the uploaded file name if exists
      const image = req.file ? req.file.filename : req.body.image;

      // If there's a new image, we might want to delete the old one
      // For now, we'll just update with the new image name
      db.query(
        'UPDATE cars SET brand=?, model=?, year=?, price_per_day=?, image=?, description=?, available=? WHERE id=?',
        [brand, model, year, price_per_day, image, description, available, id],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Update failed' });
          }
          
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
          }
          
          res.json({ 
            message: 'Car updated successfully',
            id: id,
            image: image
          });
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};