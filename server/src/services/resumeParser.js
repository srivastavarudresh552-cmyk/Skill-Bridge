
const pdfParse = require("pdf-parse");

const extractResumeText = async (fileBuffer) => {
  const data = await pdfParse(fileBuffer);

  const text = data.text.trim();

  if (!text || text.length < 20) {
    throw new Error("EMPTY_PDF");
  }

  return text;
};

module.exports = { extractResumeText };