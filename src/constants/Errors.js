module.exports = {
  HTTP: {
    NO_DATA: 204,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    EXCEPTION: 500
  },
  FORM_ERRORS: {error: 'FormErrors', description: 'Validation errors found.'},

  INVALID_USER_PASSWORD : { error: 'InvalidUserPassword', description: 'Invalid username or password.'},
  EXCEPTION: { error: 'InternalServerError', description: 'A server error has occurred.'},
  FORBIDDEN: { error: 'Forbidden', description: 'Invalid session token.'},
  OBJECT_NOT_FOUND: { error: 'ObjectNotFound', description: '$1 with id $2 not found.'},

  BAD_OLD_PASSWORD: { error: 'BadOldPassword', description: 'Old password is incorrect.'},
  PASSWORD_MUST_MATCH: { error: 'PasswordMustMatch', description: 'New passwords must match.'},  

  ACCOUNT_PASSWORD_MUST_MATCH: { error: 'AccountPasswordMustMatch', description: 'Passwords must match.'},
  ACCOUNT_ALREADY_EXISTS: {error: 'AccountAlreadyExists', description: 'Account already exists.'},
  ACCOUNT_INVALID_EMAIL: { error: 'AccountInvalidEmail', description: 'Invalid E-Mail address.'},

  FIELD_REQUIRED: {error: 'FieldRequired', description: '$1 is a required field'},
  FIELD_TOO_LONG: {error: 'FieldTooLong', description: '$1 must be at most $2 characters long.'}
}