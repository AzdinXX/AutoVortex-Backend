const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const upload = require('../middleware/multer');

router.put('/api/users/:id', upload.single('image'), userController.updateUserProfile);

module.exports = router;