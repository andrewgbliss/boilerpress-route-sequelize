const models = require('../models');
const get = require('lodash/get');

module.exports = {
  prefix: '/api/v1',
  models,
  use(req, res, next) {
    if (
      req.headers['x-service-token'] &&
      req.headers['x-service-token'] === 'abc123'
    ) {
      return next();
    }
    if (req.bp.childModelName) {
      req.bp.childSequelizeOptions.where = {
        ...get(req, 'bp.childSequelizeOptions.where', {}),
        [req.bp.childModelName === 'accounts' ? 'id' : 'accountId']: 34,
      };
    } else {
      req.bp.sequelizeOptions.where = {
        ...get(req, 'bp.sequelizeOptions.where', {}),
        [req.bp.modelName === 'accounts' ? 'id' : 'accountId']: 34,
      };
    }
    return next();
  },
};
