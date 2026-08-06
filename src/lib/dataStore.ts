import { supabase, isSupabaseConfigured } from './supabase'
import { buildSeedGifts } from '../data/seedGifts'
import type { Gift, Pledge, PledgeInput, RSVPEntry } from './types'

export const isLiveShared = isSupabaseConfigured

const LOCAL_GIFTS_KEY = 'baby-shower:gifts'
const localEvents = new EventTarget()
const LOCAL_CHANGE = 'change'

// ---------------------------------------------------------------------------
// Local (single-browser) fallback, used when Supabase env vars aren't set.
// Lets the site run and demo fully before a backend is connected.
// ---------------------------------------------------------------------------

function readLocalGifts(): Gift[] {
  const raw = localStorage.getItem(LOCAL_GIFTS_KEY)
  if (!raw) {
    const seeded = buildSeedGifts()
    localStorage.setItem(LOCAL_GIFTS_KEY, JSON.stringify(seeded))
    return seeded
  }
  try {
    return JSON.parse(raw) as Gift[]
  } catch {
    const seeded = buildSeedGifts()
    localStorage.setItem(LOCAL_GIFTS_KEY, JSON.stringify(seeded))
    return seeded
  }
}

function writeLocalGifts(gifts: Gift[]) {
  localStorage.setItem(LOCAL_GIFTS_KEY, JSON.stringify(gifts))
  localEvents.dispatchEvent(new Event(LOCAL_CHANGE))
}

async function localFetchGifts(): Promise<Gift[]> {
  return readLocalGifts().sort((a, b) => a.sortOrder - b.sortOrder)
}

async function localAddPledge(input: PledgeInput): Promise<{ error: string | null }> {
  const gifts = readLocalGifts()
  const gift = gifts.find((g) => g.id === input.giftId)
  if (!gift) return { error: 'This gift could not be found.' }

  const alreadyPledged = gift.pledges.reduce((sum, p) => sum + p.quantityPledged, 0)
  const remaining = gift.quantityNeeded - alreadyPledged
  if (input.quantityPledged > remaining) {
    return { error: `Only ${remaining} left on this gift — ${input.quantityPledged} was requested.` }
  }

  const pledge: Pledge = {
    id: crypto.randomUUID(),
    giftId: input.giftId,
    guestName: input.guestName,
    quantityPledged: input.quantityPledged,
    note: input.note,
    createdAt: new Date().toISOString(),
  }
  gift.pledges.push(pledge)
  writeLocalGifts(gifts)
  return { error: null }
}

async function localAddRSVP(_entry: RSVPEntry): Promise<{ error: string | null }> {
  const raw = localStorage.getItem('baby-shower:rsvps')
  const list = raw ? JSON.parse(raw) : []
  list.push({ ..._entry, createdAt: new Date().toISOString() })
  localStorage.setItem('baby-shower:rsvps', JSON.stringify(list))
  return { error: null }
}

function localSubscribe(onChange: () => void): () => void {
  const handler = () => onChange()
  localEvents.addEventListener(LOCAL_CHANGE, handler)
  window.addEventListener('storage', handler)
  return () => {
    localEvents.removeEventListener(LOCAL_CHANGE, handler)
    window.removeEventListener('storage', handler)
  }
}

// ---------------------------------------------------------------------------
// Supabase-backed implementation, used when VITE_SUPABASE_URL / ANON_KEY
// are set. Pledges and RSVPs sync live to every guest via Realtime.
// ---------------------------------------------------------------------------

async function supabaseFetchGifts(): Promise<Gift[]> {
  const client = supabase!
  const [{ data: giftsRows, error: giftsError }, { data: pledgeRows, error: pledgesError }] = await Promise.all([
    client.from('gifts').select('*').order('sort_order', { ascending: true }),
    client.from('pledges').select('*').order('created_at', { ascending: true }),
  ])

  if (giftsError) throw giftsError
  if (pledgesError) throw pledgesError

  const pledgesByGift = new Map<string, Pledge[]>()
  for (const row of pledgeRows ?? []) {
    const pledge: Pledge = {
      id: row.id,
      giftId: row.gift_id,
      guestName: row.guest_name,
      quantityPledged: row.quantity_pledged,
      note: row.note ?? undefined,
      createdAt: row.created_at,
    }
    const list = pledgesByGift.get(pledge.giftId) ?? []
    list.push(pledge)
    pledgesByGift.set(pledge.giftId, list)
  }

  return (giftsRows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    quantityNeeded: row.quantity_needed,
    unitLabel: row.unit_label ?? '',
    icon: (row.icon ?? 'star') as Gift['icon'],
    sortOrder: row.sort_order ?? 0,
    pledges: pledgesByGift.get(row.id) ?? [],
  }))
}

async function supabaseAddPledge(input: PledgeInput): Promise<{ error: string | null }> {
  const client = supabase!
  const { error } = await client.from('pledges').insert({
    gift_id: input.giftId,
    guest_name: input.guestName,
    quantity_pledged: input.quantityPledged,
    note: input.note || null,
  })

  if (error) {
    if (error.message?.includes('left on this gift')) {
      return { error: error.message }
    }
    return { error: 'Something went wrong saving that pledge — please try again.' }
  }
  return { error: null }
}

async function supabaseAddRSVP(entry: RSVPEntry): Promise<{ error: string | null }> {
  const client = supabase!
  const { error } = await client.from('rsvps').insert({
    guest_name: entry.guestName,
    guest_count: entry.guestCount,
    contact: entry.contact || null,
    message: entry.message || null,
  })
  if (error) return { error: 'Something went wrong saving your RSVP — please try again.' }
  return { error: null }
}

function supabaseSubscribe(onChange: () => void): () => void {
  const client = supabase!
  const channel = client
    .channel('public:registry-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pledges' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'gifts' }, onChange)
    .subscribe()

  return () => {
    client.removeChannel(channel)
  }
}

// ---------------------------------------------------------------------------
// Public API — picks the backend based on whether Supabase is configured.
// ---------------------------------------------------------------------------

export function fetchGifts(): Promise<Gift[]> {
  return isSupabaseConfigured ? supabaseFetchGifts() : localFetchGifts()
}

export function addPledge(input: PledgeInput): Promise<{ error: string | null }> {
  return isSupabaseConfigured ? supabaseAddPledge(input) : localAddPledge(input)
}

export function addRSVP(entry: RSVPEntry): Promise<{ error: string | null }> {
  return isSupabaseConfigured ? supabaseAddRSVP(entry) : localAddRSVP(entry)
}

export function subscribeToRegistry(onChange: () => void): () => void {
  return isSupabaseConfigured ? supabaseSubscribe(onChange) : localSubscribe(onChange)
}
