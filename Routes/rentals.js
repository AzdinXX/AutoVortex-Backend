const express = require('express');
const router = express.Router();
const rentalController = require('../Controllers/rentalController');
const userAuth = require('../Middleware/userAuth');

router.post('/api/rentals', userAuth, rentalController.createRental);

module.exports = router;