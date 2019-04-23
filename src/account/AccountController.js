const dbUtil = require('../common/util/DbUtil');
const hashUtil = require('../common/util/HashUtil');
const session = require('./SessionController');
const validator = require('./AccountValidation');
const metadata = require('./AccountMetadata');

module.exports = {
  createAccount: async (data) => {
    await validator.validateCreateAccount(data);

    const password = data[metadata.password.fieldName];
    const username = data[metadata.username.fieldName];

    const salt = hashUtil.generateSalt();
    const hashedPassword = hashUtil.hashPassword(password, salt);
    account = await dbUtil.create(metadata.tableName,
        [metadata.username.dbName, metadata.password.dbName, metadata.salt.dbName],
        [username, hashedPassword, salt]);

    return session.createSession(data);
  },

  changePassword: async (account, data) => {
    await validator.validateChangePassword(account, data);

    const newPasword = data[metadata.newPassword.fieldName];

    const salt = hashUtil.generateSalt();
    const hashedNewPassword = hashUtil.hashPassword(newPasword, salt);
    await dbUtil.update(metadata.tableName,
        [metadata.password.dbName, metadata.salt.dbName],
        [account.id, hashedNewPassword, salt]);
  },
};

