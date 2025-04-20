import { describe, it, expect } from 'vitest'
import { Card, buildDeck, shuffle, deal } from '../deck.js'

describe('Deck module', () => {
  it('buildDeck() deve gerar 72 cartas válidas', () => {
    const deck = buildDeck()
    expect(deck).toHaveLength(72)
    // cada combinação deve aparecer duas vezes
    const counts = {}
    for (const c of deck) {
      const key = `${c.color}-${c.value}`
      counts[key] = (counts[key] || 0) + 1
    }
    Object.values(counts).forEach(cnt => expect(cnt).toBe(2))
  })

  it('shuffle() não altera o total de cartas', () => {
    const deck = buildDeck()
    const copy = [...deck]
    const shuffled = shuffle(deck)
    expect(shuffled).toHaveLength(72)
    // devem conter os mesmos elementos (verificando pelo menos primeira e última)
    expect(shuffled[0]).toBeDefined()
    expect(shuffled[71]).toBeDefined()
    // e não ser exatamente igual à deck não embaralhado (baixa prob.)
    expect(shuffled).not.toEqual(copy)
  })

  it('deal() distribui corretamente para 2 jogadores', () => {
    const deck = shuffle(buildDeck())
    const players = ['A','B']
    const { hands, discardPiles } = deal(deck, 2, players)
    expect(Object.keys(hands)).toEqual(players)
    expect(hands.A).toHaveLength(36)
    expect(hands.B).toHaveLength(36)
    expect(discardPiles.A).toHaveLength(0)
    expect(discardPiles.B).toHaveLength(0)
  })

  it('deal() distribui corretamente para 3 jogadores', () => {
    const deck = shuffle(buildDeck())
    const players = ['X','Y','Z']
    const { hands, discardPiles } = deal(deck, 3, players)
    expect(hands.X).toHaveLength(24)
    expect(hands.Y).toHaveLength(24)
    expect(hands.Z).toHaveLength(24)
    expect(discardPiles.Z).toHaveLength(0)
  })
})
