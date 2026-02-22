require('dotenv').config()

const express = require('express')
const app = express()

const { connectToDatabase, pool } = require('./util/db')

const readingListsRouter = require('./controllers/readinglists')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())
app.use('/api/readinglists', readingListsRouter)

// Health check
app.get('/', (req, res) => {
  res.status(200).send('ok')
})

// Reset database (for tests)
app.post('/api/reset', async (req, res, next) => {
  try {
    await pool.query('TRUNCATE blogs RESTART IDENTITY CASCADE')
    await pool.query('TRUNCATE users RESTART IDENTITY CASCADE')
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Central error handler
app.use((error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.code === '23505') {
    return res.status(400).json({ error: 'username must be unique' })
  }

  if (error.code === '23502') {
    return res.status(400).json({ error: 'missing required field' })
  }

  if (error.code === '22P02') {
    return res.status(400).json({ error: 'invalid input' })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }

  next(error)
})

const PORT = process.env.PORT || 3001

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})