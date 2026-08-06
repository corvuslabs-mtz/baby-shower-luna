import { eventConfig } from '../config'
import { Countdown } from './Countdown'
import { CloudIcon, StarIcon, BalloonIcon } from './icons'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-100 via-blush-50 to-cream-50 pt-16 pb-20 px-4">
      <CloudIcon className="absolute top-6 left-2 w-14 h-9 sm:top-10 sm:left-4 sm:w-24 sm:h-16 text-sky-300 animate-float opacity-80" />
      <CloudIcon className="absolute top-4 right-2 w-16 h-10 sm:top-24 sm:right-8 sm:w-32 sm:h-20 text-white opacity-90 animate-float" />
      <StarIcon className="absolute bottom-16 left-10 w-8 h-8 text-cream-200 animate-float hidden sm:block" />
      <BalloonIcon className="absolute top-8 right-1/4 w-10 h-16 text-blush-300 animate-float hidden sm:block" />

      <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <span className="uppercase tracking-[0.3em] text-xs sm:text-sm text-ink/50 font-body font-semibold">
          You're invited to a baby shower for
        </span>

        <h1 className="font-heading text-4xl sm:text-6xl font-bold text-ink leading-tight">
          {eventConfig.babyName}
          {eventConfig.babyNickname && (
            <span className="block text-2xl sm:text-3xl text-blush-400 mt-2">"{eventConfig.babyNickname}"</span>
          )}
        </h1>

        <p className="font-body text-ink/70 text-base sm:text-lg max-w-xl">{eventConfig.welcomeMessage}</p>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-ink/80 font-body">
          <span className="font-semibold">{eventConfig.dateDisplay}</span>
          <span className="hidden sm:inline">•</span>
          <span>{eventConfig.timeDisplay}</span>
        </div>

        <a
          href={eventConfig.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="font-body text-ink/70 underline decoration-blush-300 decoration-2 underline-offset-4 hover:text-blush-400 transition"
        >
          {eventConfig.venueName} — {eventConfig.venueAddress}
        </a>

        {eventConfig.theme && (
          <p className="font-body text-sm text-ink/60 italic">{eventConfig.theme}</p>
        )}

        <div className="mt-4">
          <Countdown targetDate={eventConfig.dateTimeISO} />
        </div>

        <p className="font-body text-ink/60 text-sm mt-2">With so much love, {eventConfig.parents}</p>
      </div>
    </section>
  )
}
