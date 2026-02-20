const { pool } = require('../util/db')

const getAll = async () => {
  const result = await pool.query('SELECT * FROM blogs')
  return result.rows
}

const getById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM blogs WHERE id = $1',
    [id]
  )
  return result.rows[0]
}

const create = async ({ author, url, title, likes }) => {
  const result = await pool.query(
    `INSERT INTO blogs (author, url, title, likes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [author, url, title, likes ?? 0]
  )
  return result.rows[0]
}

const remove = async (id) => {
  await pool.query(
    'DELETE FROM blogs WHERE id = $1',
    [id]
  )
}

const updateLikes = async (id, likes) => {
  const result = await pool.query(
    `UPDATE blogs
     SET likes = $1
     WHERE id = $2
     RETURNING *`,
    [likes, id]
  )
  return result.rows[0]
}

module.exports = {
  getAll,
  getById,
  create,
  remove,
  updateLikes
}