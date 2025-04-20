// server/src/deck.js
const COLORS = ['red', 'blue', 'green', 'yellow']

export class Card {
  constructor(color, value, owner = null) {
    this.color = color
    this.value = value
    this.owner = owner    // será preenchido ao dar as cartas
  }
}

export function buildDeck () {
  const deck = []
  for (const color of COLORS) {
    for (let v = 1; v <= 9; v++) {
      deck.push(new Card(color, v))
      deck.push(new Card(color, v))
    }
  }
  return deck
}

export function shuffle (d) {
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[d[i], d[j]] = [d[j], d[i]]
  }
  return d
}
