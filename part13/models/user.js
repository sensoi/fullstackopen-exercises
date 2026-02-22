const { pool } = require('../util/db')

const create = async ({ username, name, password_hash }) => {
  const result = await pool.query(
    `INSERT INTO users (username, name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [username, name, password_hash]
  )

  return result.rows[0]
}

const findAll = async () => {
  const result = await pool.query(`
    SELECT 
      users.id,
      users.username,
      users.name,
      blogs.id AS blog_id,
      blogs.title,
      blogs.author,
      blogs.url,
      blogs.likes
    FROM users
    LEFT JOIN blogs ON blogs.user_id = users.id
    ORDER BY users.id
  `)

  const users = {}

  result.rows.forEach(row => {
    if (!users[row.id]) {
      users[row.id] = {
        id: row.id,
        username: row.username,
        name: row.name,
        blogs: []
      }
    }

    if (row.blog_id) {
      users[row.id].blogs.push({
        id: row.blog_id,
        title: row.title,
        author: row.author,
        url: row.url,
        likes: row.likes
      })
    }
  })

  return Object.values(users)
}

const findByUsername = async (username) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  )
  return result.rows[0]
}

const findById = async (id) => {
  const result = await pool.query(
    `SELECT *
     FROM users
     WHERE id = $1`,
    [id]
  )

  return result.rows[0]
}

const updateName = async (username, name) => {
  const result = await pool.query(
    `UPDATE users
     SET name = $1
     WHERE username = $2
     RETURNING *`,
    [name, username]
  )

  return result.rows[0]
}

module.exports = {
  create,
  findAll,
  findByUsername,
  findById,
  updateName
}