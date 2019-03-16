const express = require('express');
const requireDir = require('require-dir');
const path = require('path');
const router = express.Router();
const methods = requireDir(path.join(__dirname, 'methods'));
const utils = requireDir(path.join(__dirname, 'utils'));

module.exports = (options = {}) => {
  if (!options.models) {
    throw new Error('Required models in options');
  }
  router.use((req, res, next) => {
    req.bp = {
      options,
      sequelizeOptions: {},
      childSequelizeOptions: {},
      resourceId: null,
      modelName: null,
      model: null,
      childResourceId: null,
      childModelName: null,
      childModel: null,
    };
    return next();
  });
  router.param('modelName', utils.findModel);
  router.param('resourceId', utils.findResourceId);
  router.param('childModelName', utils.findChildModel);
  router.param('childResourceId', utils.findChildResourceId);
  router
    .route(options.prefix + '/:modelName')
    .all(utils.sequelizeOptions)
    .all(options.use ? options.use : (req, res, next) => next())
    .get(methods.index)
    .post(methods.post);
  router
    .route(options.prefix + '/:modelName/:resourceId')
    .all(utils.sequelizeOptions)
    .all(options.use ? options.use : (req, res, next) => next())
    .get(methods.get)
    .put(methods.put)
    .patch(methods.patch)
    .delete(methods.delete);
  router
    .route(options.prefix + '/:modelName/:resourceId/:childModelName')
    .all(utils.sequelizeOptions)
    .all(utils.childSequelizeOptions)
    .all(options.use ? options.use : (req, res, next) => next())
    .get(methods.getChildren);
  router
    .route(options.prefix + '/:modelName/:resourceId/:childModelName/:childResourceId')
    .all(utils.sequelizeOptions)
    .all(utils.childSequelizeOptions)
    .all(options.use ? options.use : (req, res, next) => next())
    .get(methods.getChild);
  return router;
};
