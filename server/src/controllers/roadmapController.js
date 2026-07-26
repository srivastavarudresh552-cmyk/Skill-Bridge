const Roadmap = require("../models/Roadmap");
const { extractResumeText } = require("../services/resumeParser");
const { generateRoadmap } = require("../services/geminiService");

const createRoadmap = async (req, res) => {
  try {
    const { targetRole, jobDescription } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({
          error: { code: "NO_FILE", message: "A resume PDF file is required" },
        });
    }
    if (!targetRole || !targetRole.trim()) {
      return res
        .status(400)
        .json({
          error: { code: "INVALID_ROLE", message: "Target role is required" },
        });
    }
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res
        .status(400)
        .json({
          error: {
            code: "INVALID_JD",
            message: "Job description must be at least 50 characters",
          },
        });
    }

    let resumeText;
    try {
      resumeText = await extractResumeText(req.file.buffer);
    } catch (err) {
      console.error("Resume Parser Error:", err);

      return res.status(422).json({
        error: {
          code: "PDF_PARSE_FAILED",
          message: err.message,
        },
      });
      //   return res.status(422).json({ error: { code: 'PDF_PARSE_FAILED', message: 'Could not read text from this PDF. Try a different file.' } });
    }

    let aiResult;
    try {
      aiResult = await generateRoadmap(
        resumeText,
        targetRole.trim(),
        jobDescription.trim(),
      );
    } catch (err) {
      console.error("Gemini error:", err.message);
      return res
        .status(502)
        .json({
          error: {
            code: "AI_FAILED",
            message: "AI analysis failed. Please try again.",
          },
        });
    }

    const roadmap = await Roadmap.create({
      userId: req.user.id,
      targetRole: targetRole.trim(),
      jobDescription: jobDescription.trim(),
      resumeText,
      matchedSkills: aiResult.matchedSkills || [],
      gapSkills: aiResult.gapSkills || [],
      roadmapSteps: (aiResult.roadmapSteps || []).map((step) => ({
        ...step,
        completed: false,
      })),
    });

    return res.status(201).json(roadmap);
  } catch (error) {
    console.error("Create roadmap error:", error.message);
    return res
      .status(500)
      .json({
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong creating the roadmap",
        },
      });
  }
};

const listRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id })
      .select("targetRole createdAt roadmapSteps")
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
    console.error("List roadmaps error:", error.message);
    return res
      .status(500)
      .json({
        error: { code: "SERVER_ERROR", message: "Something went wrong" },
      });
  }
};

const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Roadmap not found" } });
    }
    if (roadmap.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          error: {
            code: "FORBIDDEN",
            message: "This roadmap does not belong to you",
          },
        });
    }
    return res.status(200).json(roadmap);
  } catch (error) {
    console.error("Get roadmap error:", error.message);
    return res
      .status(500)
      .json({
        error: { code: "SERVER_ERROR", message: "Something went wrong" },
      });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { stepId, completed } = req.body;

    if (!stepId || typeof completed !== "boolean") {
      return res
        .status(400)
        .json({
          error: {
            code: "INVALID_BODY",
            message: "stepId and a boolean completed value are required",
          },
        });
    }

    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Roadmap not found" } });
    }
    if (roadmap.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          error: {
            code: "FORBIDDEN",
            message: "This roadmap does not belong to you",
          },
        });
    }

    const step = roadmap.roadmapSteps.find((s) => s.stepId === stepId);
    if (!step) {
      return res
        .status(404)
        .json({
          error: {
            code: "STEP_NOT_FOUND",
            message: "Step not found in this roadmap",
          },
        });
    }

    step.completed = completed;
    await roadmap.save();

    return res.status(200).json(roadmap);
  } catch (error) {
    console.error("Update progress error:", error.message);
    return res
      .status(500)
      .json({
        error: { code: "SERVER_ERROR", message: "Something went wrong" },
      });
  }
};

const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Roadmap not found" } });
    }
    if (roadmap.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          error: {
            code: "FORBIDDEN",
            message: "This roadmap does not belong to you",
          },
        });
    }
    await roadmap.deleteOne();
    return res.status(200).json({ message: "Roadmap deleted" });
  } catch (error) {
    console.error("Delete roadmap error:", error.message);
    return res
      .status(500)
      .json({
        error: { code: "SERVER_ERROR", message: "Something went wrong" },
      });
  }
};

module.exports = {
  createRoadmap,
  listRoadmaps,
  getRoadmap,
  updateProgress,
  deleteRoadmap,
};
