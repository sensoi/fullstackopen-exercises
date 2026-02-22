const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { pool } = require('../util/db')

router.post('/', async (req, res, next) => {
  try {
    const { username, name } = req.body

    if (!username || !name) {
      return res.status(400).json({
        error: ['username and name required']
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(username)) {
      return res.status(400).json({
        error: ['username must be a valid email address']
      })
    }

    const passwordHash = await bcrypt.hash('secret', 10)

    const user = await User.create({
      username,
      name,
      password_hash: passwordHash
    })

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { read } = req.query

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    let query = `
      SELECT 
        b.id AS blog_id,
        b.url,
        b.title,
        b.author,
        b.likes,
        b.year,
        r.id AS reading_id,
        r.read
      FROM blogs b
      JOIN reading_lists r ON b.id = r.blog_id
      WHERE r.user_id = $1
    `

    const values = [id]

    if (read === 'true') {
      query += ' AND r.read = true'
    }

    if (read === 'false') {
      query += ' AND r.read = false'
    }

    const result = await pool.query(query, values)

    const readings = result.rows.map(row => ({
      id: row.blog_id,
      url: row.url,
      title: row.title,
      author: row.author,
      likes: row.likes,
      year: row.year,
      readinglists: [
        {
          id: row.reading_id,
          read: row.read
        }
      ]
    }))

    res.json({
      name: user.name,
      username: user.username,
      readings
    })

  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const { username } = req.params
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: ['name required'] })
    }

    const updated = await User.updateName(username, name)

    if (!updated) {
      return res.status(404).end()
    }

    res.json(updated)
  } catch (error) {
    next(error)
  }
})

module.exports = router