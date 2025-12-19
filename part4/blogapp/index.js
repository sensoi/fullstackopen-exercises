const express = require('express')
const app = express()
app.use(express.json())
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
app.use('/api/users', usersRouter)




mongoose.set('strictQuery', false)

console.log('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.get('/', (req, res) => {
  res.send('Blog API running')
})

module.exports = app
    