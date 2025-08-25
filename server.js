// server.js
const express = require('express');
const app = express();
app.use(express.json());

// GET /
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the CI/CD Practice API!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// GET /health
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Dummy user data
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

// GET /api/users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// POST /api/users
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
