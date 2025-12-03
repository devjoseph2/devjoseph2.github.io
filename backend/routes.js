const express = require('express');
const router = express.Router();
const db = require('./database');
const { authenticateToken, login } = require('./auth');

// Admin login
router.post('/login', login);

// Get all portfolio content
router.get('/content', (req, res) => {
  db.all('SELECT section, data FROM content', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    const portfolioData = rows.reduce((acc, row) => {
      acc[row.section] = JSON.parse(row.data);
      return acc;
    }, {});
    res.json(portfolioData);
  });
});

// Get content for a specific section
router.get('/content/:section', (req, res) => {
  const { section } = req.params;
  db.get('SELECT data FROM content WHERE section = ?', [section], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json(JSON.parse(row.data));
  });
});

// Update content for a specific section (protected)
router.put('/content/:section', authenticateToken, (req, res) => {
  const { section } = req.params;
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Data is required' });
  }

  const jsonData = JSON.stringify(data);

  // Use INSERT OR REPLACE to simplify logic (upsert)
  db.run('INSERT OR REPLACE INTO content (section, data) VALUES (?, ?)', [section, jsonData], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: `Section '${section}' updated successfully.` });
  });
});

module.exports = router;
