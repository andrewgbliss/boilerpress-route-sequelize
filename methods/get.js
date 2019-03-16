module.exports = async (req, res, next) => {
  try {
    const results = await req.bp.model.scope('get').findOne(req.bp.sequelizeOptions);
    res.json(results);
  } catch (e) {
    next(e);
  }
};