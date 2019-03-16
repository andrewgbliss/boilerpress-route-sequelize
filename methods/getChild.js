module.exports = async (req, res, next) => {
  try {
    const results = await req.bp.childModel
      .scope('get')
      .findOne(req.bp.childSequelizeOptions);
    res.json(results);
  } catch (e) {
    next(e);
  }
};
