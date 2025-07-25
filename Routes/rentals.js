const express = require('express');
const router = express.Router();
const rentalController = require('../Controllers/rentalController');

router.post('/api/rentals', rentalController.createRental);

module.exports = router;