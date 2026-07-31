const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillBridge API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/roadmaps', roadmapRoutes);

app.use((req, res) => {
  res.status(404).json({ error: { code: 'ROUTE_NOT_FOUND', message: 'This endpoint does not exist' } });
});

// Global error handler — catches multer errors, malformed JSON bodies, and anything unhandled
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  return res.status(400).json({ error: { code: 'REQUEST_ERROR', message: err.message } });
});

module.exports = app;