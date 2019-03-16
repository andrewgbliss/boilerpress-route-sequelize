module.exports = async (req, res, next) => {
  try {
    const results = await req.bp.model.scope('patch').update(req.body, req.bp.sequelizeOptions);
    res.json(results);
  } catch (e) {
    next(e);
  }
};
