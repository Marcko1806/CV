import { useAuth } from '../../hooks/useAuth'
import { Avatar } from '../ui/Avatar'

export function TopBar({ title }) {
  const { currentUser } = useAuth()
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-base font-semibold text-slate-800">{title}</h1>
      <div className="flex items-center gap-2">
        <Avatar initials={currentUser?.initials} name={currentUser?.name} size="sm" />
        <span className="text-sm text-slate-600 hidden sm:block">{currentUser?.name}</span>
      </div>
    </header>
  )
}
