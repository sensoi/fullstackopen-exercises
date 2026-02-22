const { pool } = require('../util/db')

const create = async (userId, token) => {
  const query = `
    INSERT INTO sessions (user_id, token)
    VALUES ($1, $2)
    RETURNING *
  `

  const { rows } = await pool.query(query, [userId, token])
  return rows[0]
}

const findByToken = async (token) => {
  const query = `
    SELECT * FROM sessions
    WHERE token = $1
  `

  const { rows } = await pool.query(query, [token])
  return rows[0]
}

const deleteByToken = async (token) => {
  await pool.query(
    `DELETE FROM sessions WHERE token = $1`,
    [token]
  )
}

module.exports = {
  create,
  findByToken,
  deleteByToken
}