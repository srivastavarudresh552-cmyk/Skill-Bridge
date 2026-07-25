const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Full prompt construction + roadmap generation logic
// gets implemented when we build the Create Roadmap feature (Day 4+).
module.exports = { genAI };