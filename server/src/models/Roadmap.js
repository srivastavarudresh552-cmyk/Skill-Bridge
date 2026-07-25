const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetRole: { type: String, required: true },
    jobDescription: { type: String, required: true },
    resumeText: { type: String, required: true },
    matchedSkills: [{ type: String }],
    gapSkills: [
      {
        skill: String,
        priority: { type: String, enum: ['high', 'medium', 'low'] },
        reason: String,
      },
    ],
    roadmapSteps: [
      {
        stepId: String,
        title: String,
        description: String,
        resourceLinks: [String],
        completed: { type: Boolean, default: false },
        order: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);