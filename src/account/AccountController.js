const dbUtil = require('../common/util/DbUtil')
const hashUtil = require('../common/util/HashUtil')
const session = require('./SessionController')
const validator = require('./AccountValidation')
const metadata = require('./AccountMetadata')

module.exports = {
  createAccount: async (data) => {
    await validator.validateCreateAccount(data)

    let password = data[metadata.password.fieldName]
    let username = data[metadata.username.fieldName]

    let salt = hashUtil.generateSalt()
    let hashedPassword = hashUtil.hashPassword(password, salt)
    account = await dbUtil.create(metadata.tableName, 
                        [metadata.username.dbName, metadata.password.dbName, metadata.salt.dbName], 
                        [username,hashedPassword,salt])

    return session.createSession(data);
  },

  changePassword: async (account, data) => {
    await validator.validateChangePassword(account, data)

    let newPasword = data[metadata.newPassword.fieldName]

    let salt = hashUtil.generateSalt()
    let hashedNewPassword = hashUtil.hashPassword(newPasword, salt)
    await dbUtil.update(metadata.tableName, 
                        [metadata.password.dbName, metadata.salt.dbName], 
                        [account.id, hashedNewPassword, salt])
  }
}

