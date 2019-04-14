const dbUtil = require('../common/util/DbUtil')
const queries = require('../common/constants/Queries')
const errors = require('../common/constants/Errors')
const validationUtil = require('../common/util/ValidationUtil')

const SCHEMA = {
  TABLE_NAME: 'category',
  FIELD_ACCOUNT_ID: 'account_id', 
  FIELD_NAME: 'name',
  FIELD_CATEGORY_ID: 'category_id'
}

module.exports = {
  create: async (account, data) => {
    validateCreateCategory(data)

    return await dbUtil.create(SCHEMA.TABLE_NAME, 
            [SCHEMA.FIELD_ACCOUNT_ID, SCHEMA.FIELD_NAME, SCHEMA.FIELD_CATEGORY_ID],
            [account.id, data.name, data.categoryId])
  },

  getAll: async (account) => {
    return await dbUtil.getAllByParent(SCHEMA.TABLE_NAME, SCHEMA.FIELD_ACCOUNT_ID, account.id)
  },

  getOne: async (account, data, id) => {
    await isAuthorized(account, id)

    let category = await dbUtil.getOne(SCHEMA.TABLE_NAME, id)
    if(category == null) 
      throw {...errors.OBJECT_NOT_FOUND, properties: ['Category', id]}

    return category
  },

  delete: async (account, data, id) => {
    await isAuthorized(account, id)
    await dbUtil.delete(queries.DELETE_CATEGORY,[id])
  },

  update: async (account, data, id) => {
    await isAuthorized(account, id) 
    await dbUtil.update(SCHEMA.TABLE_NAME,
                [SCHEMA.FIELD_NAME, SCHEMA.FIELD_CATEGORY_ID],
                [id, data.name, data.categoryId])
  },
}

function validateCreateCategory(data) {
  let validationObject = validationUtil.initValidationObject(errors.FORM_ERRORS)
  if(data.name == null || data.name.length === 0) {
    validationUtil.addFieldError(validationObject, 'name', {...errors.FIELD_REQUIRED, properties:['Name']})
  } else if(data.name.length > 200) {
    validationUtil.addFieldError(validationObject, 'name', {...errors.FIELD_TOO_LONG, properties:['Name', 200]})
  }
  if(!validationObject.success)
    throw validationObject.error
}

async function isAuthorized(account, id) {
  let category = await dbUtil.getOne(queries.GET_CATEGORY, [account.id, id])
  if(category == null) 
    throw errors.FORBIDDEN
}