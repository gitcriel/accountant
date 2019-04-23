const moment = require('moment');
const dbUtil = require('../common/util/DbUtil');
const queries = require('../common/constants/Queries');
const hashUtil = require('../common/util/HashUtil');
const errors = require('../common/constants/Errors');
const accountMetadata = require('./AccountMetadata');
const sessionMetadata = require('./SessionMetadata');

module.exports = {
  clearExpiredSessions: async () => await dbUtil.execute(queries.DELETE_EXPIRED_SESSIONS),

  createSession: async (data) => {
    const username = data[accountMetadata.username.fieldName];
    const password = data[accountMetadata.password.fieldName];

    const account = await dbUtil.findOne(queries.FIND_ACCOUNT_BY_EMAIL, [username]);
    await validateSession(account, password);

    const token = hashUtil.generateToken();
    const expiryDate = getSessionExpiryDate();

    await dbUtil.create(sessionMetadata.tableName,
        [sessionMetadata.accountId.dbName, sessionMetadata.sessionToken.dbName, sessionMetadata.expiryDate.dbName],
        [account.id, token, expiryDate]);

    return {sessionToken: token};
  },

  destroySession: async (token) => {
    await dbUtil.execute(queries.TERMINATE_SESSION, [token]);
  },
};

function getSessionExpiryDate() {
  const expiryDate = moment().utc().add(15, 'minutes');
  return expiryDate.format();
}

async function validateSession(account, password) {
  if (account === null) {
    throw errors.INVALID_USER_PASSWORD;
  }

  const hashedpassword = hashUtil.hashPassword(password, account.salt);
  if (hashedpassword !== account.password) {
    throw errors.INVALID_USER_PASSWORD;
  }
}
