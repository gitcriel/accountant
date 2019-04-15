const variables = require('../constants/GenericQueries').queryVariables

module.exports = {
  specifyTable: (sql, table) => sql.replace(variables.table, table),
  specifyParent: (sql, parentColumnName) => sql.replace(variables.parentColumn, parentColumnName),
  specifyInsertColumns: (sql, columns) => {
    let columnString = columns.join()
    let columnValuesArray = []
    for(let i=1;i<=columns.length;i++) {
      columnValuesArray.push('$' + i)
    }
    let columnValueString = columnValuesArray.join()

    return sql.replace(variables.insertColumns, columnString)
              .replace(variables.insertValues, columnValueString)
  },
  specifyUpdateColumns: (sql, columns) => {
    let updateColumnsAndValues = []
    let i = 2
    for(let column of columns) {
      updateColumnsAndValues.push(column + '=$' + i++) 
    }

    return sql.replace(variables.updateColumns, updateColumnsAndValues.join())
  }
}