const candidatsService = require('../services/candidats.service');
const postesService = require('../services/postes.service');
const { extractTextFromPDF } = require("../utils/pdf");
const { analyzeCV } = require("../services/ai.service");

const getAll = async (req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const poste_id = req.query.poste_id || null;
    const sort = req.query.sort || "id";

    const offset = (page - 1 ) * limit;

    const result = await candidatsService.getAll(limit, offset, search, poste_id, sort);
    return res.json({
      data: result.rows,
      page,
      limit,
      poste_id,
      sort,
      total: result.total
    });

  } catch(error){
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await candidatsService.getById(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }

    return res.json(result.rows[0]);

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const create = async (req, res) => {
  try {
    const { name, email, poste_id } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name et email requis" });
    }
    const cvPath = req.file ? req.file.filename : null;

    let cvText = null;
    if(req.file){
      cvText = await extractTextFromPDF(req.file.path);
    }
    /*console.log("FILE :", req.file);*/
    /*console.log(typeof pdf);*/
    console.log("Texte extrait (100 chars):", cvText?.substring(0, 100));
    const result = await candidatsService.create(name, email, poste_id, cvPath, cvText);

    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }
    if(error.message === "POSTE_NOT_FOUND"){
      return res.status(404).json({ message: "Poste non trouvé" });
    }
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await candidatsService.update(id, name, email);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }

    return res.json(result.rows[0]);

  } catch (error) {

    if (error.code === '23505') {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await candidatsService.remove(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }

    return res.json({ message: "Candidat supprimé" });

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const analyze = async (req,res) => {
 
  try{
    const { id } = req.params;
    const candidat = await candidatsService.getById(id);
    if( candidat.rowCount === 0 ){
      return res.status(404).json({ message: "Candidat non trouvé" });
    }
    const cvText = candidat.rows[0].cv_text;
    if(!cvText){
      return res.status(400).json({ message: "Pas de CV à analyser" });
    }
    
    const result = await analyzeCV(cvText);

    if(!result){
      return res.status(500).json({ message: "Erreur IA" });
    }

    await candidatsService.updateAnalysis(
      id,
      result.summary,
      result.skills,
      result.score
    );
    return res.json(result);
    /*
    try{
      const result = await analyzeCV(cvText);
      //return res.json({ analysis: result });
      // Retourne objet le temps de mettre en place IA
      return res.json(result);

    }catch(error){
      if(error.message === "RATE_LIMIT"){
        return res.status(429).json({ message: "Trop de reqêtes IA, réessaie plus tard" });
      }
        
      return res.status(500).json({ message: "Erreur IA" });
    }
    */
 
  }catch(error){
    console.log(error);
    return res.status(500).json({ message: "Erreur Serveur" });
  }
    
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  analyze
};
