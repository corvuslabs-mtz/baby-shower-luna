import { useState } from 'react'
import type { Gift } from '../lib/types'
import { giftIconMap } from './icons'
import { PledgeModal } from './PledgeModal'

function joinNames(names: string[]): string {
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

export function GiftCard({ gift }: { gift: Gift }) {
  const [modalOpen, setModalOpen] = useState(false)
  const Icon = giftIconMap[gift.icon] ?? giftIconMap.star

  const totalPledged = gift.pledges.reduce((sum, p) => sum + p.quantityPledged, 0)
  const remaining = Math.max(0, gift.quantityNeeded - totalPledged)
  const isFullyBlessed = totalPledged >= gift.quantityNeeded
  const progressPct = Math.min(100, Math.round((totalPledged / gift.quantityNeeded) * 100))
  const isMultiUnit = gift.quantityNeeded > 1

  const contributorNames = isMultiUnit
    ? gift.pledges.map((p) => `${p.guestName} (${p.quantityPledged})`)
    : gift.pledges.map((p) => p.guestName)

  let statusText: string
  if (gift.pledges.length === 0) {
    statusText = 'Still waiting to be blessed 💛'
  } else if (isFullyBlessed) {
    statusText = `This gift has found its way to us, thanks to ${joinNames(contributorNames)}. No further gifts needed here — thank you!`
  } else if (isMultiUnit) {
    statusText = `${totalPledged} of ${gift.quantityNeeded} ${gift.unitLabel} blessed so far — thanks to ${joinNames(contributorNames)}`
  } else {
    statusText = 'Still waiting to be blessed 💛'
  }

  return (
    <div className="bg-white/80 rounded-3xl shadow-soft p-6 flex flex-col gap-4 border border-white">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-cream-100 flex items-center justify-center text-blush-400">
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-bold text-ink">{gift.name}</h3>
          <p className="font-body text-sm text-ink/50">
            {gift.quantityNeeded} {gift.unitLabel || 'needed'}
          </p>
        </div>
      </div>

      {isMultiUnit && (
        <div className="w-full h-3 bg-cream-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blush-300 to-blush-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      <p className="font-body text-sm text-ink/70 leading-relaxed">{statusText}</p>

      {isFullyBlessed ? (
        <span className="self-start font-body text-xs font-semibold uppercase tracking-wide text-mint-200 bg-mint-50 px-3 py-1.5 rounded-full">
          Blessed with love 💚
        </span>
      ) : (
        <button
          onClick={() => setModalOpen(true)}
          className="self-start bg-blush-400 hover:bg-blush-300 text-white font-heading font-semibold rounded-2xl px-5 py-2.5 transition shadow-soft"
        >
          I'd love to give this
        </button>
      )}

      {modalOpen && (
        <PledgeModal gift={gift} remaining={remaining} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
