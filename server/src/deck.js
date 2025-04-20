// server/src/deck.js

/**
 * Representa uma carta do jogo Matrix.
 */
export class Card {
    /**
     * @param {'red'|'blue'|'green'|'yellow'} color 
     * @param {number} value 1–9
     */
    constructor(color, value) {
      if (!['red','blue','green','yellow'].includes(color)) {
        throw new Error(`Invalid color: ${color}`);
      }
      if (value < 1 || value > 9) {
        throw new Error(`Invalid value: ${value}`);
      }
      this.color = color;
      this.value = value;
    }
  }
  
  /**
   * Gera um baralho de 72 cartas: 4 cores × 1–9 × 2 cópias.
   * @returns {Card[]}
   */
  export function buildDeck() {
    const colors = ['red','blue','green','yellow'];
    const deck = [];
    for (const color of colors) {
      for (let v = 1; v <= 9; v++) {
        deck.push(new Card(color, v), new Card(color, v));
      }
    }
    if (deck.length !== 72) {
      throw new Error(`Deck size invalid: ${deck.length} cards`);
    }
    return deck;
  }
  
  /**
   * Embaralha um array de cartas in‑place usando Fisher–Yates.
   * @param {Card[]} deck 
   * @returns {Card[]}
   */
  export function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
  
  /**
   * Divide o baralho entre os jogadores em 1×1 ou 1×1×1.
   *
   * @param {Card[]} deck Baralho embaralhado
   * @param {2|3} mode Número de jogadores
   * @returns {{
   *   hands: Record<string, Card[]>,
   *   discardPiles: Record<string, Card[]>
   * }}
   */
  export function deal(deck, mode, playerIds) {
    const perHand = mode === 2 ? 36 : 24;
    if (perHand * mode !== deck.length) {
      throw new Error(`Deck size ${deck.length} não compatível com mode ${mode}`);
    }
    const hands = {};
    const discardPiles = {};
    for (let i = 0; i < mode; i++) {
      const pid = playerIds[i];
      const hand = deck.slice(i * perHand, (i + 1) * perHand);
      hands[pid] = [...hand];
      discardPiles[pid] = []; // começa vazia
    }
    return { hands, discardPiles };
  }
  