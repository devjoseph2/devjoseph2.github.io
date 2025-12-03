const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes');
const { createDefaultAdmin } = require('./auth');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api', apiRoutes);

// Create a default admin user on startup if one doesn't exist
createDefaultAdmin();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
