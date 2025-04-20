/**
 * Return true if any card is 1 or 9 (não pode em meld).
 */
function has19(cards) {
    return cards.some(c => c.value === 1 || c.value === 9)
  }
  
  /**
   * Sequência (run): 3 números consecutivos, mesma cor.
   */
  export function isRun(cards) {
    if (cards.length !== 3) return false
    if (has19(cards)) return false
    const [a, b, c] = cards
    if (a.color !== b.color || b.color !== c.color) return false
    const vals = [a.value, b.value, c.value].sort((x, y) => x - y)
    return vals[1] === vals[0] + 1 && vals[2] === vals[1] + 1
  }
  
  /**
   * Trinca (set): 3 cartas, mesmo valor, cores diferentes.
   */
  export function isSet(cards) {
    if (cards.length !== 3) return false
    if (has19(cards)) return false
    const values = new Set(cards.map(c => c.value))
    const colors = new Set(cards.map(c => c.color))
    return values.size === 1 && colors.size === 3
  }
  
  /**
   * Par: 2 cartas – mesmo número OU mesma cor e números consecutivos.
   */
  export function isPair(cards) {
    if (cards.length !== 2) return false
    if (has19(cards)) return false
    const [a, b] = cards
    if (a.value === b.value) return true
    if (a.color === b.color && Math.abs(a.value - b.value) === 1) return true
    return false
  }
  
  /**
   * Checa se cards formam meld válido.
   */
  export function isValidMeld(cards) {
    if (cards.length === 3) return isRun(cards) || isSet(cards)
    if (cards.length === 2) return isPair(cards)
    return false
  }
  