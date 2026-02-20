const { Pool } = require('pg')
const { DATABASE_URL } = require('./config')

const pool = new Pool({
  connectionString: DATABASE_URL
})

const connectToDatabase = async () => {
  try {
    await pool.query('SELECT 1')
    console.log('connected to the database')
  } catch (error) {
    console.error('failed to connect to database')
    process.exit(1)
  }
}

module.exports = {
  pool,
  connectToDatabase
}