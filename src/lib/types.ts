export type GiftIcon = 'star' | 'cloud' | 'bootie' | 'heart' | 'balloon'

export interface Pledge {
  id: string
  giftId: string
  guestName: string
  quantityPledged: number
  note?: string
  createdAt: string
}

export interface Gift {
  id: string
  name: string
  quantityNeeded: number
  unitLabel: string
  icon: GiftIcon
  sortOrder: number
  pledges: Pledge[]
}

export interface RSVPEntry {
  guestName: string
  guestCount: number
  contact?: string
  message?: string
}

export interface PledgeInput {
  giftId: string
  guestName: string
  quantityPledged: number
  note?: string
}
