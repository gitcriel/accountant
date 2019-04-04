const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
})

module.exports = {
  getOne: async (sql, values) => {
    const client = await pool.connect()
    const result = await client.query(sql, values)
    client.release()
  
    return result.rows.length === 0 ? null : result.rows[0]
  },
  save: async (sql, values) => {
    const client = await pool.connect()
    const result = await client.query(sql, values)
    client.release()
  
    return result.rows.length === 0 ? null : result.rows[0]
  },
  delete: async (sql, values) => {
    const client = await pool.connect()
    await client.query(sql, values)
    client.release()
  }
}
