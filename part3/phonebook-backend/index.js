const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const app = express()

// middleware
const allowedOrigins = [
  'http://localhost:5173',   // Vite dev
  'http://localhost:3000'    // optional, CRA dev
]

// restricted CORS
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true) // allow tools like curl/postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use(express.json())
app.use(morgan('dev'))

// serve frontend build (dist) if present
app.use(express.static(path.join(__dirname, 'dist')))

// fake DB
let persons = [
  { id: 1, name: 'Aria', number: '12345' },
  { id: 2, name: 'Ben', number: '67890' }
]

// routes
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) return res.json(person)
  res.status(404).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const id = Math.floor(Math.random() * 1000000)
  const newPerson = { id, name: body.name, number: body.number }
  persons = persons.concat(newPerson)
  res.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})


// fallback: send React app for any GET request that is NOT an API route
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  }
  next()
})


// unknown endpoint handler
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})


// start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
