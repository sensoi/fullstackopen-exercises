const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const Session = require('../models/session')
const User = require('../models/user')

const authenticate = async (req, res, next) => {
  try {
    const authorization = req.get('authorization')

    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      return res.status(401).json({ error: 'token missing' })
    }

    const token = authorization.substring(7)

    const decodedToken = jwt.verify(token, SECRET)

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'invalid token' })
    }

    // CHECK SESSION EXISTS
    const session = await Session.findByToken(token)

    if (!session) {
      return res.status(401).json({ error: 'session expired' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user || user.disabled) {
      return res.status(403).json({ error: 'user disabled' })
    }

    req.user = user
    req.token = token

    next()

  } catch (error) {
    next(error)
  }
}

module.exports = authenticate