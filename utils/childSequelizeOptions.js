const get = require('lodash/get');
const attempt = require('lodash/attempt');
const isError = require('lodash/isError');

module.exports = (req, res, next) => {
  // Set up options for sequelize
  let sequelizeOptions = {
    logging: console.log,
    validate: true,
  };

  if (req.bp.childResourceId) {
    sequelizeOptions.where = {
      id: req.bp.childResourceId,
    };
  }

  // Find the attributes from the query string
  if (req.query.attributes) {
    const attributes = attempt(JSON.parse, req.query.attributes);
    if (!isError(attributes)) {
      sequelizeOptions.attributes = attributes;
    }
  }

  // If the method is a GET method then search the query string
  // for page, filters, order, and includes
  if (req.method === 'GET') {
    sequelizeOptions.limit = 100;

    // Pagination
    if (req.query.page) {
      let page = Number(get(req.query, 'page', 1));
      sequelizeOptions.offset = page === 0 || page === 1 ? 0 : (page - 1) * 100;
    }

    // Filters
    if (req.query.where) {
      const where = attempt(JSON.parse, req.query.where);
      if (!isError(where)) {
        sequelizeOptions.where = {
          ...where,
          ...sequelizeOptions.where,
        };
      }
    }

    // Order by
    if (req.query.order) {
      const order = attempt(JSON.parse, req.query.order);
      if (!isError(order)) {
        sequelizeOptions.order = order;
      }
    }
  }

  if (req.query.force) {
    sequelizeOptions.force = req.query.force === 'true';
  }

  if (req.query.paranoid) {
    sequelizeOptions.paranoid = req.query.paranoid === 'true';
  }

  req.bp.childSequelizeOptions = sequelizeOptions;

  return next();
};
