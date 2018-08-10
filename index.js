const _ = require('lodash');
const express = require('express');
const router = express.Router();

/**
 * Checks to see if the route is allowed
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const isAllowed = (req, res, next) => {
  const resourceMethods = _.get(req.options.resources, req.modelName);
  if (resourceMethods) {
    let method = _.lowerCase(req.method);
    if (_.get(req.url.split('?'), '0') === `/${req.modelName}`) {
      method = 'index';
    }
    req.resourceOptions = _.get(resourceMethods, method);
    if (!req.resourceOptions) {
      return next(new Error(`Route not allowed`));
    }
    return next();
  }
  return next(new Error('Route not allowed'));
}

/**
 * Get options to use within sequelize
 * @param {*} req 
 */
const getOptions = (req) => {
  let page = 1;
  const options = {};
  const attributes = _.get(req, 'resourceOptions.attributes');
  if (_.isString(attributes)) {
    options.attributes = _.map(attributes.split(','), _.trim);
  }
  const queryAttributes = _.get(req, 'query.attributes');
  if (_.isString(queryAttributes)) {
    if (options.attributes) {
      options.attributes = _.intersection(
        _.map(queryAttributes.split(','), _.trim),
        options.attributes
      );
    } else {
      options.attributes = _.map(queryAttributes.split(','), _.trim);
    }
  }
  if (req.method === 'GET') {
    options.limit = 100;
    if (req.query.page) {
      page = Number(_.get(req.query, 'page', 1));
      options.offset = page === 0 || page === 1 ? 0 : (page - 1) * 100;
    }
    if (req.query.filters) {
      const filters = _.attempt(JSON.parse, req.query.filters);
      if (!_.isError(filters)) {
        options.where = filters;
      }
    }
    if (req.query.order) {
      const order = _.attempt(JSON.parse, req.query.order);
      if (!_.isError(order)) {
        options.order = order;
      }
    }
  }
  return {
    page,
    options,
  };
}

/**
 * Get the data needed to create, or update the resource
 * @param {*} req 
 */
const getData = (req) => {
  let data = req.body;
  let attributes = _.get(req, 'resourceOptions.attributes');
  if (_.isString(attributes)) {
    attributes = _.map(attributes.split(','), _.trim);
    data = _.pick(data, attributes);
  }
  return data;
}

/**
 * GET /:modelName/
 *
 * Get all of records from the model. Limits to 100 per page.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAll = async (req, res, next) => {
  try {
    const { model } = req;
    const { options, page } = getOptions(req);
    const results = await model.findAll(options);
    res.json({
      page,
      results,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * GET /:modelName/:id
 *
 * Gets one resource specified with /:id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get = async (req, res, next) => {
  const { model } = req;
  try {
    const { options } = getOptions(req);
    const resource = await model.findById(req.resourceId, options);
    if (!resource) {
      throw new Error('Resource not found');
    }
    res.json(resource);
  } catch (e) {
    next(e);
  }
};

/**
 * POST /:modelName
 *
 * Create a resource
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const post = async (req, res, next) => {
  const { model } = req;
  try {
    const data = getData(req);
    const results = await model.create(data);
    res.json({
      results,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * PUT /:modelName/:id
 *
 * Update a resource
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const put = async (req, res, next) => {
  const { model } = req;
  try {
    const data = getData(req);
    const results = await model.update(data, {
      where: {
        id: req.resourceId,
      },
    });
    res.json({
      results,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * PATCH /:modelName/:id
 *
 * Update a resource
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const patch = async (req, res, next) => {
  const { model } = req;
  try {
    const data = getData(req);
    const results = await model.update(data, {
      where: {
        id: req.resourceId,
      },
    });
    res.json({
      results,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * DELETE /:modelName/:id
 *
 * Delete a resource
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const del = async (req, res, next) => {
  const { model } = req;
  try {
    const results = await model.destroy({
      where: {
        id: req.resourceId,
      },
    });
    res.json({
      results,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * GET /:modelName/:id/:modelNameChild
 *
 * Get all of child records from the model associations. Limits to 100 per page.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllChildren = async (req, res, next) => {
  try {
    const { model, modelChild, resourceId } = req;
    const childOptions = getOptions(req);
    const options = {
      include: [
        {
          model: modelChild,
          separate: false,
          ...childOptions.options,
        },
      ],
      where: {
        id: resourceId,
      },
      ...childOptions.options,
    };
    const results = await model.findAll(options);
    res.json({
      page: childOptions.page,
      results,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * Finds the model from /:modelName
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} modelName
 */
const findModel = (req, res, next, modelName) => {
  req.modelName = modelName;
  req.model = _.get(req.options.models, modelName);
  if (!req.model) {
    return next(new Error('Resource not found'));
  }
  return next();
};

/**
 * Finds the model from /:modelName/:id/:modelNameChild
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} modelNameChild
 */
const findModelChild = (req, res, next, modelNameChild) => {
  req.modelNameChild = modelNameChild;
  req.modelChild = _.get(req.options.models, modelNameChild);
  if (!req.model) {
    return next(new Error('Resource not found'));
  }
  return next();
};

/**
 * Finds the resource from /:modelName/:id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id
 */
const findResourceById = async (req, res, next, id) => {
  const { model } = req;
  req.resourceId = id;
  try {
    const { options } = getOptions(req);
    req.resource = await model.findById(id, options);
    if (!req.resource) {
      next(new Error('Resource not found'));
    }
    next();
  } catch (e) {
    next(e);
  }
};

router.param('modelName', findModel);
router.param('modelNameChild', findModelChild);
router.param('id', findResourceById);

module.exports = options => {
  if (!options.models) {
    throw new Error('Required models in options');
  }
  if (!options.resources) {
    throw new Error('Required resources in options');
  }
  router.use((req, res, next) => {
    req.options = options;
    return next();
  });
  router
    .route('/:modelName')
    .all(isAllowed)
    .get(getAll)
    .post(post);
  router
    .route('/:modelName/:id')
    .all(isAllowed)
    .get(get)
    .put(put)
    .patch(patch)
    .delete(del);
  router
    .route('/:modelName/:id/:modelNameChild')
    .all(isAllowed)
    .get(getAllChildren);
  return router;
};
