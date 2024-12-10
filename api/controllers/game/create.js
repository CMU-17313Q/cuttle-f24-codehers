const gameAPI = sails.hooks['customgamehook'];

module.exports = function (req, res) {
  const { gameName, isRanked = false, player0Id, player1Id } = req.body;

  if (req.body.gameName) {
    gameAPI
      .createGame(gameName, isRanked, gameService.GameStatus.CREATED, player0Id, player1Id)
      .then(function (game) {
        sails.sockets.broadcast('GameList', 'gameCreated', {
          id: game.id,
          name: game.name,
          status: game.status,
          isRanked: game.isRanked,
          players: [], // This will now be populated based on p0 and p1
        });
        return res.ok({ gameId: game.id });
      })
      .catch(function (reason) {
        res.badRequest(reason);
      });
  } else {
    res.badRequest({ message: "Game name is required" });
  }
};