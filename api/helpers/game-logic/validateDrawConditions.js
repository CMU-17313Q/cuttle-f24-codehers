export default function validateDrawConditions(game, playerId, playerTurn) {
  if (game.oneOff) {
    throw new Error("Can't play while waiting for opponent to counter");
  }
  if (playerId !== playerTurn % 2) {
    throw new Error('game.snackbar.global.notYourTurn');
  }
  if (!game.topCard) {
    throw new Error('game.snackbar.draw.deckIsEmpty');
  }
  return game;
};