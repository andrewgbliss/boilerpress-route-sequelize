module.exports = async (req, res, next, childResourceId) => {
  req.bp.childResourceId = childResourceId;
  next();
};