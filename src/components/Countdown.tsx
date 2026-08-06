import { useEffect, useState } from 'react'

function getTimeParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, isPast: diff <= 0 }
}

export function Countdown({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate)
  const [parts, setParts] = useState(() => getTimeParts(target))

  useEffect(() => {
    const id = setInterval(() => setParts(getTimeParts(target)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (parts.isPast) {
    return (
      <p className="font-heading text-lg text-blush-400">The celebration has begun! 🎉</p>
    )
  }

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: parts.days },
    { label: 'Hours', value: parts.hours },
    { label: 'Minutes', value: parts.minutes },
    { label: 'Seconds', value: parts.seconds },
  ]

  return (
    <div className="flex gap-3 sm:gap-5">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex flex-col items-center justify-center bg-white/70 backdrop-blur rounded-2xl shadow-soft px-3 py-2 sm:px-5 sm:py-3 min-w-[64px] sm:min-w-[84px]"
        >
          <span className="font-heading text-2xl sm:text-3xl font-bold text-ink tabular-nums">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="text-xs sm:text-sm text-ink/60 font-body">{u.label}</span>
        </div>
      ))}
    </div>
  )
}
