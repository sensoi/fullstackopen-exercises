const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

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