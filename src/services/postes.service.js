const pool = require('../config/db');

const getAll = async () => {
  return await pool.query('SELECT * FROM postes ORDER BY created_at DESC');
};

const getById = async (id) => {
  return await pool.query(
    'SELECT * FROM postes WHERE id = $1', [id]
  );
};

const create = async (titre, description) => {
  return await pool.query(
    'INSERT INTO postes (titre, description) VALUES ($1, $2) RETURNING *',
    [titre, description]
  );
};

const update = async (id, titre, description) => {
  return await pool.query(
    'UPDATE postes SET titre = $1, description = $2 WHERE id = $3 RETURNING *',
    [titre, description, id]
  );
};

const remove = async (id) => {
  return await pool.query(
    'DELETE FROM postes WHERE id = $1 RETURNING *',
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
