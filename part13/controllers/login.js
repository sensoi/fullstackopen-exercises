const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { SECRET } = require('../util/config')

const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await User.findByUsername(username)

    if (!user) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }

    if (user.disabled) {
      return res.status(403).json({
        error: 'user account disabled'
      })
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!passwordCorrect) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

    // Store session in DB
    await Session.create(user.id, token)

    res.json({
      token,
      username: user.username,
      name: user.name
    })

  } catch (error) {
    next(error)
  }
})

module.exports = router