module.exports = async (req, res, next) => {
  try {
    const results = await req.bp.model.scope('get').findAll(req.bp.sequelizeOptions);
    res.json({
      page: req.query.page || 1,
      results,
    });
  } catch (e) {
    next(e);
  }
};