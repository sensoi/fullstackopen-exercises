const { pool } = require('../util/db')

const addToReadingList = async (blogId, userId) => {
  const result = await pool.query(
    `
    INSERT INTO reading_lists (blog_id, user_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    [blogId, userId]
  )

  return result.rows[0]
}

module.exports = {
  addToReadingList
}