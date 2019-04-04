const dbUtil = require('../util/DbUtil')
const queries = require('../constants/Queries')
const hashUtil = require('../util/HashUtil')
const errors = require('../constants/Errors')

module.exports = {
  clearExpiredSessions: async () => await dbUtil.delete(queries.DELETE_EXPIRED_SESSIONS),

  createSession: async (data) => {
    let response = {}
  
    let account = await dbUtil.getOne(queries.FIND_ACCOUNT_BY_EMAIL, [data.username])
    if(account === null) {
      response.error = errors.INVALID_USER_PASSWORD
      return response
    }

    let hashedpassword = hashUtil.hashPassword(data.password, account.salt)
    if(hashedpassword !== account.password) {
      response.error = errors.INVALID_USER_PASSWORD
      return response
    }
  
    let token = hashUtil.generateToken()
    let session = await dbUtil.save(queries.CREATE_SESSION, [account.id, token])
    response.data = {sessionToken: session.token} 
    return response
  },

  destroySession: async (token) => {
    await dbUtil.delete(queries.TERMINATE_SESSION, [token])

    return {}
  }
}