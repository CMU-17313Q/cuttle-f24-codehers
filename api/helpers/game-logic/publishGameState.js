module.exports = function publishGameState(game) {
  if (!game) {
    console.error('Game object is missing');
    return;
  }

  Game.publish([game.id], {
    change: 'draw',
    game,
  });
};
