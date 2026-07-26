const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  createRoadmap,
  listRoadmaps,
  getRoadmap,
  updateProgress,
  deleteRoadmap,
} = require('../controllers/roadmapController');

router.post('/', protect, upload.single('resume'), createRoadmap);
router.get('/', protect, listRoadmaps);
router.get('/:id', protect, getRoadmap);
router.patch('/:id/progress', protect, updateProgress);
router.delete('/:id', protect, deleteRoadmap);

module.exports = router;