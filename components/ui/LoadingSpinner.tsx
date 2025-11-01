'use client'

type LoadingSpinnerProps = {
  text?: string
  size?: number // facultatif, pour changer la taille
  color?: string // facultatif, pour adapter la couleur
  className?: string
}

export default function LoadingSpinner({
  text = 'Chargement...',
  size = 16,
  color = 'text-black',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg
        className={`animate-spin ${color}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        style={{ width: size, height: size }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span>{text}</span>
    </span>
  )
}
