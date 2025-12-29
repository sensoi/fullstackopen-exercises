const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const cors = require('cors')

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
