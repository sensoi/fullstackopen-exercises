const router = require('express').Router()
const Blog = require('../models/blog')

const blogFinder = async (req, res, next) => {
  const blog = await Blog.getById(req.params.id)

  if (!blog) {
    return res.status(404).end()
  }

  req.blog = blog
  next()
}

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    const updated = await Blog.updateLikes(
      req.blog.id,
      req.body.likes
    )

    res.json(updated)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res) => {
  const blogs = await Blog.getAll()
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  await Blog.remove(req.blog.id)
  res.status(204).end()
})

module.exports = router