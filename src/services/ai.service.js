const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const USE_MOCK =  true;

const analyzeCV = async (text) => {
  // MODE MOCK (sans API)
  if(USE_MOCK){
    console.log("MODE MOCK ACTIF");
    return{
      summary: "Candidat développeur web avec expérience en Javascript et Node.js.",
      skills: ["JavaScript", "Node.js", "SQL"],
      score: 75
    };
  }

  // MODE REEL (Si API dispo)
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es un assistant RH expert."},
        { role: "user", content: `
            Analyse ce CV et donne :

            1. Un résumé court
            2. Les compétences principales (liste)

            CV :
            ${text}
            `
        }
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    if(error.status === 429){
      console.error("Rate limit atteint");
      throw new Error("RATE_LIMIT");
    }
    console.error("Erreur OpenAI:", error);
    throw new Error("AI_ERROR");
  }

};

module.exports = { analyzeCV };
