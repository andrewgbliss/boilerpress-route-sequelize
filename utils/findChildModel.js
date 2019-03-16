const get = require('lodash/get');

module.exports = (req, res, next, childModelName) => {
  req.bp.childModelName = childModelName;
  req.bp.childModel = get(req, `bp.options.models.${childModelName}`);
  if (!req.bp.childModel) {
    return next({
      status: 404,
      message: 'Child Model definition not found',
    });
  }
  return next();
};