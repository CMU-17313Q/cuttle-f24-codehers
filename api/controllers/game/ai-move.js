module.exports = async function (req, res) {
  try {
    const gameId = req.session.game;
    const game = await gameService.findGame({ gameId });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (!game.isVsAI) {
      return res.status(400).json({ message: 'This game is not against an AI opponent' });
    }

    // Call the AI move logic
    await aiMoveHelper.makeMove(game);

    return res.status(200).json({ message: 'AI move made successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
