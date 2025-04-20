const COLORS = ['red', 'blue', 'green', 'yellow']

export class Card {
  constructor(color, value) {
    this.color = color
    this.value = value
  }
}

export function buildDeck() {
  const deck = []
  for (const color of COLORS) {
    for (let i = 1; i <= 9; i++) {
      deck.push(new Card(color, i))
      deck.push(new Card(color, i))
    }
  }
  return deck
}

export function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export function deal(deck, mode, players) {
  const cardsPerPlayer = 11
  const hands = {}
  const DiscardPile = {}

  for (const socket of players) {
    hands[socket.id] = deck.splice(0, cardsPerPlayer)
    DiscardPile[socket.id] = []
  }

  return { hands, DiscardPile }
}
