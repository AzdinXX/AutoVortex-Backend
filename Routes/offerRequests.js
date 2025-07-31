const express = require('express');
const router = express.Router();
const offerRequestController = require('../Controllers/offerRequestController');
const userAuth = require('../Middleware/userAuth');
const db = require('../db');

// Create a new offer rent request
router.post('/', userAuth, offerRequestController.createOfferRequest);

// Get all offer requests (for admin)
router.get('/', userAuth, offerRequestController.getAllOfferRequests);

// Update offer request status (for admin)
router.put('/:id/status', userAuth, offerRequestController.updateOfferRequestStatus);

// Get user's offer requests
router.get('/user/:userId', userAuth, offerRequestController.getUserOfferRequests);

// Test endpoint to get all requests (for debugging)
router.get('/test/all', (req, res) => {
  const sql = `
    SELECT or.*, u.name as user_name, u.email as user_email, o.title as offer_title, o.car_type
    FROM offer_requests or
    JOIN users u ON or.user_id = u.id
    JOIN offers o ON or.offer_id = o.id
    ORDER BY or.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    
    res.json(results);
  });
});

module.exports = router; 