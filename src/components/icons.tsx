interface IconProps {
  className?: string
}

export function CloudIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 30a11 11 0 0 1-1-21.9A14 14 0 0 1 44 10a10 10 0 0 1 2 19.8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M18 30h28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 3l4.6 10.2L35 15l-8 7.6L29.2 34 20 28.4 10.8 34 13 22.6 5 15l10.4-1.8L20 3z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </svg>
  )
}

export function BootieIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 6c6 0 10 4 10 9v6c0 2 2 3 4 3h9c3 0 5 2 5 5s-2 6-7 6H16c-6 0-10-4-10-10V12c0-4 3-6 8-6z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M10 20h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 33S3 22.7 3 12.3C3 6.6 7.6 3 12.4 3 16 3 19 5 20 8c1-3 4-5 7.6-5C32.4 3 37 6.6 37 12.3 37 22.7 20 33 20 33z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </svg>
  )
}

export function BalloonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 3c7 0 12 5.5 12 12.5S22 30 16 30 4 22.5 4 15.5 9 3 16 3z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M16 30v3M13 45l3-12 3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export const giftIconMap = {
  star: StarIcon,
  cloud: CloudIcon,
  bootie: BootieIcon,
  heart: HeartIcon,
  balloon: BalloonIcon,
}
