const validationUtil = require('../common/util/ValidationUtil')
const queries = require('../common/constants/Queries')
const errors = require('../common/constants/Errors')
const fields = require('./AccountFields')
const dbUtil = require('../common/util/DbUtil')
const hashUtil = require('../common/util/HashUtil')

module.exports = {
  validateCreateAccount: async (data) => {
    let validationObject = validationUtil.initValidationObject(errors.FORM_ERRORS)

    validationUtil.requiredField(validationObject, data, fields.username)
    validationUtil.requiredField(validationObject, data, fields.password)
    validationUtil.requiredField(validationObject, data, fields.confirmPassword)

    validationUtil.validLength(validationObject, data, fields.username)
    
    validationUtil.validEmail(validationObject, data, fields.username)
    await accountExists(validationObject, data, fields.username)
    passwordsMatch(validationObject, data, fields.password, fields.confirmPassword, errors.ACCOUNT_PASSWORD_MUST_MATCH)

    if(!validationObject.success)
      throw validationObject.error
  },

  validateChangePassword: (account, data) => {
    let validationObject = validationUtil.initValidationObject(errors.FORM_ERRORS)

    validationUtil.requiredField(validationObject, data, fields.oldPassword)
    validationUtil.requiredField(validationObject, data, fields.newPassword)
    validationUtil.requiredField(validationObject, data, fields.confirmPassword)

    passwordsMatch(validationObject, data, fields.newPassword, fields.confirmPassword, errors.PASSWORD_MUST_MATCH)
    validateOldPassword(validationObject, account, data, fields.oldPassword)

    if(!validationObject.success)
      throw validationObject.error
  }
}

async function accountExists(validationObject, data, field) {
  if(!validationUtil.isSpecifiedAndCorrectLength(data, field))
    return

  let account = await dbUtil.findOne(queries.FIND_ACCOUNT_BY_EMAIL, [data[field.fieldName]])
  if(account == null)
    return

  validationUtil.addFieldError(validationObject, field.fieldName, errors.ACCOUNT_ALREADY_EXISTS)
}

function passwordsMatch(validationObject, data, password, confirmPassword, errorMessage) {
  if(!validationUtil.isSpecifiedAndCorrectLength(data, password) ||
     !validationUtil.isSpecifiedAndCorrectLength(data, confirmPassword))
    return

  if(data[password.fieldName] === data[confirmPassword.fieldName])
    return

  validationUtil.addFieldError(validationObject, confirmPassword.fieldName, errorMessage)
}

function validateOldPassword(validationObject, account, data, passwordField) {
  if(!validationUtil.isSpecifiedAndCorrectLength(data, passwordField))
    return

  let hashedPassword = hashUtil.hashPassword(data.oldPassword, account.salt)
  if(hashedPassword !== account.password) 
    validationUtil.addFieldError(validationObject, passwordField.fieldName, errors.BAD_OLD_PASSWORD)
}