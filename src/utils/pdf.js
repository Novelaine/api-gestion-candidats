const fs = require("fs");
const pdf = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  try{
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  }catch(error){
    console.error("Erreur extraction PDF:", error);
    return null;
  }
};

module.exports = { extractTextFromPDF };
