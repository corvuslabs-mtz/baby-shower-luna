import { useState, FormEvent } from 'react'
import { addRSVP } from '../lib/dataStore'
import { HeartIcon } from './icons'

export function RSVP() {
  const [guestName, setGuestName] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!guestName.trim()) {
      setError('Please let us know your name.')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error } = await addRSVP({ guestName: guestName.trim(), guestCount, contact: contact.trim(), message: message.trim() })
    setSubmitting(false)
    if (error) {
      setError(error)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="rsvp" className="max-w-xl mx-auto px-4 py-16 text-center">
        <HeartIcon className="w-12 h-12 text-blush-400 mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-ink mb-2">You're on the list! 💌</h2>
        <p className="font-body text-ink/70">
          Thank you, {guestName}! We can't wait to celebrate with you.
        </p>
      </section>
    )
  }

  return (
    <section id="rsvp" className="max-w-xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-ink mb-2">Will you join us?</h2>
        <p className="font-body text-ink/60">Let us know so we can save you a seat.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/80 rounded-3xl shadow-soft p-6 sm:p-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-body text-sm font-semibold text-ink/70">Your name</span>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="rounded-xl border border-blush-200 px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-blush-300"
            placeholder="Jane Dela Cruz"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-body text-sm font-semibold text-ink/70">Number of guests attending</span>
          <input
            type="number"
            min={1}
            value={guestCount}
            onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
            className="rounded-xl border border-blush-200 px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-blush-300"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-body text-sm font-semibold text-ink/70">Email or phone</span>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="rounded-xl border border-blush-200 px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-blush-300"
            placeholder="jane@example.com"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-body text-sm font-semibold text-ink/70">Message (optional)</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="rounded-xl border border-blush-200 px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-blush-300"
            placeholder="Can't wait to meet the little one!"
          />
        </label>

        {error && <p className="text-sm text-rose-500 font-body">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-blush-400 hover:bg-blush-300 disabled:opacity-60 text-white font-heading font-semibold rounded-2xl py-3 transition shadow-soft"
        >
          {submitting ? 'Sending...' : 'Send RSVP'}
        </button>
      </form>
    </section>
  )
}
