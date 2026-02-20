const { pool } = require('../util/db')

const findAll = async (search) => {
  let query = `
    SELECT 
      blogs.id,
      blogs.author,
      blogs.url,
      blogs.title,
      blogs.likes,
      users.id AS user_id,
      users.username,
      users.name
    FROM blogs
    LEFT JOIN users ON blogs.user_id = users.id
  `

  const values = []

  if (search) {
    query += `
      WHERE blogs.title ILIKE $1
      OR blogs.author ILIKE $1
    `
    values.push(`%${search}%`)
  }

  query += ` ORDER BY blogs.likes DESC`

  const result = await pool.query(query, values)
  return result.rows
}

const create = async ({ author, url, title, likes = 0, user_id }) => {
  const result = await pool.query(
    `INSERT INTO blogs (author, url, title, likes, user_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [author, url, title, likes, user_id]
  )
  return result.rows[0]
}

const findById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM blogs WHERE id = $1',
    [id]
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

const authorStats = async () => {
  const result = await pool.query(`
    SELECT 
      author,
      COUNT(*) AS articles,
      SUM(likes) AS likes
    FROM blogs
    GROUP BY author
    ORDER BY SUM(likes) DESC
  `)

  return result.rows
}

module.exports = {
  findAll,
  create,
  findById,
  remove,
  updateLikes,
  authorStats
}