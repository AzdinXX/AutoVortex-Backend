const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');

router.get('/api/notifications', notificationController.getAllNotifications);
router.get('/api/notifications/unread', notificationController.getAllNotifications);
router.put('/api/notifications/accept/:type/:id', notificationController.acceptNotification);
router.put('/api/notifications/reject/:type/:id', notificationController.rejectNotification);
router.post('/api/notifications/reply/:type/:id', notificationController.addAdminReply);
router.get('/api/notifications/user/:id/unread', notificationController.getUserNotifications);
router.delete('/api/notifications/:type/:id', notificationController.deleteNotification);

module.exports = router;