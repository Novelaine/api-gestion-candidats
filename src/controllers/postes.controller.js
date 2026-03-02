const postesService = require('../services/postes.service');

const getAll = async (req, res) => {
  try {
    const result = await postesService.getAll();
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await postesService.getById(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Poste non trouvé" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const create = async (req, res) => {
  try {
    const { titre, description } = req.body;

    if (!titre || !description) {
      return res.status(400).json({ message: "Titre et description requis" });
    }

    const result = await postesService.create(titre, description);
    return res.status(201).json(result.rows[0]);

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description } = req.body;

    const result = await postesService.update(id, titre, description);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Poste non trouvé" });
    }

    return res.json(result.rows[0]);

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await postesService.remove(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Poste non trouvé" });
    }

    return res.json({ message: "Poste supprimé" });

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
