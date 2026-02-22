const Blog = require('../models/blog')
const authenticate = require('../util/tokenExtractor')

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

// CREATE blog (requires login)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      user_id: req.user.id
    })

    res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

// DELETE blog (requires login + ownership)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    if (Number(blog.user_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: 'only creator can delete blog' })
    }

    await Blog.remove(req.params.id)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

// UPDATE likes (no login required)
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