const gameAPI = sails.hooks['customgamehook'];

module.exports = async function (req, res) {
  try {
    const openGames = await gameAPI.findOpenGames();
    return res.ok(openGames);
  } catch (error) {
    return res.badRequest({ message: error.message || 'Error fetching open games' });
  }
};
