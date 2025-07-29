const express = require('express');
const router = express.Router();
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

// Get all offers
router.get('/',  (req, res) => {
    db.query('SELECT * FROM offers ORDER BY created_at DESC', (err, offers) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch offers' });
    }   
    res.json(offers);
    });
});

// Get offer by ID
router.get('/api/offers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [offers] = await db.query('SELECT * FROM offers WHERE id = ?', [id]);
    
    if (offers.length === 0) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    res.json(offers[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch offer' });
  }
});

// Add new offer
router.post('/api/offers', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      const { 
        title, 
        description, 
        discount_percentage, 
        original_price, 
        discounted_price, 
        valid_until, 
        car_type, 
        features,
        rating,
        review_count 
      } = req.body;
      
      if (!title || !description || !discount_percentage || !original_price || !discounted_price || !valid_until || !car_type) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Get the uploaded file name if exists
      const image_url = req.file ? req.file.filename : null;

      // Parse features if it's a string
      const featuresArray = typeof features === 'string' ? JSON.parse(features) : features;

      db.query(
        `INSERT INTO offers (title, description, discount_percentage, original_price, discounted_price, valid_until, car_type, image_url, features, rating, review_count) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, 
          description, 
          discount_percentage, 
          original_price, 
          discounted_price, 
          valid_until, 
          car_type, 
          image_url, 
          JSON.stringify(featuresArray), 
          rating || 0.00, 
          review_count || 0
        ],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Error adding offer" });
          }
          res.status(201).json({ 
            message: "New offer added!",
            offerId: result.insertId,
            image_url: image_url
          });
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

// Update offer
router.put('/api/offers/:id', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      const { 
        title, 
        description, 
        discount_percentage, 
        original_price, 
        discounted_price, 
        valid_until, 
        car_type, 
        features,
        rating,
        review_count 
      } = req.body;
      const { id } = req.params;
      
      if (!title || !description || !discount_percentage || !original_price || !discounted_price || !valid_until || !car_type) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Get the uploaded file name if exists
      const image_url = req.file ? req.file.filename : req.body.image_url;

      // Parse features if it's a string
      const featuresArray = typeof features === 'string' ? JSON.parse(features) : features;

      db.query(
        `UPDATE offers SET title=?, description=?, discount_percentage=?, original_price=?, discounted_price=?, valid_until=?, car_type=?, image_url=?, features=?, rating=?, review_count=? WHERE id=?`,
        [
          title, 
          description, 
          discount_percentage, 
          original_price, 
          discounted_price, 
          valid_until, 
          car_type, 
          image_url, 
          JSON.stringify(featuresArray), 
          rating || 0.00, 
          review_count || 0, 
          id
        ],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Update failed' });
          }
          
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Offer not found' });
          }
          
          res.json({ 
            message: 'Offer updated successfully',
            id: id,
            image_url: image_url
          });
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

// Delete offer
router.delete('/api/offers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First get the offer to check if it has an image
    const [offers] = await db.query('SELECT image_url FROM offers WHERE id = ?', [id]);
    
    if (offers.length === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Delete the offer
    await db.query('DELETE FROM offers WHERE id = ?', [id]);
    
    // TODO: Delete the image file from uploads folder if it exists
    // const fs = require('fs');
    // if (offers[0].image_url) {
    //   fs.unlink(`uploads/${offers[0].image_url}`, (err) => {
    //     if (err) console.error('Error deleting image file:', err);
    //   });
    // }
    
    res.json({ message: 'Offer deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;