require('dotenv').config()

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

console.log('connecting to MongoDB...')
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const Person = require('./models/person')

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use(express.json())
app.use(morgan('dev'))

// Serve static frontend from /dist if present
app.use(express.static(path.join(__dirname, 'dist')))

// ----- API routes -----

// GET all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

// GET one person by id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(error => next(error))
})

// POST new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  Person.findOne({ name })
    .then(existing => {
      if (existing) {
        return res.status(400).json({ error: 'name must be unique' })
      }

      const person = new Person({ name, number })
      return person.save()
        .then(savedPerson => res.status(201).json(savedPerson))
    })
    .catch(error => next(error))
})

// UPDATE person (PUT)
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const updated = { name, number }

  Person.findByIdAndUpdate(req.params.id, updated, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then(result => {
      if (result) res.json(result)
      else res.status(404).end()
    })
    .catch(error => next(error))
})

// DELETE person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

// INFO route
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
    })
    .catch(error => next(error))
})

// Serve React frontend for any non-API GET request
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  }
  next()
})

// Unknown endpoint handler for anything not handled above
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

// Error handling middleware (must be last)
app.use((error, req, res, next) => {
  console.error(error.name, error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.message === 'Not allowed by CORS') {
    return res.status(401).json({ error: 'CORS origin not allowed' })
  }

  next(error)
})
