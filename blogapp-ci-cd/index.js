const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const middleware = require('./utils/middleware')
    

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

// extract token for all requests
app.use(middleware.tokenExtractor)

// blogs require authenticated user
app.use('/api/blogs', middleware.userExtractor, blogsRouter)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// testing routes (ONLY for test environment)
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

module.exports = app

app.use(cors())


app.use(express.json())

// token always extracted
app.use(middleware.tokenExtractor)

// userExtractor ONLY for blogs
app.use('/api/blogs', middleware.userExtractor, blogsRouter)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)

module.exports = app
