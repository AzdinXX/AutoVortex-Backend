const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const db = require("./db");
const cors = require("cors");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(require('./Routes/auth'));
app.use(require('./Routes/cars'));
app.use(require('./Routes/rentals'));
app.use(require('./Routes/notifications'));
app.use(require('./Routes/users'));
app.use(require('./Routes/comments'));

// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});