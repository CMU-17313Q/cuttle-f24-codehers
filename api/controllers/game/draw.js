const validateDrawConditions = require('../../helpers/game-logic/validateDrawConditions').default;
const updateGameStateAfterDraw = require('../../helpers/game-logic/updateGameStateAfterDraw');
const publishGameState = require('../../helpers/game-logic/publishGameState');
const handleError = require('../../helpers/ggame-logic/handleError');

module.exports = async function (req, res) {
  try {
    const game = await gameService.findGame({ gameId: req.session.game });
    const user = await userService.findUser({ userId: req.session.usr });

    // this line is to calling helper method to validate draw conditions
    validateDrawConditions(game, req.session.pNum, game.turn);

    // this line is to calling helper method to update game state after draw
    const { gameUpdates, userUpdates } = updateGameStateAfterDraw(game, user);
    await Game.updateOne({ id: game.id }).set(gameUpdates);
    await User.updateOne({ id: user.id }).set(userUpdates);

    // this line is to calling helper method topublish the updated game state
    publishGameState(game);

    return res.ok();
  } catch (err) {
    handleError(err, res);
  }
};

