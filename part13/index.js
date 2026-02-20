require('dotenv').config()
const express = require('express')
const { Client } = require('pg')

const app = express()
app.use(express.json())

const client = new Client({
  connectionString: process.env.DATABASE_URL
})

client.connect()

app.get('/api/blogs', async (req, res) => {
  const result = await client.query('SELECT * FROM blogs')
  res.json(result.rows)
})

app.post('/api/blogs', async (req, res) => {
  const { author, url, title, likes } = req.body

  const result = await client.query(
    'INSERT INTO blogs (author, url, title, likes) VALUES ($1, $2, $3, $4) RETURNING *',
    [author, url, title, likes || 0]
  )

  res.json(result.rows[0])
})

app.delete('/api/blogs/:id', async (req, res) => {
  await client.query('DELETE FROM blogs WHERE id = $1', [req.params.id])
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
