const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillBridge API is running' });
});

app.use('/api/auth', authRoutes);

// Feature routes get mounted here starting Day 5:
// app.use('/api/roadmaps', require('./routes/roadmapRoutes'));

module.exports = app;