const express = require('express');
const router = express.Router();
const carController = require('../Controllers/carController');

router.get('/options', carController.getAllCars);
router.post('/new-cars', carController.addCar);
router.delete('/car/:id', carController.deleteCar);
router.get('/car/:id', carController.getCarById);
router.put('/car/:id', carController.updateCar);

module.exports = router;