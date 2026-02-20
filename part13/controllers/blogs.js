const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const Blog = require('../models/blog')

const router = require('express').Router()

// GET all blogs
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query
    const blogs = await Blog.findAll(search)
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

// CREATE blog
router.post('/', async (req, res, next) => {
  try {
    const authorization = req.get('authorization')

    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      return res.status(401).json({ error: 'token missing' })
    }

    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, SECRET)

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }

    const blog = await Blog.create({
      ...req.body,
      user_id: decodedToken.id
    })

    res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

// DELETE blog (ownership controlled)
router.delete('/:id', async (req, res, next) => {
  try {
    const authorization = req.get('authorization')

    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      return res.status(401).json({ error: 'token missing' })
    }

    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, SECRET)

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }

    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    if (Number(blog.user_id) !== Number(decodedToken.id)) {
      return res.status(403).json({ error: 'only creator can delete blog' })
    }

    await Blog.remove(req.params.id)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

// UPDATE likes
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Blog.updateLikes(req.params.id, req.body.likes)
    res.json(updated)
  } catch (error) {
    next(error)
  }
})

router.get('/authors', async (req, res, next) => {
  try {
    const authors = await Blog.authorStats()
    res.json(authors)
  } catch (error) {
    next(error)
  }
})

module.exports = router