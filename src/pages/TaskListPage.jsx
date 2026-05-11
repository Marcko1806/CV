import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { TaskCard } from '../components/tasks/TaskCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { ROLES } from '../utils/constants'

export function TaskListPage() {
  const { tasks, getTasksForGestor } = useTasks()
  const { currentUser } = useAuth()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const isDespachante = currentUser?.role === ROLES.DESPACHANTE
  const baseTasks = isDespachante ? tasks : getTasksForGestor(currentUser?.id)

  const filtered = baseTasks.filter((t) => {
    const matchSearch =
      !search ||
      t.duaNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.client.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-slate-500 text-sm">
            {isDespachante ? 'Todas las tareas' : 'Mis tareas asignadas'}
          </p>
        </div>
        {isDespachante && (
          <Link to="/tasks/new">
            <Button size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Tarea
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Buscar por DUA o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
        >
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="completado">Completado</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
        >
          <option value="all">Todas las prioridades</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        {(search || statusFilter !== 'all' || priorityFilter !== 'all') && (
          <button
            onClick={() => { setSearch(''); setStatusFilter('all'); setPriorityFilter('all') }}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            Limpiar
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No hay tareas"
          description={search || statusFilter !== 'all' ? 'Probá con otros filtros.' : 'No hay tareas asignadas aún.'}
          action={isDespachante ? <Link to="/tasks/new"><Button size="sm">Nueva Tarea</Button></Link> : null}
        />
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">{filtered.length} tarea{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((t) => <TaskCard key={t.id} task={t} />)}
          </div>
        </>
      )}
    </div>
  )
}
