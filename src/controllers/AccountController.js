const dbUtil = require('../util/DbUtil')
const queries = require('../constants/Queries')
const errors = require('../constants/Errors')
const hashUtil = require('../util/HashUtil')
const session = require('./SessionController')
const validationUtil = require('../util/ValidationUtil')
//const emailUtil = require('../util/EmailUtil')

module.exports = {
  createAccount: async (data) => {
    let validation = await validateAccountCreation(data)
    if(!validation.success)
      return {error: validation.error}

    let salt = hashUtil.generateSalt()
    let hashedPassword = hashUtil.hashPassword(data.password, salt)
    account = await dbUtil.save(queries.CREATE_ACCOUNT,[data.username,hashedPassword,salt])

    //emailUtil.sendEmail(data.username, "Please verify your account", "Thanks for joining. Click here to activate your account.")

    return session.createSession(data);
  },

  changePassword: async (token, data) => {
    if(data.newPassword != data.confirmPassword)
      return {error: errors.PASSWORD_MUST_MATCH}

    let account = await dbUtil.getOne(queries.FIND_ACCOUNT_BY_SESSION_TOKEN, [token])
    if(account == null) 
      return {error: errors.FORBIDDEN}

    let hashedPassword = hashUtil.hashPassword(data.oldPassword, account.salt)

    if(hashedPassword !== account.password) 
      return {error: errors.BAD_OLD_PASSWORD}

    let salt = hashUtil.generateSalt()
    let hashedNewPassword = hashUtil.hashPassword(data.newPassword, salt)
    await dbUtil.save(queries.CHANGE_PASSWORD, [hashedNewPassword, salt, account.id])
    return {}
  }
}

async function validateAccountCreation(data) {
  let account = await dbUtil.getOne(queries.FIND_ACCOUNT_BY_EMAIL, [data.username])
  if(account != null) 
    return validationUtil.error(errors.ACCOUNT_ALREADY_EXISTS)

  if(!validationUtil.isValidEmail(data.username))
    return validationUtil.error(errors.ACCOUNT_INVALID_EMAIL)

  if(data.password != data.confirmPassword) 
    return validationUtil.error(errors.ACCOUNT_PASSWORD_MUST_MATCH)

  return validationUtil.success()
}