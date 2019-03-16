module.exports = async (req, res, next, id) => {
  req.bp.resourceId = id;
  next();
};