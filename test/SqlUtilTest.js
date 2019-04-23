const expect = require('chai').expect;
const dbUtil = require('../src/common/util/SqlUtil');
const queryVariables = require('../src/common/constants/GenericQueries').queryVariables;

describe('specifyTable()', function() {
  it('should replace table token with table name', function() {
    const sql = 'something ' + queryVariables.table + ' something ';
    const tableName = 'test';
    const expectedValue = 'something ' + tableName + ' something ';

    const filledInSql = dbUtil.specifyTable(sql, tableName);

    expect(filledInSql).to.equal(expectedValue);
  });
});

describe('specifyParent()', function() {
  it('should replace parent token with column name', function() {
    const sql = 'something ' + queryVariables.parentColumn + ' something ';
    const parentColumnName = 'test';
    const expectedValue = 'something ' + parentColumnName + ' something ';

    const filledInSql = dbUtil.specifyParent(sql, parentColumnName);

    expect(filledInSql).to.equal(expectedValue);
  });
});

describe('specifyInsertColumns()', function() {
  it('should replace insert sql tokens with column names and statement variables', function() {
    const sql = 'something ' + queryVariables.insertColumns + ' something ' + queryVariables.insertValues;
    const columns = ['test1', 'test2', 'test3'];
    const expectedValue = 'something ' + columns.join() + ' something $1,$2,$3';

    const filledInSql = dbUtil.specifyInsertColumns(sql, columns);

    expect(filledInSql).to.equal(expectedValue);
  });
});

describe('specifyUpdateColumns()', function() {
  it('should replace update sql tokens with column names and statement variables', function() {
    const sql = 'something ' + queryVariables.updateColumns + ' something ';
    const columns = ['test1', 'test2', 'test3'];
    const expectedValue = 'something test1=$2,test2=$3,test3=$4 something ';

    const filledInSql = dbUtil.specifyUpdateColumns(sql, columns);

    expect(filledInSql).to.equal(expectedValue);
  });
});
