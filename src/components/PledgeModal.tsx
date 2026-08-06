import { useMemo, useState, FormEvent } from 'react'
import type { Gift } from '../lib/types'
import { addPledge } from '../lib/dataStore'
import { eventConfig } from '../config'

interface PledgeModalProps {
  gift: Gift
  remaining: number
  onClose: () => void
}

export function PledgeModal({ gift, remaining, onClose }: PledgeModalProps) {
  const isMultiUnit = gift.quantityNeeded > 1
  const [guestName, setGuestName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [confirmDuplicate, setConfirmDuplicate] = useState(false)

  const hasExistingPledgeFromGuest = useMemo(() => {
    const trimmed = guestName.trim().toLowerCase()
    if (!trimmed) return false
    return gift.pledges.some((p) => p.guestName.trim().toLowerCase() === trimmed)
  }, [guestName, gift.pledges])

  async function submitPledge() {
    setSubmitting(true)
    setError(null)
    const { error } = await addPledge({
      giftId: gift.id,
      guestName: guestName.trim(),
      quantityPledged: isMultiUnit ? quantity : 1,
      note: note.trim() || undefined,
    })
    setSubmitting(false)
    if (error) {
      setError(error)
      return
    }
    setSuccess(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!guestName.trim()) {
      setError('Please let us know who this gift is from.')
      return
    }
    if (isMultiUnit && (quantity < 1 || quantity > remaining)) {
      setError(`Please choose between 1 and ${remaining}.`)
      return
    }
    if (hasExistingPledgeFromGuest && !confirmDuplicate) {
      setConfirmDuplicate(true)
      return
    }
    await submitPledge()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4 py-6" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-soft max-w-md w-full p-6 sm:p-8 animate-pop max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center flex flex-col items-center gap-3 py-4">
            <span className="text-4xl">💕</span>
            <h3 className="font-heading text-xl font-bold text-ink">
              Thank you for blessing {eventConfig.babyName} with {gift.name}!
            </h3>
            <p className="font-body text-sm text-ink/60">Your kindness means so much to us.</p>
            <button
              onClick={onClose}
              className="mt-2 bg-blush-400 hover:bg-blush-300 text-white font-heading font-semibold rounded-2xl px-6 py-2.5 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-heading text-xl font-bold text-ink mb-1">Bless this gift</h3>
            <p className="font-body text-sm text-ink/60 mb-5">
              {gift.name}
              {isMultiUnit && ` — ${remaining} of ${gift.quantityNeeded} ${gift.unitLabel} still needed`}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="font-body text-sm font-semibold text-ink/70">Your name</span>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value)
                    setConfirmDuplicate(false)
                  }}
                  className="rounded-xl border border-blush-200 px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-blush-300"
                  placeholder="Jane Dela Cruz"
                />
              </label>

              {isMultiUnit && (
                <label className="flex flex-col gap-1">
                  <span className="font-body text-sm font-semibold text-ink/70">
                    How many {gift.unitLabel}? (up to {remaining})
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={remaining}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(remaining, Math.max(1, Number(e.target.value))))}
                    className="rounded-xl border border-blush-200 px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-blush-300"
                  />
                </label>
              )}

              <label className="flex flex-col gap-1">
                <span className="font-body text-sm font-semibold text-ink/70">A note (optional)</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="rounded-xl border border-blush-200 px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-blush-300"
                  placeholder="Can't wait to meet baby! 💛"
                />
              </label>

              {confirmDuplicate && (
                <p className="text-sm text-amber-600 font-body bg-amber-50 rounded-xl px-3 py-2">
                  Looks like {guestName} already blessed this gift once — that's more than okay if you're
                  contributing again! Submit again to confirm.
                </p>
              )}

              {error && <p className="text-sm text-rose-500 font-body">{error}</p>}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl px-4 py-2.5 font-heading font-semibold text-sm sm:text-base text-ink/60 bg-cream-100 hover:bg-cream-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-2xl px-4 py-2.5 font-heading font-semibold text-sm sm:text-base text-white bg-blush-400 hover:bg-blush-300 disabled:opacity-60 transition shadow-soft"
                >
                  {submitting ? 'Sending...' : confirmDuplicate ? 'Yes, confirm' : 'Bless this gift'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
