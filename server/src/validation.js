// server/src/validation.js

/**
 * Verifica se um grupo de cartas é uma sequência válida (run)
 * Ex: [vermelho 3, vermelho 4, vermelho 5]
 */
function isRun(cards) {
  if (cards.length !== 3) return false
  const [a, b, c] = cards.sort((x, y) => x.value - y.value)
  return a.color === b.color && b.color === c.color &&
         a.value + 1 === b.value && b.value + 1 === c.value &&
         ![1, 9].includes(a.value) && ![1, 9].includes(b.value) && ![1, 9].includes(c.value)
}

/**
 * Verifica se um grupo de cartas é uma trinca válida (set)
 * Ex: [7 azul, 7 verde, 7 vermelho]
 */
function isSet(cards) {
  if (cards.length !== 3) return false
  const [a, b, c] = cards
  const cores = new Set([a.color, b.color, c.color])
  return a.value === b.value && b.value === c.value && cores.size === 3 &&
         ![1, 9].includes(a.value)
}

/**
 * Verifica se um par é válido
 * Pode ser duas cartas do mesmo número OU duas cartas da mesma cor com valores consecutivos
 */
function isPair(cards) {
  if (cards.length !== 2) return false
  const [a, b] = cards
  const sameColorSeq = a.color === b.color && Math.abs(a.value - b.value) === 1
  const sameNumber = a.value === b.value
  return (sameColorSeq || sameNumber) && ![1, 9].includes(a.value) && ![1, 9].includes(b.value)
}

/**
 * Exportado para validação de melds individuais (3 cartas)
 */
export function isValidMeld(cards) {
  return isRun(cards) || isSet(cards)
}

/**
 * Valida se a combinação de cartas forma uma mão vencedora (3x3x3+2)
 */
export function isWinningHand(hand, melds = []) {
  const totalCards = hand.length + melds.flat().length
  if (totalCards !== 11) return false

  // Testa todas combinações possíveis de 3 grupos de 3 e um par
  function permute(arr, size) {
    if (arr.length < size) return []
    const res = []
    for (let i = 0; i <= arr.length - size; i++) {
      res.push([arr[i], ...arr.slice(i + 1, i + size)])
    }
    return res
  }

  function tryBuildHand(cards) {
    const used = new Set()
    const validMelds = []

    // tentar achar 3 melds
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        for (let k = j + 1; k < cards.length; k++) {
          const triplet = [cards[i], cards[j], cards[k]]
          if (triplet.some(c => used.has(c))) continue
          if (isValidMeld(triplet)) {
            validMelds.push(triplet)
            triplet.forEach(c => used.add(c))
            if (validMelds.length === 3) break
          }
        }
        if (validMelds.length === 3) break
      }
      if (validMelds.length === 3) break
    }

    const remaining = cards.filter(c => !used.has(c))
    return validMelds.length === 3 && isPair(remaining)
  }

  return tryBuildHand(hand)
}

