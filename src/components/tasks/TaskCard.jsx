import { Link } from 'react-router-dom'
import { TaskStatusBadge } from './TaskStatusBadge'
import { Badge } from '../ui/Badge'
import { USERS } from '../../mock/users'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../utils/constants'
import { timeAgo } from '../../utils/formatters'

const borderColors = {
  pendiente: 'border-l-yellow-400',
  en_proceso: 'border-l-blue-500',
  completado: 'border-l-green-500',
}

export function TaskCard({ task }) {
  const gestor = USERS.find((u) => u.id === task.assignedGestorId)

  return (
    <Link
      to={`/tasks/${task.id}`}
      className={`block bg-white rounded-xl border border-slate-200 border-l-4 ${borderColors[task.status]} p-4 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-mono text-xs text-slate-500">{task.duaNumber}</span>
        <TaskStatusBadge status={task.status} />
      </div>
      <p className="font-semibold text-slate-800 text-sm mb-1 line-clamp-1">{task.client}</p>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge color={PRIORITY_COLORS[task.priority]}>
            {PRIORITY_LABELS[task.priority]}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>{gestor?.initials ?? '??'}</span>
          <span>·</span>
          <span>{timeAgo(task.updatedAt)}</span>
        </div>
      </div>
    </Link>
  )
}
