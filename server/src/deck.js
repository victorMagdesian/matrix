// server/src/deck.js
// ────────────────────────────────────────────────────────────
// Construção e distribuição do baralho (72 cartas = 4 cores × 1‑9 duplicados)

const COLORS = ['red', 'blue', 'green', 'yellow']

export class Card {
  constructor(color, value) {
    this.color = color
    this.value  = value
  }
}

/** Gera as 72 cartas do jogo */
export function buildDeck () {
  const deck = []
  for (const color of COLORS) {
    for (let v = 1; v <= 9; v++) {
      deck.push(new Card(color, v))
      deck.push(new Card(color, v))   // cada combinação aparece duas vezes
    }
  }
  return deck
}

/** Fisher‑Yates */
export function shuffle (deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

/**
 * Distribui 11 cartas para cada jogador e cria as pilhas de descarte.
 * Aceita tanto um array de _socket objects_ quanto de _playerIds_ (strings).
 */
export function deal (deck, playerList) {
  const hands        = {}
  const DiscardPile  = {}
  const HAND_SIZE    = 11

  for (const p of playerList) {
    const pid = typeof p === 'string' ? p : p.id          // flexível
    hands[pid]       = deck.splice(0, HAND_SIZE)
    DiscardPile[pid] = []                                 // topo = último índice
  }

  return { hands, DiscardPile }
}
