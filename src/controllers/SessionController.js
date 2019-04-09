const dbUtil = require('../util/DbUtil')
const queries = require('../constants/Queries')
const hashUtil = require('../util/HashUtil')
const errors = require('../constants/Errors')

module.exports = {
  clearExpiredSessions: async () => await dbUtil.delete(queries.DELETE_EXPIRED_SESSIONS),

  createSession: async (data) => {
    let account = await dbUtil.getOne(queries.FIND_ACCOUNT_BY_EMAIL, [data.username])
    await validateSession(account, data)
    
    let token = hashUtil.generateToken()
    let session = await dbUtil.save(queries.CREATE_SESSION, [account.id, token])
    return {sessionToken: session.token} 
  },

  destroySession: async (token) => {
    await dbUtil.delete(queries.TERMINATE_SESSION, [token])

    return {}
  }
}

async function validateSession(account, data) {
  if(account === null) 
    throw errors.INVALID_USER_PASSWORD

  let hashedpassword = hashUtil.hashPassword(data.password, account.salt)
  if(hashedpassword !== account.password) 
    throw errors.INVALID_USER_PASSWORD
}