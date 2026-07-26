const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillBridge API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/roadmaps', roadmapRoutes);

// Global error handler — catches multer errors (e.g. file too large, wrong type)
app.use((err, req, res, next) => {
  if (err) {
    console.error('Unhandled error:', err.message);
    return res.status(400).json({ error: { code: 'REQUEST_ERROR', message: err.message } });
  }
  next();
});

module.exports = app;