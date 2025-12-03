const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key'; // Use an environment variable in production

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
}

// Login route handler
async function login(req, res) {
  const { username, password } = req.body;

  db.get('SELECT * FROM admin WHERE username = ?', [username], async (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
  });
}

// Function to create a default admin if one doesn't exist
async function createDefaultAdmin() {
  const defaultUsername = 'admin';
  const defaultPassword = 'password'; // Change this in a real application

  db.get('SELECT * FROM admin WHERE username = ?', [defaultUsername], async (err, admin) => {
    if (!admin) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      db.run('INSERT INTO admin (username, password) VALUES (?, ?)', [defaultUsername, hashedPassword]);
      console.log('Default admin user created.');
    }
  });
}

module.exports = {
  authenticateToken,
  login,
  createDefaultAdmin,
};
