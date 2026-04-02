const pool = require('../config/db');
const fs = require("fs");
const path = require("path");

const getAll = async (limit, offset, search, poste_id, sort) => {
  const allowedSort = ["id", "name", "email"];
  const orderBy = allowedSort.includes(sort) ? sort : "id";
  let dataQuery = (`
    SELECT
      candidats.id,
      candidats.name,
      candidats.email,
      candidats.poste_id,
      COALESCE(postes.titre, 'Aucun poste assigné') AS poste_titre,
      postes.created_at AS poste_created_at,
      candidats.cv_path
    FROM candidats
    LEFT JOIN postes
      ON candidats.poste_id = postes.id
    WHERE (candidats.name ILIKE $1 
      OR candidats.email ILIKE $1)
  `);
  
  const values = [`%${search}%`];

  if (poste_id) {
    values.push(poste_id);
    dataQuery += ` AND candidats.poste_id = $${values.length}`;
  }

  values.push(limit);
  values.push(offset);

  dataQuery += `
    ORDER BY candidats.${orderBy} DESC
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const countQuery = `
    SELECT COUNT(*)
    FROM candidats
    WHERE name ILIKE $1
      OR email ILIKE $1
  `;

  const data = await pool.query(dataQuery, values);
  const total = await pool.query(countQuery, [`%${search}%`]);


  return{
    rows: data.rows,
    total: parseInt(total.rows[0].count)
  };

};

const getById = async (id) => {
  return await pool.query(
    'SELECT * FROM candidats WHERE id = $1',
    [id]
  );
};

const create = async (name, email, poste_id, cv_path, cv_text) => {
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
    'INSERT INTO candidats (name, email, poste_id, cv_path, cv_text) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, email, poste_id, cv_path, cv_text]
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
