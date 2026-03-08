const pool = require('../config/db');
const fs = require("fs");
const path = require("path");

const getAll = async () => {
  return await pool.query(`
    SELECT
      candidats.id,
      candidats.name,
      candidats.email,
      candidats.poste_id,
      COALESCE(postes.titre, 'Aucun poste assigné') AS poste_titre,
      candidats.cv_path
    FROM candidats
    LEFT JOIN postes
      ON candidats.poste_id = postes.id
    `);
};

const getById = async (id) => {
  return await pool.query(
    'SELECT * FROM candidats WHERE id = $1',
    [id]
  );
};

const create = async (name, email, poste_id, cv_path) => {
  if (poste_id !== null && poste_id !== undefined) {
    const poste = await pool.query(
      'SELECT id FROM postes WHERE id = $1',
      [poste_id]
    );

    if (poste.rowCount === 0) {
      throw new Error("POSTE_NOT_FOUND");
    }
  }
  return await pool.query(
    'INSERT INTO candidats (name, email, poste_id, cv_path) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, poste_id, cv_path]
  );
};

const update = async (id, name, email) => {
  return await pool.query(
    'UPDATE candidats SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id]
  );
};

const remove = async (id) => {
  const candidat = await pool.query(
    "SELECT * FROM candidats WHERE id = $1",
    [id]
  );
  if (candidat.rowCount === 0) {
    return { rowCount: 0 };
  }

  const cvPath = candidat.rows[0].cv_path;
  if (cvPath) {
    const filePath = path.join(__dirname, "../../uploads", cvPath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  return await pool.query(
    'DELETE FROM candidats WHERE id = $1 RETURNING *',
    [id]
  );
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
