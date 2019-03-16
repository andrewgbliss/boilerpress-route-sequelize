const get = require('lodash/get');

module.exports = (req, res, next, modelName) => {
  req.bp.modelName = modelName;
  req.bp.model = get(req, `bp.options.models.${modelName}`);
  if (!req.bp.model) {
    return next({
      status: 404,
      message: 'Model definition not found',
    });
  }
  return next();
};