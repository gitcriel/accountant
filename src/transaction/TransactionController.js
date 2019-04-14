const dbUtil = require('../common/util/DbUtil')
const queries = require('../common/constants/Queries')
const errors = require('../common/constants/Errors')
const validationUtil = require('../common/util/ValidationUtil')

module.exports = {
  create: async (account, data, profileId) => {
    await validateProfile(account, profileId)
    validateTransactionCreation(data)

    let transaction = await dbUtil.save(queries.CREATE_TRANSACTION,[profileId, data.date, data.description, data.categoryId, data.subcategoryId, data.institutionId, data.amount])
    return transaction
  },

  getAll: async (account, profileId) => {
    await validateProfile(account, profileId)

    let transactions = await dbUtil.getAll(queries.GET_TRANSACTIONS, [profileId])
    return transactions
  },

  getOne: async (account, data, profileId, transactionId) => {
    await validateProfile(account, profileId)

    let transaction = await dbUtil.getOne(queries.GET_TRANSACTION, [profileId, transactionId])
    if(transaction == null) 
      throw {...errors.OBJECT_NOT_FOUND, properties: ['Transaction', transactionId]}

    return transaction
  },

  delete: async (account, data, profileId, transactionId) => {
    await validateProfile(account, profileId)

    let transaction = await dbUtil.getOne(queries.GET_PROFILE, [profileId, transactionId])
    if(transaction == null) 
      throw {...errors.OBJECT_NOT_FOUND, properties: ['Transaction', transactionId]}

    await dbUtil.delete(queries.DELETE_TRANSACTION,[transactionId])
  },

  update: async (account, data, profileId, transactionId) => {
    await validateProfile(account, profileId)

    let transaction = await dbUtil.getOne(queries.GET_TRANSACTION, [profileId, transactionId])
    if(transaction == null) 
      throw {...errors.OBJECT_NOT_FOUND, properties: ['Transaction', transactionId]}

    await dbUtil.save(queries.UPDATE_TRANSACTION,[data.name, transactionId])
  },
}

function validateTransactionCreation(data) {
  let validationObject = validationUtil.initValidationObject(errors.FORM_ERRORS)

  if(data.date == null)
    validationUtil.addFieldError(validationObject, 'date', {...errors.FIELD_REQUIRED, properties:['Date']})
  if(data.description == null)
    validationUtil.addFieldError(validationObject, 'description', {...errors.FIELD_REQUIRED, properties:['Description']})
  if(data.categoryId == null)
    validationUtil.addFieldError(validationObject, 'categoryId', {...errors.FIELD_REQUIRED, properties:['Category']})
  if(data.institutionId == null)
    validationUtil.addFieldError(validationObject, 'institutionId', {...errors.FIELD_REQUIRED, properties:['Institution']})
  if(data.amount == null)
    validationUtil.addFieldError(validationObject, 'amount', {...errors.FIELD_REQUIRED, properties:['Amount']})
  
  if(!validationObject.success)
    throw validationObject.error
}

async function validateProfile(account, profileId) {
  let profile = await dbUtil.getOne(queries.GET_PROFILE, [account.id, profileId])
  if(profile == null) 
    throw {...errors.OBJECT_NOT_FOUND, properties: ['Profile', profileId]}  
}