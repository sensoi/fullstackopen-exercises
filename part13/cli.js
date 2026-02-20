require('dotenv').config()
const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL
})

const main = async () => {
  try {
    await client.connect()
    const result = await client.query('SELECT * FROM blogs')
    
    result.rows.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })

    await client.end()
  } catch (error) {
    console.error('Error connecting to database:', error)
  }
}

main()
