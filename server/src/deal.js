// server/src/deal.js
export function buildDeck() {
    const colors = ['red', 'blue', 'green', 'yellow']
    const deck = []
  
    for (const color of colors) {
      for (let value = 1; value <= 9; value++) {
        deck.push({ color, value })
        deck.push({ color, value }) // cada carta aparece duas vezes
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
  
  export function deal(deck, mode, playerIds) {
    const hands = {}
    const DiscardPile = {}
  
    const handSize = 11
  
    for (const pid of playerIds) {
      hands[pid] = deck.splice(0, handSize)
      DiscardPile[pid] = []
    }
  
    return { hands, DiscardPile }
  }
  