const dbUtil = require('../common/util/DbUtil')
const queries = require('../common/constants/Queries')
const hashUtil = require('../common/util/HashUtil')
const errors = require('../common/constants/Errors')

module.exports = {
  clearExpiredSessions: async () => await dbUtil.executeQuery(queries.DELETE_EXPIRED_SESSIONS),

  createSession: async (data) => {
    let account = await dbUtil.findOne(queries.FIND_ACCOUNT_BY_EMAIL, [data.username])
    await validateSession(account, data)
    
    let token = hashUtil.generateToken()
    let session = await dbUtil.executeQuery(queries.CREATE_SESSION, [account.id, token])
    return {sessionToken: session.token} 
  },

  destroySession: async (token) => {
    await dbUtil.executeQuery(queries.TERMINATE_SESSION, [token])
  }
}

async function validateSession(account, data) {
  if(account === null) 
    throw errors.INVALID_USER_PASSWORD

  let hashedpassword = hashUtil.hashPassword(data.password, account.salt)
  if(hashedpassword !== account.password) 
    throw errors.INVALID_USER_PASSWORD
}