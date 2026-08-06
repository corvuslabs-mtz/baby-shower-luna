import type { Gift, GiftIcon } from '../lib/types'

interface SeedGift {
  name: string
  quantityNeeded: number
  unitLabel: string
  icon: GiftIcon
}

export const seedGiftList: SeedGift[] = [
  { name: 'Crib', quantityNeeded: 1, unitLabel: '', icon: 'star' },
  { name: 'Baby Clothes (0-3 months)', quantityNeeded: 5, unitLabel: 'sets', icon: 'bootie' },
  { name: 'Diapers (Newborn size)', quantityNeeded: 10, unitLabel: 'packs', icon: 'cloud' },
  { name: 'Stroller', quantityNeeded: 1, unitLabel: '', icon: 'star' },
  { name: 'Baby Bottles', quantityNeeded: 6, unitLabel: 'pcs', icon: 'heart' },
  { name: 'Baby Blankets', quantityNeeded: 3, unitLabel: 'pcs', icon: 'cloud' },
]

export function buildSeedGifts(): Gift[] {
  return seedGiftList.map((g, index) => ({
    id: crypto.randomUUID(),
    name: g.name,
    quantityNeeded: g.quantityNeeded,
    unitLabel: g.unitLabel,
    icon: g.icon,
    sortOrder: index + 1,
    pledges: [],
  }))
}
