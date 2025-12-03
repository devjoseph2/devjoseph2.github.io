const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./portfolio.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create tables if they don't exist
    db.serialize(() => {
      // Admin user table
      db.run(`
        CREATE TABLE IF NOT EXISTS admin (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        )
      `);

      // Portfolio content table
      db.run(`
        CREATE TABLE IF NOT EXISTS content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          section TEXT NOT NULL,
          data TEXT NOT NULL
        )
      `);
    });
  }
});

module.exports = db;
