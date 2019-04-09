const dbUtil = require('../util/DbUtil')
const queries = require('../constants/Queries')
const errors = require('../constants/Errors')
const validationUtil = require('../util/ValidationUtil')

module.exports = {
  create: async (account, data, profileId) => {
    let validation = await validateTransactionCreation(data)
    if(!validation.success)
      return {error: validation.error}

    let profile = await dbUtil.getOne(queries.GET_PROFILE, [account.id, profileId])
    if(profile == null) 
      return {error: errors.NOT_FOUND}  

    transaction = await dbUtil.save(queries.CREATE_TRANSACTION,[profileId, data.date, data.description, data.categoryId, data.subcategoryId, data.institutionId, data.amount])
    return {data: transaction}
  },

  getAll: async (account, profileId) => {
    let profile = await dbUtil.getOne(queries.GET_PROFILE, [account.id, profileId])
    if(profile == null) 
      return {error: errors.OBJECT_NOT_FOUND, properties: ['Profile', profileId]}  

    let transactions = await dbUtil.getAll(queries.GET_TRANSACTIONS, [profileId])
    if(transactions == null) 
      return {error: errors.OBJECTS_NOT_FOUND, properties: ['Transactions', 'Profile', profileId]}

    return {data: transactions}
  },

  getOne: async (account, data, profileId, transactionId) => {
    let transaction = await dbUtil.getOne(queries.GET_TRANSACTION, [account.id, profileId, transactionId])
    if(transaction == null) 
      return {error: errors.OBJECT_NOT_FOUND, properties: ['Transaction', transactionId]}

    return {data: transaction}
  },

  delete: async (account, data, profileId, transactionId) => {
    //Revise this...create an authorization layer instead.
    let transaction = await dbUtil.getOne(queries.GET_PROFILE, [account.id, profileId, transactionId])
    if(transaction == null) 
      return {error: errors.NOT_FOUND}

    await dbUtil.delete(queries.DELETE_TRANSACTION,[transactionId])
    return {data: null}
  },

  update: async (account, data, profileId, transactionId) => {
    let transaction = await dbUtil.getOne(queries.GET_TRANSACTION, [account.id, profileId, transactionId])
    if(transaction == null) 
      return {error: errors.NOT_FOUND}

    await dbUtil.save(queries.UPDATE_TRANSACTION,[data.name, transactionId])
    return {data: null}
  },
}

async function validateTransactionCreation(data) {
  return validationUtil.success()
}