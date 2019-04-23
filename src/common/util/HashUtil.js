const crypto = require('crypto');
const uuid = require('uuid/v4');

module.exports = {
  hashPassword:
    (password, salt) => crypto.createHash('sha512', salt).update(password).digest('hex'),

  generateSalt:
    () => crypto.randomBytes(8).toString('hex').slice(0, 16),

  generateToken:
    () => uuid().replace(new RegExp('-', 'g'), ''),

};
