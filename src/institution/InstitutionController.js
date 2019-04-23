const dbUtil = require('../common/util/DbUtil');
const queries = require('../common/constants/Queries');
const errors = require('../common/constants/Errors');
const validationUtil = require('../common/util/ValidationUtil');

const SCHEMA = {
  TABLE_NAME: 'institution',
  FIELD_ACCOUNT_ID: 'account_id',
  FIELD_NAME: 'name',
  FIELD_PARSING_PATTERN: 'parsing_pattern',
};

module.exports = {
  create: async (account, data) => {
    validateCreateInstitution(data);

    return await dbUtil.create(queries.CREATE_INSTITUTION,
        [FIELD_ACCOUNT_ID, FIELD_NAME, FIELD_PARSING_PATTERN],
        [account.id, data.name, data.parsingPattern]);
  },

  getAll: async (account) => {
    return await dbUtil.getAllByParent(SCHEMA.TABLE_NAME, SCHEMA.FIELD_ACCOUNT_ID, account.id);
  },

  getOne: async (account, data, id) => {
    await isAuthorized(account, id);

    return await dbUtil.getOne(SCHEMA.TABLE_NAME, id);
  },

  delete: async (account, data, id) => {
    await isAuthorized(account, id);
    await dbUtil.delete(SCHEMA.TABLE_NAME, id);
  },

  update: async (account, data, id) => {
    await isAuthorized(account, id);
    await dbUtil.update(SCHEMA.TABLE_NAME, [SCHEMA.FIELD_NAME, SCHEMA.FIELD_PARSING_PATTERN], [id, data.name, data.parsingPattern]);
  },
};

function validateCreateInstitution(data) {
  const validationObject = validationUtil.initValidationObject(errors.FORM_ERRORS);
  if (data.name == null || data.name.length === 0) {
    validationUtil.addFieldError(validationObject, 'name', {...errors.FIELD_REQUIRED, properties: ['Name']});
  } else if (data.name.length > 200) {
    validationUtil.addFieldError(validationObject, 'name', {...errors.FIELD_TOO_LONG, properties: ['Name', 200]});
  }
  if (!validationObject.success) {
    throw validationObject.error;
  }
}

async function isAuthorized(account, id) {
  const institution = await dbUtil.getOne(queries.GET_INSTITUTION, [account.id, id]);
  if (institution == null) {
    throw errors.FORBIDDEN;
  }
}
