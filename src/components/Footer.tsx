import { eventConfig } from '../config'
import { StarIcon } from './icons'

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-lavender-100 to-blush-50 pt-14 pb-10 px-4 text-center">
      <StarIcon className="w-8 h-8 text-blush-300 mx-auto mb-4" />
      <p className="font-heading text-xl font-bold text-ink mb-2">With all our love,</p>
      <p className="font-body text-ink/70 mb-6">{eventConfig.parents}</p>

      <p className="font-body text-sm text-ink/60 max-w-md mx-auto mb-6">{eventConfig.footerNote}</p>

      <div className="flex flex-col items-center gap-1 font-body text-sm text-ink/50">
        <a href={`mailto:${eventConfig.hostContact}`} className="hover:text-blush-400 transition">
          {eventConfig.hostContact}
        </a>
        <a href={eventConfig.mapUrl} target="_blank" rel="noreferrer" className="hover:text-blush-400 transition">
          {eventConfig.venueName}
        </a>
      </div>
    </footer>
  )
}
