const { Pool } = require('pg')
const { DATABASE_URL } = require('./config')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  connectionString: DATABASE_URL
})

const connectToDatabase = async () => {
  try {
    await pool.connect()

    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Run pending migrations
    const migrationsPath = path.join(__dirname, '..', 'migrations')
    const migrationFiles = fs.readdirSync(migrationsPath).sort()

    for (const file of migrationFiles) {
      const { rows } = await pool.query(
        'SELECT * FROM migrations WHERE name = $1',
        [file]
      )

      if (rows.length === 0) {
        const sql = fs.readFileSync(
          path.join(migrationsPath, file),
          'utf8'
        )

        await pool.query(sql)

        await pool.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        )

        console.log(`ran migration: ${file}`)
      }
    }

    console.log('connected to the database')
  } catch (error) {
    console.error('database connection failed')
    console.error(error)
    process.exit(1)
  }
}

module.exports = {
  pool,
  connectToDatabase
}

// This makes migrations run when executing: node util/db.js
if (require.main === module) {
  connectToDatabase().then(() => {
    process.exit(0)
  })
}