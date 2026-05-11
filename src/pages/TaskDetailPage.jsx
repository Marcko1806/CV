import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { ChatPanel } from '../components/chat/ChatPanel'
import { StatusTimeline } from '../components/tasks/StatusTimeline'
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { USERS } from '../mock/users'
import { ROLES, TASK_STATUSES, PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS } from '../utils/constants'
import { formatDate, formatDateTime } from '../utils/formatters'

export function TaskDetailPage() {
  const { taskId } = useParams()
  const { getTaskById, updateTaskStatus, updateTaskGestor } = useTasks()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const task = getTaskById(taskId)
  if (!task) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Tarea no encontrada.</p>
        <Link to="/tasks" className="text-navy-700 text-sm underline mt-2 inline-block">Volver a tareas</Link>
      </div>
    )
  }

  const isDespachante = currentUser?.role === ROLES.DESPACHANTE
  const gestor = USERS.find((u) => u.id === task.assignedGestorId)
  const creator = USERS.find((u) => u.id === task.createdByDespId)
  const gestores = USERS.filter((u) => u.role === ROLES.GESTOR)

  function advanceStatus() {
    const next = {
      pendiente: TASK_STATUSES.EN_PROCESO,
      en_proceso: TASK_STATUSES.COMPLETADO,
    }[task.status]
    if (next) updateTaskStatus(task.id, next, currentUser.id)
  }

  function regressStatus() {
    const prev = {
      en_proceso: TASK_STATUSES.PENDIENTE,
      completado: TASK_STATUSES.EN_PROCESO,
    }[task.status]
    if (prev) updateTaskStatus(task.id, prev, currentUser.id)
  }

  const canAdvance = isDespachante
    ? task.status !== TASK_STATUSES.COMPLETADO
    : task.status === TASK_STATUSES.PENDIENTE || task.status === TASK_STATUSES.EN_PROCESO
  const canRegress = isDespachante && task.status !== TASK_STATUSES.PENDIENTE

  return (
    <div className="flex h-full">
      {/* Left column */}
      <div className="flex-1 min-w-0 overflow-y-auto p-6">
        <div className="mb-4">
          <Link to="/tasks" className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a tareas
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
            <div>
              <span className="font-mono text-xs text-slate-400">{task.duaNumber}</span>
              <h2 className="text-lg font-bold text-slate-800 mt-0.5">{task.client}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge color={PRIORITY_COLORS[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
              <TaskStatusBadge status={task.status} />
            </div>
          </div>
          <p className="text-sm text-slate-600">{task.description}</p>
          {task.notes && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-xs text-amber-700"><span className="font-semibold">Nota:</span> {task.notes}</p>
            </div>
          )}
        </div>

        {/* Status timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <p className="text-sm font-semibold text-slate-700 mb-4">Estado</p>
          <StatusTimeline currentStatus={task.status} />
          <div className="flex gap-2 mt-5 flex-wrap">
            {canAdvance && task.status !== TASK_STATUSES.COMPLETADO && (
              <Button onClick={advanceStatus} size="sm">
                Avanzar → {STATUS_LABELS[{ pendiente: 'en_proceso', en_proceso: 'completado' }[task.status]]}
              </Button>
            )}
            {canRegress && (
              <Button variant="secondary" size="sm" onClick={regressStatus}>
                Retroceder
              </Button>
            )}
            {task.status === TASK_STATUSES.COMPLETADO && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tarea completada
              </span>
            )}
          </div>
        </div>

        {/* Assignment info */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">Asignación</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 mb-1">Creado por</p>
              <p className="text-slate-700 font-medium">{creator?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Gestor asignado</p>
              {isDespachante ? (
                <select
                  value={task.assignedGestorId}
                  onChange={(e) => updateTaskGestor(task.id, e.target.value)}
                  className="text-sm border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-navy-500"
                >
                  {gestores.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              ) : (
                <p className="text-slate-700 font-medium">{gestor?.name ?? '—'}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Creado</p>
              <p className="text-slate-700">{formatDate(task.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Última actualización</p>
              <p className="text-slate-700">{formatDate(task.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Status history */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">Historial de cambios</p>
          <div className="space-y-2">
            {[...task.statusHistory].reverse().map((entry, idx) => {
              const user = USERS.find((u) => u.id === entry.changedBy)
              return (
                <div key={idx} className="flex items-center gap-3 text-xs text-slate-500">
                  <TaskStatusBadge status={entry.status} />
                  <span>{user?.name ?? '—'}</span>
                  <span className="text-slate-300">·</span>
                  <span>{formatDateTime(entry.changedAt)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right column: Chat */}
      <div className="w-80 xl:w-96 shrink-0 flex flex-col border-l border-slate-200 h-full">
        <ChatPanel taskId={task.id} />
      </div>
    </div>
  )
}
