module.exports = function handleError(err, res) {
  return res.badRequest({ message: err.message });
};