const dbUtil = require('../util/DbUtil')
const queries = require('../constants/Queries')
const errors = require('../constants/Errors')
const validationUtil = require('../util/ValidationUtil')

module.exports = {
  create: async (account, data) => {
    validateProfile(data)

    profile = await dbUtil.save(queries.CREATE_PROFILE,[account.id, data.name])
    return profile
  },

  getAll: async (account) => {
    let profiles = await dbUtil.getAll(queries.GET_PROFILES, [account.id])
    return profiles
  },

  getOne: async (account, data, id) => {
    let profile = await dbUtil.getOne(queries.GET_PROFILE, [account.id, id])
    if(profile == null) 
      throw {...errors.OBJECT_NOT_FOUND, properties: ['Profile', id]}

    return profile
  },

  delete: async (account, data, id) => {
    let profile = await dbUtil.getOne(queries.GET_PROFILE, [account.id, id])
    if(profile == null) 
    throw {...errors.OBJECT_NOT_FOUND, properties: ['Profile', id]}

    await dbUtil.delete(queries.DELETE_PROFILE,[id])
  },

  update: async (account, data, id) => {
    let profile = await dbUtil.getOne(queries.GET_PROFILE, [account.id, id])
    if(profile == null) 
      throw {...errors.OBJECT_NOT_FOUND, properties: ['Profile', id]}

    await dbUtil.save(queries.UPDATE_PROFILE,[data.name, id])
  },
}

function validateProfile(data) {
  let validationObject = validationUtil.initValidationObject(errors.FORM_ERRORS)
  if(data.name == null || data.name.length === 0) {
    validationUtil.addFieldError(validationObject, 'name', {...errors.FIELD_REQUIRED, properties:['Name']})
  } else if(data.name.length > 200) {
    validationUtil.addFieldError(validationObject, 'name', {...errors.FIELD_TOO_LONG, properties:['Name', 200]})
  }
  if(!validationObject.success)
    throw validationObject.error
}