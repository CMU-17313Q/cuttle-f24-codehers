module.exports = function handleError(err, res) {
  const message = err?.message || 'Unknown error occurred';
  return res.badRequest({ message });
};
