module.exports = {
  queryVariables: {
    table: '$table',
    insertColumns: '$columns',
    insertValues: '$values',
    parentColumn: '$parentColumn',
    updateColumns: '$columnAndValues',
  },

  getAll: 'SELECT * FROM $table',
  getAllByParent: 'SELECT * FROM $table WHERE $parentColumn=$1',
  getOne: 'SELECT * FROM $table WHERE id=$1',
  create: 'INSERT INTO $table($columns) VALUES ($values) RETURNING *',
  update: 'UPDATE $table SET $columnAndValues WHERE id=$1',
  delete: 'DELETE FROM $table WHERE id=$1',
};
