const expect = require('chai').expect
const hashUtil = require('../src/common/util/HashUtil')

describe('generateToken()', function () {
  it('should generate a token', function () {
    
    let token = hashUtil.generateToken()

    expect(token).to.be.a('string')
    expect(token).to.have.lengthOf(32)
  })
})

describe('hashPassword()', function () {
  it('should hash password', function () {
    let password = 'password'
    let salt = 'b36a8224b3742392'

    let hash = hashUtil.hashPassword(password, salt)

    expect(hash).to.equal('b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86')
  })
})

describe('generateSalt()', function () {
  it('should generate a random 8 character long salt', function () {
    let salt1 = hashUtil.generateSalt()
    let salt2 = hashUtil.generateSalt()

    expect(salt1).to.have.lengthOf(16)
    expect(salt2).to.have.lengthOf(16)
    expect(salt1).to.not.equal(salt2)
  })
})