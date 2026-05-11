const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-teal-500',
]

export function Avatar({ initials, name = '', size = 'md' }) {
  const colorIdx = name.charCodeAt(0) % colors.length
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm'
  return (
    <div className={`${sizeClass} ${colors[colorIdx]} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}>
      {initials}
    </div>
  )
}
