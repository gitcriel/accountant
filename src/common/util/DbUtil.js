const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
})

const QUERIES = {
  GET_ALL: "SELECT * FROM $table",
  GET_ALL_BY_PARENT: "SELECT * FROM $table WHERE $parentColumn=$1",
  GET_ONE: "SELECT * FROM $table WHERE id=$1",
  CREATE: "INSERT INTO $table($columns) VALUES ($values) RETURNING *",
  UPDATE: "UPDATE $table SET $columnAndValues WHERE id=$1",
  DELETE: "DELETE FROM $table WHERE id=$1"
}

const QUERY_VARIABLES = {
  TABLE: '$table',
  INSERT_COLUMNS: '$columns',
  INSERT_VALUES: '$values',
  PARENT_COLUMN: '$parentColumn',
  UPDATE_COLUMNS: '$columnAndValues'
}

module.exports = {
  getAll: async (table) => {
    let sql = QUERIES.GET_ALL
    sql = specifyTable(sql, table)   

    const result = await executeQuery(sql, values)
    return result.rows.length === 0 ? [] : result.rows
  },
  getAllByParent: async (table, parentColumnName, parentId) => {
    let sql = QUERIES.GET_ALL_BY_PARENT
    sql = specifyTable(sql, table)
    sql = specifyParent(sql, parentColumnName)

    const result = await executeQuery(sql, [parentId])
    return result.rows.length === 0 ? [] : result.rows
  },
  getOne: async (table, id) => {
    let sql = QUERIES.GET_ONE
    sql = specifyTable(sql, table)

    const result = await executeQuery(sql, [id])
    return result.rows.length === 0 ? null : result.rows[0]
  },
  create: async (table, columns, values) => {
    let sql = QUERIES.CREATE
    sql = specifyTable(sql, table)
    sql = specifyInsertColumns(sql, columns)

    const result = await executeQuery(sql, values)
    return result.rows.length === 0 ? null : result.rows[0]
  },
  update: async (table, columns, values) => {
    let sql = QUERIES.UPDATE
    sql = specifyTable(sql, table)
    sql = specifyUpdateColumns(sql, columns)
    await executeQuery(sql, values)
  },
  delete: async (table, id) => {
    let sql = QUERIES.DELETE
    sql = specifyTable(sql, table)
    await executeQuery(sql, [id])
  },
  findOne: async (sql, criteria) => {
    const result = await executeQuery(sql, criteria)
    return result.rows.length === 0 ? null : result.rows[0]
  },
  executeQuery: async (sql, criteria) => {
    const result = await executeQuery(sql, criteria)
    return result.rows.length === 0 ? null : result.rows[0]
  },
}

async function executeQuery(sql, values) {
  const client = await pool.connect()
  const result = await client.query(sql, values)
  client.release()
  return result
}

function specifyTable(sql, table) {
  return sql.replace(QUERY_VARIABLES.TABLE, table)
}

function specifyParent(sql, parentColumnName) {
  return sql.replace(QUERY_VARIABLES.PARENT_COLUMN, parentColumnName)
}

function specifyInsertColumns(sql, columns) {
  let columnString = columns.join()
  let columnValuesArray = []
  for(let i=1;i<=columns.length;i++) {
    columnValuesArray.push('$' + i)
  }
  let columnValueString = columnValuesArray.join()

  return sql.replace(QUERY_VARIABLES.INSERT_COLUMNS, columnString)
            .replace(QUERY_VARIABLES.INSERT_VALUES, columnValueString)
}

function specifyUpdateColumns(sql, columns) {
  let updateColumnsAndValues = []
  let i = 2
  for(let column of columns) {
    updateColumnsAndValues.push(column + '=$' + i++) 
  }

  return sql.replace(QUERY_VARIABLES.UPDATE_COLUMNS, updateColumnsAndValues.join())
}