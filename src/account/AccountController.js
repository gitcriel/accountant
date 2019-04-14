const dbUtil = require('../common/util/DbUtil')
const hashUtil = require('../common/util/HashUtil')
const session = require('../session/SessionController')
const validator = require('./AccountValidation')

const SCHEMA = {
  TABLE_NAME: 'account',
  FIELD_EMAIL: 'email',
  FIELD_PASSWORD: 'password',
  FIELD_SALT: 'salt',
  FIELD_CREATED_DATE: 'created_date',
  FIELD_LAST_LOGIN: 'last_login'
}

module.exports = {
  createAccount: async (data) => {
    await validator.validateCreateAccount(data)

    let salt = hashUtil.generateSalt()
    let hashedPassword = hashUtil.hashPassword(data.password, salt)
    account = await dbUtil.create(SCHEMA.TABLE_NAME, 
                        [SCHEMA.FIELD_EMAIL, SCHEMA.FIELD_PASSWORD, SCHEMA.FIELD_SALT], 
                        [data.username,hashedPassword,salt])

    return session.createSession(data);
  },

  changePassword: async (account, data) => {
    await validator.validateChangePassword(account, data)

    let salt = hashUtil.generateSalt()
    let hashedNewPassword = hashUtil.hashPassword(data.newPassword, salt)
    await dbUtil.update(SCHEMA.TABLE_NAME, 
                        [SCHEMA.FIELD_PASSWORD, SCHEMA.FIELD_SALT], 
                        [account.id, hashedNewPassword, salt])
  }
}

