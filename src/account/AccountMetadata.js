module.exports = {
  tableName: 'account',

  username: {fieldName: 'username', fieldLabel: 'Username', dbName: 'email', fieldLength: 254},
  password: {fieldName: 'password', fieldLabel: 'Password', dbName: 'password', fieldLength: 128},
  salt: {dbName: 'salt'},

  confirmPassword: {fieldName: 'confirmPassword', fieldLabel: 'Confirm Password', fieldLength: 128},
  oldPassword: {fieldName: 'oldPassword', fieldLabel: 'Old Password', fieldLength: 128},
  newPassword: {fieldName: 'newPassword', fieldLabel: 'New Password', fieldLength: 128},
};
