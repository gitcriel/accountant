const dbUtil = require('../util/DbUtil')
const queries = require('../constants/Queries')
const errors = require('../constants/Errors')
const hashUtil = require('../util/HashUtil')
const session = require('./SessionController')
const validationUtil = require('../util/ValidationUtil')
//const emailUtil = require('../util/EmailUtil')

module.exports = {
  createAccount: async (data) => {
    await validateAccountCreation(data)

    let salt = hashUtil.generateSalt()
    let hashedPassword = hashUtil.hashPassword(data.password, salt)
    account = await dbUtil.save(queries.CREATE_ACCOUNT,[data.username,hashedPassword,salt])

    //emailUtil.sendEmail(data.username, "Please verify your account", "Thanks for joining. Click here to activate your account.")

    return session.createSession(data);
  },

  changePassword: async (account, data) => {
    validateChangePassword(account, data)

    let salt = hashUtil.generateSalt()
    let hashedNewPassword = hashUtil.hashPassword(data.newPassword, salt)
    await dbUtil.save(queries.CHANGE_PASSWORD, [hashedNewPassword, salt, account.id])
    return {}
  }
}

async function validateAccountCreation(data) {
  let validationObject = validationUtil.initValidationObject(errors.FORM_ERRORS)
  
  if(data.username == null || data.username.length === 0) {
    validationUtil.addFieldError(validationObject, 'username', {...errors.FIELD_REQUIRED, properties:['Username']})
  } else if(data.username.length > 355) {
    validationUtil.addFieldError(validationObject, 'username', {...errors.FIELD_TOO_LONG, properties:['Username', 355]})
  } else {
    let account = await dbUtil.getOne(queries.FIND_ACCOUNT_BY_EMAIL, [data.username])
    if(account != null) 
      validationUtil.addFieldError(validationObject, 'username', errors.ACCOUNT_ALREADY_EXISTS)
  
    if(!validationUtil.isValidEmail(data.username))
      validationUtil.addFieldError(validationObject, 'username', errors.ACCOUNT_INVALID_EMAIL)
  }

  if(data.password == null || data.password.length === 0) 
    validationUtil.addFieldError(validationObject, 'password', {...errors.FIELD_REQUIRED, properties:['Password']})

  if(data.confirmPassword == null || data.confirmPassword.length === 0) 
      validationUtil.addFieldError(validationObject, 'confirmPassword', {...errors.FIELD_REQUIRED, properties:['Confirm Password']})
  
  if(data.password != data.confirmPassword) 
    validationUtil.addFieldError(validationObject, 'confirmPassword', errors.ACCOUNT_PASSWORD_MUST_MATCH)

  if(!validationObject.success)
    throw validationObject.error
}

function validateChangePassword(account, data) {
  let validationObject = validationUtil.initValidationObject(errors.FORM_ERRORS)

  if(data.oldPassword == null || data.oldPassword.length === 0) {
    validationUtil.addFieldError(validationObject, 'oldPassword', {...errors.FIELD_REQUIRED, properties:['Old Password']})
  } else {
    let hashedPassword = hashUtil.hashPassword(data.oldPassword, account.salt)
    if(hashedPassword !== account.password) 
      validationUtil.addFieldError(validationObject, 'oldPassword', errors.BAD_OLD_PASSWORD)
  }
  
  if(data.newPassword == null || data.newPassword.length === 0) 
    validationUtil.addFieldError(validationObject, 'newPassword', {...errors.FIELD_REQUIRED, properties:['New Password']})

  if(data.confirmPassword == null || data.confirmPassword.length === 0) 
      validationUtil.addFieldError(validationObject, 'confirmPassword', {...errors.FIELD_REQUIRED, properties:['Confirm New Password']})

  if(data.newPassword != data.confirmPassword) 
    validationUtil.addFieldError(validationObject, 'confirmPassword', errors.PASSWORD_MUST_MATCH)

  if(!validationObject.success)
    throw validationObject.error
}
