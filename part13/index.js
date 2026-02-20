const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')

app.use(express.json())
app.use('/api/blogs', blogsRouter)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.code === '23502') {
    return res.status(400).json({ error: 'missing required field' })
  }

  if (error.code === '22P02') {
    return res.status(400).json({ error: 'invalid input' })
  }

  res.status(400).json({ error: 'something went wrong' })
}

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()