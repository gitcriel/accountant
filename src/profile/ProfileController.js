const dbUtil = require('../common/util/DbUtil');
const errors = require('../common/constants/Errors');
const validationUtil = require('../common/util/ValidationUtil');

const SCHEMA = {
  TABLE_NAME: 'profile',
  FIELD_ACCOUNT_ID: 'account_id',
  FIELD_NAME: 'name',
};

module.exports = {
  create: async (account, data) => {
    validateProfile(data);

    const profile = await dbUtil.create(SCHEMA.TABLE_NAME,
        [SCHEMA.FIELD_ACCOUNT_ID, SCHEMA.FIELD_NAME],
        [account.id, data.name]);

    return profile;
  },

  getAll: async (account) => {
    const profiles = await dbUtil.getAllByParent(SCHEMA.TABLE_NAME, SCHEMA.FIELD_ACCOUNT_ID, account.id);
    return profiles;
  },

  getOne: async (account, data, id) => {
    // TODO: AUTHORIZATION: Validate that the id belongs to the account
    // isAuthorizedToGetProfile(account.id, id)

    const profile = await dbUtil.getOne(SCHEMA.TABLE_NAME, id);
    if (profile == null) {
      const errorToThrow = {...errors.OBJECT_NOT_FOUND, properties: ['Profile', id]};
      throw errorToThrow;
    }

    return profile;
  },

  delete: async (account, data, id) => {
    // TODO: AUTHORIZATION: Validate that the id belongs to the account
    // isAuthorizedToDeleteProfile(account.id, id)
    await dbUtil.delete(SCHEMA.TABLE_NAME, id);
  },

  update: async (account, data, id) => {
    // TODO: AUTHORIZATION: Validate that the id belongs to the account
    // isAuthorizedToDeleteProfile(account.id, id)

    await dbUtil.update(SCHEMA.TABLE_NAME, [SCHEMA.FIELD_NAME], [id, data.name]);
  },
};

function validateProfile(data) {
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
