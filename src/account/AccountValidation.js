const validationUtil = require('../common/util/ValidationUtil')
const queries = require('../common/constants/Queries')
const errors = require('../common/constants/Errors')
const metadata = require('./AccountMetadata')
const dbUtil = require('../common/util/DbUtil')
const hashUtil = require('../common/util/HashUtil')

module.exports = {
  validateCreateAccount: async (data) => {
    let validationObject = validationUtil.initValidationObject(errors.FORM_ERRORS)

    validationUtil.requiredField(validationObject, data, metadata.username)
    validationUtil.requiredField(validationObject, data, metadata.password)
    validationUtil.requiredField(validationObject, data, metadata.confirmPassword)

    validationUtil.validLength(validationObject, data, metadata.username)
    
    validationUtil.validEmail(validationObject, data, metadata.username)
    await accountExists(validationObject, data, metadata.username)
    passwordsMatch(validationObject, data, metadata.password, metadata.confirmPassword, errors.ACCOUNT_PASSWORD_MUST_MATCH)

    if(!validationObject.success)
      throw validationObject.error
  },

  validateChangePassword: (account, data) => {
    let validationObject = validationUtil.initValidationObject(errors.FORM_ERRORS)

    validationUtil.requiredField(validationObject, data, metadata.oldPassword)
    validationUtil.requiredField(validationObject, data, metadata.newPassword)
    validationUtil.requiredField(validationObject, data, metadata.confirmPassword)

    passwordsMatch(validationObject, data, metadata.newPassword, metadata.confirmPassword, errors.PASSWORD_MUST_MATCH)
    validateOldPassword(validationObject, account, data, metadata.oldPassword)

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