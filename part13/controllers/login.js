const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const SECRET = process.env.SECRET || 'SECRET_KEY'

router.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await User.findByUsername(username)

    const passwordCorrect =
      user === undefined
        ? false
        : await bcrypt.compare(password, user.password_hash)

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

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