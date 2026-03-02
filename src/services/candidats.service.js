const pool = require('../config/db');

const getAll = async () => {
  return await pool.query(`
    SELECT
      candidats.id,
      candidats.name,
      candidats.email,
      candidats.poste_id,
      COALESCE(postes.titre, 'Aucun poste assigné') AS poste_titre
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

const create = async (name, email, poste_id) => {
  if (poste_id) {
    const poste = await pool.query(
      'SELECT id FROM postes WHERE id = $1',
      [poste_id]
    );

    if (poste.rowCount === 0) {
      throw new Error("POSTE_NOT_FOUND");
    }
  }
  return await pool.query(
    'INSERT INTO candidats (name, email, poste_id) VALUES ($1, $2, $3) RETURNING *',
    [name, email, poste_id]
  );
};

const update = async (id, name, email) => {
  return await pool.query(
    'UPDATE candidats SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id]
  );
};

const remove = async (id) => {
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
