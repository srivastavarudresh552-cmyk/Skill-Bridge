const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = 'gemini-3.1-flash-lite';

const buildPrompt = (resumeText, targetRole, jobDescription) => `
You are a career skills analyst. Compare the candidate's resume against the target role and job description below.

RESUME TEXT:
"""
${resumeText.slice(0, 6000)}
"""

TARGET ROLE: ${targetRole}

JOB DESCRIPTION:
"""
${jobDescription.slice(0, 3000)}
"""

Respond with ONLY valid JSON (no markdown fences, no extra text) in exactly this shape:
{
  "matchedSkills": ["skill1", "skill2"],
  "gapSkills": [
    { "skill": "TypeScript", "priority": "high", "reason": "short reason" }
  ],
  "roadmapSteps": [
    { "stepId": "step-1", "title": "Learn X", "description": "short description", "resourceLinks": ["https://..."], "order": 1 }
  ]
}

Rules:
- matchedSkills: skills the candidate already has that are relevant to the target role.
- gapSkills: 3 to 6 skills the candidate is missing, each with priority "high", "medium", or "low".
- roadmapSteps: 5 to 10 ordered, actionable learning steps to close the gaps, each with a unique stepId like "step-1", "step-2".
- Output must be parseable directly by JSON.parse(). Do not wrap it in markdown code fences.
`;

const cleanJsonResponse = (rawText) => {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '').replace(/```$/, '').trim();
  }
  return cleaned;
};

const generateRoadmap = async (resumeText, targetRole, jobDescription) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = buildPrompt(resumeText, targetRole, jobDescription);

  const attempt = async (extraInstruction = "") => {
    const result = await model.generateContent(prompt + extraInstruction);

    const rawText = result.response.text();

    console.log("========== RAW GEMINI RESPONSE ==========");
    console.log(rawText);
    console.log("=========================================");

    const cleaned = cleanJsonResponse(rawText);

    return JSON.parse(cleaned);
  };

  try {
    return await attempt();
  } catch (firstError) {
    console.error("First attempt failed:");
    console.error(firstError);

    try {
      return await attempt(
        "\n\nIMPORTANT: Return ONLY valid JSON. No markdown. No explanation."
      );
    } catch (secondError) {
      console.error("Second attempt failed:");
      console.error(secondError);

      throw secondError;
    }
  }
};


module.exports = { generateRoadmap };