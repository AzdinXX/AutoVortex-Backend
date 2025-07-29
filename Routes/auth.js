const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const upload = require('../Middleware/multer');

router.post('/register', upload.single('image'), authController.register);
router.post('/login', authController.login);

module.exports = router;