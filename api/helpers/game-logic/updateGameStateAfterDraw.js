const _ = require('lodash');

module.exports = function updateGameStateAfterDraw(game, user) {
  const gameUpdates = {
    topCard: null,
    log: [...game.log, `${user.username} drew a card`],
    turn: game.turn + 1,
    lastEvent: { change: 'draw' },
  };
  const userUpdates = { frozenId: null };
  if (game.secondCard) {
    gameUpdates.topCard = game.secondCard.id;
    if (game.deck.length > 0) {
      const newSecondCard = _.sample(game.deck);
      gameUpdates.secondCard = newSecondCard.id;
    } else {
      gameUpdates.secondCard = null;
    }
  }
  return { gameUpdates, userUpdates };
};
