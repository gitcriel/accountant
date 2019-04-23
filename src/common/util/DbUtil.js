const {Pool} = require('pg');
const sqlUtil = require('./SqlUtil');
const queries = require('../constants/GenericQueries');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

module.exports = {
  getAll: async (table) => {
    let sql = queries.getAll;
    sql = sqlUtil.specifyTable(sql, table);

    const result = await executeQuery(sql, values);
    return result.rows.length === 0 ? [] : result.rows;
  },
  getAllByParent: async (table, parentColumnName, parentId) => {
    let sql = queries.getAllByParent;
    sql = sqlUtil.specifyTable(sql, table);
    sql = sqlUtil.specifyParent(sql, parentColumnName);

    const result = await executeQuery(sql, [parentId]);
    return result.rows.length === 0 ? [] : result.rows;
  },
  getOne: async (table, id) => {
    let sql = queries.getOne;
    sql = sqlUtil.specifyTable(sql, table);

    const result = await executeQuery(sql, [id]);
    return result.rows.length === 0 ? null : result.rows[0];
  },
  create: async (table, columns, values) => {
    let sql = queries.create;
    sql = sqlUtil.specifyTable(sql, table);
    sql = sqlUtil.specifyInsertColumns(sql, columns);

    const result = await executeQuery(sql, values);
    return result.rows.length === 0 ? null : result.rows[0];
  },
  update: async (table, columns, values) => {
    let sql = queries.update;
    sql = sqlUtil.specifyTable(sql, table);
    sql = sqlUtil.specifyUpdateColumns(sql, columns);
    await executeQuery(sql, values);
  },
  delete: async (table, id) => {
    let sql = queries.delete;
    sql = sqlUtil.specifyTable(sql, table);
    await executeQuery(sql, [id]);
  },
  findOne: async (sql, criteria) => {
    const result = await executeQuery(sql, criteria);
    return result.rows.length === 0 ? null : result.rows[0];
  },
  execute: async (sql, criteria) => {
    const result = await executeQuery(sql, criteria);
    return result.rows.length === 0 ? null : result.rows[0];
  },
};

async function executeQuery(sql, values) {
  const client = await pool.connect();
  const result = await client.query(sql, values);
  client.release();
  return result;
}
