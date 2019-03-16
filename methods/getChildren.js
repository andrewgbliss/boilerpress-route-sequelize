const capitalize = require('lodash/capitalize');

module.exports = async (req, res, next) => {
  try {
    const parent = await req.bp.model
      .scope('get')
      .findOne(req.bp.sequelizeOptions);
    if (!parent) {
      throw {
        status: 404,
        message: 'Parent resource not found',
      };
    }
    const results = await parent[`get${capitalize(req.bp.childModelName)}`]({
      scope: 'get',
      ...req.bp.childSequelizeOptions,
    });
    res.json({
      page: req.query.page || 1,
      results,
    });
  } catch (e) {
    next(e);
  }
};
