import { buildDeck, shuffle } from './deck.js'

export const gameStates = {}

/* ─── Validação de melds ─── */
function isSequence(cards) {
  if (cards.length !== 3) return false
  const [a, b, c] = [...cards].sort((x, y) => x.value - y.value)
  return (
    a.color === b.color &&
    b.color === c.color &&
    a.value + 1 === b.value &&
    b.value + 1 === c.value &&
    a.value > 1 && c.value < 9
  )
}
function isSet(cards) {
  if (cards.length !== 3) return false
  const sameVal = cards.every(c => c.value === cards[0].value)
  const uniqClr = new Set(cards.map(c => c.color)).size === 3
  return sameVal && uniqClr && ![1, 9].includes(cards[0].value)
}
export const isValidMeld = cards => isSequence(cards) || isSet(cards)

/* ─── Validação de par (2 cartas) ─── */
export function isValidPair(cards) {
  if (cards.length !== 2) return false
  const [x, y] = cards
  // mesmo número, cores quaisquer (exceto 1 e 9)
  if (x.value === y.value && ![1, 9].includes(x.value)) return true
  // mesma cor e consecutivos (exceto 1 e 9)
  if (
    x.color === y.color &&
    Math.abs(x.value - y.value) === 1 &&
    ![1, 9].includes(x.value) &&
    ![1, 9].includes(y.value)
  ) return true
  return false
}

/* ─── Início de partida ─── */
export function startGame(room, playerIds) {
  const deck   = shuffle(buildDeck())   // 72 cartas
  const HAND   = 11
  const cards  = {}     // id → { color,value,owner }
  const hands  = {}     // pid → [id]
  const piles  = {}     // pid → [id]
  const allDiscards = []// histórico global
  let serial = 0

  for (const pid of playerIds) {
    hands[pid] = []
    piles[pid] = []
    for (let i = 0; i < HAND; i++) {
      const card = deck.pop()
      card.owner = pid
      const id = `c${serial++}`
      cards[id] = card
      hands[pid].push(id)
    }
  }

  const drawPile = deck.map(card => {
    const id = `c${serial++}`
    cards[id] = { ...card, owner: null }
    return id
  })

  gameStates[room] = {
    cards,
    hands,
    DiscardPile : piles,
    allDiscards,
    drawPile,
    melds       : {},           // pid → [[ids]]
    turnOrder   : [...playerIds],
    currentTurnIdx : 0,
    phase          : 'draw'
  }
  return gameStates[room]
}

/* ─── Ações ─── */
export function drawDeck(room, pid) {
  const s = gameStates[room]
  if (!s || s.turnOrder[s.currentTurnIdx] !== pid || s.phase !== 'draw') return
  if (!s.drawPile.length) return

  const cid = s.drawPile.pop()
  s.cards[cid].owner = pid
  s.hands[pid].push(cid)
  s.phase = 'discard'
}

export function discard(room, pid, { color, value }) {
  const s = gameStates[room]
  if (!s || s.turnOrder[s.currentTurnIdx] !== pid || s.phase !== 'discard') return

  const idx = s.hands[pid].findIndex(cid => {
    const c = s.cards[cid]
    return c.color === color && c.value === value
  })
  if (idx === -1) return

  const [cid] = s.hands[pid].splice(idx, 1)
  s.cards[cid].owner = null       // retira owner para não aparecer na mão
  s.DiscardPile[pid].push(cid)
  s.allDiscards.push(cid)
  advanceTurn(room)
}

export function meld(room, pid, ids) {
  const s = gameStates[room]
  if (!s) return { error: 'room' }
  if (!ids.every(cid => s.hands[pid].includes(cid))) return { error: 'not_in_hand' }
  const cardsArr = ids.map(cid => s.cards[cid])
  if (!isValidMeld(cardsArr)) return { error: 'invalid' }

  ids.forEach(cid => {
    const i = s.hands[pid].indexOf(cid)
    if (i !== -1) s.hands[pid].splice(i, 1)
  })
  ;(s.melds[pid] ||= []).push(ids)
  return { success: true }
}

export function advanceTurn(room) {
  const s = gameStates[room]
  s.currentTurnIdx = (s.currentTurnIdx + 1) % s.turnOrder.length
  s.phase = 'draw'
}

/* ─── Checagem de vitória ─── */
export function checkVictory(room, pid) {
  const s = gameStates[room]
  if (!s) return false

  const groups = s.melds[pid] || []
  if (groups.length !== 3) return false

  const handIds = s.hands[pid] || []
  if (handIds.length !== 2) return false

  const remaining = handIds.map(id => s.cards[id])
  return isValidPair(remaining)
}
