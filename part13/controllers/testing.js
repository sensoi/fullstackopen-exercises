const router = require('express').Router()
const { pool } = require('../util/db')

router.post('/reset', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM reading_lists')
    await pool.query('DELETE FROM blogs')
    await pool.query('DELETE FROM sessions')
    await pool.query('DELETE FROM users')

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router