const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

let persons = [
  { id: 1, name: 'Aria', number: '12345' },
  { id: 2, name: 'Ben', number: '67890' }
]


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

app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
