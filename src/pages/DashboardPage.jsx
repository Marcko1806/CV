import { Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { DUAS } from '../mock/duas'
import { USERS } from '../mock/users'
import { TaskCard } from '../components/tasks/TaskCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ROLES, TASK_STATUSES } from '../utils/constants'
import { formatDate } from '../utils/formatters'

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  }
  return (
    <div className={`rounded-xl border p-4 ${colors[color] ?? colors.slate}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm font-medium mt-1">{label}</p>
    </div>
  )
}

export function DashboardPage() {
  const { tasks, getTasksForGestor } = useTasks()
  const { currentUser } = useAuth()
  const isDespachante = currentUser?.role === ROLES.DESPACHANTE

  const myTasks = isDespachante ? tasks : getTasksForGestor(currentUser?.id)
  const total = myTasks.length
  const pendientes = myTasks.filter((t) => t.status === TASK_STATUSES.PENDIENTE).length
  const enProceso = myTasks.filter((t) => t.status === TASK_STATUSES.EN_PROCESO).length
  const completadas = myTasks.filter((t) => t.status === TASK_STATUSES.COMPLETADO).length

  const recentDuas = DUAS.slice(0, 4)

  const recentTasks = isDespachante
    ? [...tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3)
    : [...myTasks].filter((t) => t.status !== TASK_STATUSES.COMPLETADO).sort((a, b) => {
        const p = { alta: 0, media: 1, baja: 2 }
        return p[a.priority] - p[b.priority]
      }).slice(0, 4)

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-slate-500 text-sm">
          Bienvenido, <span className="font-semibold text-slate-700">{currentUser?.name}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total tareas" value={total} color="slate" />
        <StatCard label="Pendientes" value={pendientes} color="yellow" />
        <StatCard label="En proceso" value={enProceso} color="blue" />
        <StatCard label="Completadas" value={completadas} color="green" />
      </div>

      {isDespachante ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent DUAs */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-700 text-sm">DUAs recientes</p>
              <Link to="/duas" className="text-xs text-navy-700 hover:underline">Ver todos</Link>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400">N° DUA</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400">Cliente</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400 hidden sm:table-cell">Recibido</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentDuas.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{d.number}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{d.client}</td>
                    <td className="px-5 py-3 text-slate-400 hidden sm:table-cell">{formatDate(d.dateReceived)}</td>
                    <td className="px-5 py-3">
                      {d.hasTask ? <Badge color="green">Con tarea</Badge> : <Badge color="yellow">Sin tarea</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="font-semibold text-slate-700 text-sm mb-3">Acciones rápidas</p>
              <div className="space-y-2">
                <Link to="/tasks/new" className="block">
                  <Button className="w-full justify-center" size="sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Tarea
                  </Button>
                </Link>
                <Link to="/duas" className="block">
                  <Button variant="secondary" className="w-full justify-center" size="sm">
                    Ver DUAs
                  </Button>
                </Link>
                <Link to="/tasks" className="block">
                  <Button variant="ghost" className="w-full justify-center" size="sm">
                    Ver todas las tareas
                  </Button>
                </Link>
              </div>
            </div>

            {/* Gestores */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="font-semibold text-slate-700 text-sm mb-3">Gestores</p>
              <div className="space-y-2">
                {USERS.filter((u) => u.role === ROLES.GESTOR).map((g) => {
                  const active = tasks.filter((t) => t.assignedGestorId === g.id && t.status !== TASK_STATUSES.COMPLETADO).length
                  return (
                    <div key={g.id} className="flex items-center gap-2 text-sm">
                      <div className="w-7 h-7 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {g.initials}
                      </div>
                      <span className="flex-1 text-slate-700">{g.name}</span>
                      <Badge color={active > 2 ? 'red' : active > 0 ? 'blue' : 'green'}>{active} activa{active !== 1 ? 's' : ''}</Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Gestor view */
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-700 text-sm">Mis tareas activas</p>
            <Link to="/tasks" className="text-xs text-navy-700 hover:underline">Ver todas</Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="text-slate-400 text-sm">No tenés tareas asignadas activas.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {recentTasks.map((t) => <TaskCard key={t.id} task={t} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
