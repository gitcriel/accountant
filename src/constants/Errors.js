module.exports = {
  HTTP: {
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    EXCEPTION: 500
  },
  INVALID_USER_PASSWORD : { error: 'InvalidUserPassword', description: 'Invalid username or password.'},
  EXCEPTION: { error: 'InternalServerError', description: 'A server error has occurred.'},
  FORBIDDEN: { error: 'Forbidden', description: 'Invalid session token.'},

  BAD_OLD_PASSWORD: { error: 'BadOldPassword', description: 'Old password is incorrect.'},
  PASSWORD_MUST_MATCH: { error: 'PasswordMustMatch', description: 'New passwords must match.'},  

  ACCOUNT_PASSWORD_MUST_MATCH: { error: 'AccountPasswordMustMatch', description: 'Passwords must match.'},
  ACCOUNT_ALREADY_EXISTS: {error: 'AccountAlreadyExists', description: 'Account already exists.'},
  ACCOUNT_INVALID_EMAIL: { error: 'AccountInvalidEmail', description: 'Invalid E-Mail address.'}
}