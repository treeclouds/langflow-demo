// db.js
const Database = require('better-sqlite3');
const db = new Database('users.db');
const bcrypt = require("bcrypt");

// Create the users table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  )
`).run();

// Create super admin if not exists
const existingAdmin = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");

if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync("admin", 10); // Synchronous version for startup
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", hashedPassword, "admin");
  console.log("✅ Super user 'admin' created");
} else {
  console.log("ℹ️ Super user 'admin' already exists");
}

module.exports = db;
