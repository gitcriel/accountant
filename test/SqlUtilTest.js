const expect = require('chai').expect
const dbUtil = require('../src/common/util/SqlUtil')
const queryVariables = require('../src/common/constants/GenericQueries').queryVariables

describe('specifyTable()', function () {
  it('should replace table token with table name', function () {
    let sql = 'something ' + queryVariables.table + ' something '
    let tableName = 'test'
    let expectedValue = 'something ' + tableName + ' something '

    let filledInSql = dbUtil.specifyTable(sql, tableName)

    expect(filledInSql).to.equal(expectedValue)
  })
})

describe('specifyParent()', function () {
  it('should replace parent token with column name', function () {
    let sql = 'something ' + queryVariables.parentColumn + ' something '
    let parentColumnName = 'test'
    let expectedValue = 'something ' + parentColumnName + ' something '

    let filledInSql = dbUtil.specifyParent(sql, parentColumnName)

    expect(filledInSql).to.equal(expectedValue)
  })
})

describe('specifyInsertColumns()', function () {
  it('should replace insert sql tokens with column names and statement variables', function () {
    let sql = 'something ' + queryVariables.insertColumns + ' something ' + queryVariables.insertValues
    let columns = ['test1', 'test2', 'test3']
    let expectedValue = 'something ' + columns.join() + ' something $1,$2,$3'

    let filledInSql = dbUtil.specifyInsertColumns(sql, columns)

    expect(filledInSql).to.equal(expectedValue)
  })
})

describe('specifyUpdateColumns()', function () {
  it('should replace update sql tokens with column names and statement variables', function () {
    let sql = 'something ' + queryVariables.updateColumns + ' something '
    let columns = ['test1', 'test2', 'test3']
    let expectedValue = 'something test1=$2,test2=$3,test3=$4 something '

    let filledInSql = dbUtil.specifyUpdateColumns(sql, columns)

    expect(filledInSql).to.equal(expectedValue)
  })
})
