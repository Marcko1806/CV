const colorMap = {
  yellow: 'bg-yellow-100 text-yellow-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  orange: 'bg-orange-100 text-orange-800',
  gray: 'bg-slate-100 text-slate-600',
  navy: 'bg-navy-100 text-navy-700',
  amber: 'bg-amber-100 text-amber-700',
}

export function Badge({ color = 'gray', children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[color] ?? colorMap.gray} ${className}`}>
      {children}
    </span>
  )
}
