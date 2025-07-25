const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');

router.get('/api/notifications', notificationController.getAllNotifications);
router.get('/api/notifications/unread', notificationController.getAllNotifications);
router.put('/api/notifications/accept/:id', notificationController.acceptNotification);
router.put('/api/notifications/reject/:id', notificationController.rejectNotification);
router.get('/api/notifications/user/:id/unread', notificationController.getUserNotifications);
router.delete('/api/notifications/:id', notificationController.deleteNotification);

module.exports = router;