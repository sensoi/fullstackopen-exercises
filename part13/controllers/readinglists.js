const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { pool } = require('../util/db')
const { SECRET } = require('../util/config')

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    if (!blogId || !userId) {
      return res.status(400).json({
        error: 'blogId and userId required'
      })
    }

    const blogCheck = await pool.query(
      'SELECT id FROM blogs WHERE id = $1',
      [blogId]
    )

    if (blogCheck.rowCount === 0) {
      return res.status(400).json({ error: 'invalid blogId' })
    }

    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    )

    if (userCheck.rowCount === 0) {
      return res.status(400).json({ error: 'invalid userId' })
    }

    const result = await pool.query(
      `INSERT INTO reading_lists (blog_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [blogId, userId]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { read } = req.body

    if (typeof read !== 'boolean') {
      return res.status(400).json({
        error: 'read must be boolean'
      })
    }

    const authorization = req.get('authorization')

    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      return res.status(401).json({ error: 'token missing' })
    }

    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, SECRET)

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'invalid token' })
    }

    const readingEntry = await pool.query(
      'SELECT * FROM reading_lists WHERE id = $1',
      [id]
    )

    if (readingEntry.rowCount === 0) {
      return res.status(404).json({ error: 'reading list entry not found' })
    }

    const entry = readingEntry.rows[0]

    if (entry.user_id !== decodedToken.id) {
      return res.status(403).json({ error: 'forbidden' })
    }

    const updated = await pool.query(
      `UPDATE reading_lists
       SET read = $1
       WHERE id = $2
       RETURNING *`,
      [read, id]
    )

    res.json(updated.rows[0])

  } catch (error) {
    next(error)
  }
})

module.exports = router