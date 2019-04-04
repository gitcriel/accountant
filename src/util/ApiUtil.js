const errors = require('../constants/Errors')
const dbUtil = require('../util/DbUtil')
const queries = require('../constants/Queries')

module.exports = {
  apiWrapper: async (req, res, method) => {
    try {
      let reply = await method(req.body)
      if(reply.error) {
        respondWithError(res, errors.HTTP.BAD_REQUEST, reply.error)
      } else {
        res.json(reply.data)
        console.log(JSON.stringify(reply))
      }
    } catch (err) {
      console.error(err)
      respondWithError(res, errors.HTTP.EXCEPTION, errors.EXCEPTION)
    }
  },

  apiAuthWrapper: async (req, res, method) => {
    try {
      let sessionToken = await getSessionToken(req)
      if(sessionToken === null) {
        respondWithError(res, errors.HTTP.FORBIDDEN, errors.FORBIDDEN)
        return
      }        
        
      let reply = await method(sessionToken, req.body)
      if(reply.error) {
        respondWithError(res, errors.HTTP.BAD_REQUEST, reply.error)
      } else {
        res.json(reply.data)
        console.log(JSON.stringify(reply))
      }
    } catch (err) {
      console.error(err)
      respondWithError(res, errors.HTTP.EXCEPTION, errors.EXCEPTION)
    }
  },
}

async function getSessionToken(req) {
  let authHeader = req.header("Authorization")
  if(authHeader == null)
    return null

  let authParams = authHeader.split(" ")
  if(authParams.length != 2)
    return null

  if(authParams[0] != "Custom")
    return null

  let sessionToken = authParams[1]
  let session = await dbUtil.getOne(queries.FIND_SESSION_BY_TOKEN, [sessionToken])
  if(session == null)
    return null

  return sessionToken
}

function respondWithError(response, httpCode, error) {
  response.status(httpCode)
  response.json(error)
  console.log(JSON.stringify(error))
}
