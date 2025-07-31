const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const db = require("./db");
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const offersRoutes = require('./Routes/offers');
const offerRequestsRoutes = require('./Routes/offerRequests');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created successfully');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use(require('./Routes/auth'));
app.use(require('./Routes/cars'));
app.use(require('./Routes/rentals'));
app.use(require('./Routes/notifications'));
app.use(require('./Routes/users'));
app.use(require('./Routes/comments'));
app.use('/api/offer-requests', offerRequestsRoutes);
app.use('/api/offers', offersRoutes);
// app.use(require('./Routes/admin'));


// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});