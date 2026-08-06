import { useEffect, useState, useCallback } from 'react'
import type { Gift } from '../lib/types'
import { fetchGifts, subscribeToRegistry, isLiveShared } from '../lib/dataStore'
import { GiftCard } from './GiftCard'

type Filter = 'all' | 'needed' | 'blessed'

function isFullyBlessed(gift: Gift): boolean {
  const total = gift.pledges.reduce((sum, p) => sum + p.quantityPledged, 0)
  return total >= gift.quantityNeeded
}

export function GiftRegistry() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  const load = useCallback(async () => {
    const data = await fetchGifts()
    setGifts(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const unsubscribe = subscribeToRegistry(() => {
      load()
    })
    return unsubscribe
  }, [load])

  const filtered = gifts.filter((g) => {
    if (filter === 'needed') return !isFullyBlessed(g)
    if (filter === 'blessed') return isFullyBlessed(g)
    return true
  })

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All gifts' },
    { key: 'needed', label: 'Still needed' },
    { key: 'blessed', label: 'Fully blessed' },
  ]

  return (
    <section id="registry" className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-4">
        <h2 className="font-heading text-3xl font-bold text-ink mb-2">A Little Gift Registry</h2>
        <p className="font-body text-ink/60 max-w-lg mx-auto">
          If you'd like to bless us with something, here's what would mean the world right now. No pressure at
          all — your presence is the real gift.
        </p>

        {!isLiveShared && (
          <p className="font-body text-xs text-amber-600 bg-amber-50 inline-block rounded-full px-4 py-1.5 mt-4">
            Running in local demo mode — connect Supabase (see README) so pledges sync across every guest's
            device.
          </p>
        )}
        
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`font-body text-sm font-semibold px-4 py-2 rounded-full transition ${
              filter === f.key
                ? 'bg-blush-400 text-white shadow-soft'
                : 'bg-white/70 text-ink/60 hover:bg-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center font-body text-ink/50">Loading the registry...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center font-body text-ink/50">No gifts here right now.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      )}
    </section>
  )
}
