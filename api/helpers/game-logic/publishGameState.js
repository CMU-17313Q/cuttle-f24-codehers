module.exports = function publishGameState(game) {
  Game.publish([game.id], {
    change: 'draw',
    game,
  });
};