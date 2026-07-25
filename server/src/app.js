const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

// "Hello World" — our foundation health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillBridge API is running' });
});

// Feature routes get mounted here starting Day 4:
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/roadmaps', require('./routes/roadmapRoutes'));

module.exports = app;