// Estado de todas as salas
export const gameStates = {}

export function startGame(room, playerIds) {
  const deck = shuffle(buildDeck())
  const mode = playerIds.length
  const { hands, DiscardPile } = deal(deck, mode, playerIds)

  gameStates[room] = {
    hands,
    DiscardPile,
    melds: {},
    turnOrder: [...playerIds],
    currentTurnIndex: 0
  }

  console.log('🎮 Jogo iniciado:', gameStates[room])
  return gameStates[room]
}
