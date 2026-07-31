const mongoose = require('mongoose');
const Roadmap = require('../models/Roadmap');
const { extractResumeText } = require('../services/resumeParser');
const { generateRoadmap } = require('../services/geminiService');

const MAX_STORED_RESUME_CHARS = 20000;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createRoadmap = async (req, res) => {
  try {
    const { targetRole, jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: { code: 'NO_FILE', message: 'A resume PDF file is required' } });
    }
    if (typeof targetRole !== 'string' || !targetRole.trim()) {
      return res.status(400).json({ error: { code: 'INVALID_ROLE', message: 'Target role is required' } });
    }
    if (typeof jobDescription !== 'string' || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: { code: 'INVALID_JD', message: 'Job description must be at least 50 characters' } });
    }

    let resumeText;
    try {
      resumeText = await extractResumeText(req.file.buffer);
    } catch (err) {
      return res.status(422).json({ error: { code: 'PDF_PARSE_FAILED', message: 'Could not read text from this PDF. Try a different file.' } });
    }

    let aiResult;
    try {
      aiResult = await generateRoadmap(resumeText, targetRole.trim(), jobDescription.trim());
    } catch (err) {
      console.error('Gemini error:', err.message);
      if (err.message === 'AI_RATE_LIMITED') {
        return res.status(429).json({ error: { code: 'AI_RATE_LIMITED', message: 'The AI service is busy right now. Please wait a minute and try again.' } });
      }
      return res.status(502).json({ error: { code: 'AI_FAILED', message: 'AI analysis failed. Please try again.' } });
    }

    const roadmap = await Roadmap.create({
      userId: req.user.id,
      targetRole: targetRole.trim(),
      jobDescription: jobDescription.trim().slice(0, 5000),
      resumeText: resumeText.slice(0, MAX_STORED_RESUME_CHARS),
      matchedSkills: aiResult.matchedSkills || [],
      gapSkills: aiResult.gapSkills || [],
      roadmapSteps: (aiResult.roadmapSteps || []).map((step) => ({ ...step, completed: false })),
    });

    const responseRoadmap = roadmap.toObject();
    delete responseRoadmap.resumeText;

    return res.status(201).json(responseRoadmap);
  } catch (error) {
    console.error('Create roadmap error:', error.message);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong creating the roadmap' } });
  }
};

const listRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id })
      .select('targetRole createdAt roadmapSteps')
      .sort({ createdAt: -1 });

    const summaries = roadmaps.map((r) => {
      const total = r.roadmapSteps.length;
      const completed = r.roadmapSteps.filter((s) => s.completed).length;
      return {
        _id: r._id,
        targetRole: r.targetRole,
        createdAt: r.createdAt,
        totalSteps: total,
        completedSteps: completed,
      };
    });

    return res.status(200).json(summaries);
  } catch (error) {
    console.error('List roadmaps error:', error.message);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

const getRoadmap = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap not found' } });
    }

    const roadmap = await Roadmap.findById(req.params.id).select('-resumeText');
    if (!roadmap) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap not found' } });
    }
    if (roadmap.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'This roadmap does not belong to you' } });
    }
    return res.status(200).json(roadmap);
  } catch (error) {
    console.error('Get roadmap error:', error.message);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

const updateProgress = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap not found' } });
    }

    const { stepId, completed } = req.body;
    if (typeof stepId !== 'string' || !stepId || typeof completed !== 'boolean') {
      return res.status(400).json({ error: { code: 'INVALID_BODY', message: 'stepId and a boolean completed value are required' } });
    }

    const roadmap = await Roadmap.findById(req.params.id).select('-resumeText');
    if (!roadmap) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap not found' } });
    }
    if (roadmap.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'This roadmap does not belong to you' } });
    }

    const step = roadmap.roadmapSteps.find((s) => s.stepId === stepId);
    if (!step) {
      return res.status(404).json({ error: { code: 'STEP_NOT_FOUND', message: 'Step not found in this roadmap' } });
    }

    step.completed = completed;
    await roadmap.save();

    return res.status(200).json(roadmap);
  } catch (error) {
    console.error('Update progress error:', error.message);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

const deleteRoadmap = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap not found' } });
    }

    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap not found' } });
    }
    if (roadmap.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'This roadmap does not belong to you' } });
    }
    await roadmap.deleteOne();
    return res.status(200).json({ message: 'Roadmap deleted' });
  } catch (error) {
    console.error('Delete roadmap error:', error.message);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

module.exports = { createRoadmap, listRoadmaps, getRoadmap, updateProgress, deleteRoadmap };