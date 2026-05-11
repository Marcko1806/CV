import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { DUAS } from '../mock/duas'
import { USERS } from '../mock/users'
import { Button } from '../components/ui/Button'
import { ROLES } from '../utils/constants'

export function CreateTaskPage() {
  const { createTask, tasks } = useTasks()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const gestores = USERS.filter((u) => u.role === ROLES.GESTOR)

  const [duaId, setDuaId] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('media')
  const [assignedGestorId, setAssignedGestorId] = useState(gestores[0]?.id ?? '')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const selectedDua = DUAS.find((d) => d.id === duaId)

  function gestorTaskCount(gestorId) {
    return tasks.filter((t) => t.assignedGestorId === gestorId && t.status !== 'completado').length
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!duaId) { setError('Seleccioná un DUA.'); return }
    if (!description.trim()) { setError('La descripción es obligatoria.'); return }
    if (!assignedGestorId) { setError('Seleccioná un gestor.'); return }
    const newId = createTask({
      duaId,
      duaNumber: selectedDua.number,
      client: selectedDua.client,
      description: description.trim(),
      priority,
      assignedGestorId,
      createdByDespId: currentUser.id,
      notes: notes.trim(),
    })
    navigate(`/tasks/${newId}`)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <Link to="/tasks" className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a tareas
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* DUA selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">1. Seleccioná el DUA</p>
          <select
            value={duaId}
            onChange={(e) => setDuaId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
          >
            <option value="">-- Seleccioná un DUA --</option>
            {DUAS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.number} — {d.client}
              </option>
            ))}
          </select>
          {selectedDua && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
              <div><span className="font-medium">Cliente:</span> {selectedDua.client}</div>
              <div><span className="font-medium">Tipo:</span> {selectedDua.tipoDespacho}</div>
              <div><span className="font-medium">Mercadería:</span> {selectedDua.mercaderia}</div>
              <div><span className="font-medium">Origen:</span> {selectedDua.origen}</div>
            </div>
          )}
        </div>

        {/* Description + priority */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">2. Detalles de la tarea</p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describí qué hay que gestionar..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Prioridad</label>
            <div className="flex gap-3">
              {[['alta', 'Alta', 'border-red-400 bg-red-50 text-red-700'], ['media', 'Media', 'border-orange-400 bg-orange-50 text-orange-700'], ['baja', 'Baja', 'border-slate-300 bg-slate-50 text-slate-600']].map(([val, label, activeClass]) => (
                <label key={val} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 cursor-pointer text-sm font-medium transition-colors ${priority === val ? activeClass : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                  <input type="radio" name="priority" value={val} checked={priority === val} onChange={() => setPriority(val)} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Gestor selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">3. Asignà un gestor</p>
          <div className="space-y-2">
            {gestores.map((g) => (
              <label
                key={g.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${assignedGestorId === g.id ? 'border-navy-700 bg-navy-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <input type="radio" name="gestor" value={g.id} checked={assignedGestorId === g.id} onChange={() => setAssignedGestorId(g.id)} className="sr-only" />
                <div className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {g.initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{g.name}</p>
                  <p className="text-xs text-slate-400">{gestorTaskCount(g.id)} tarea{gestorTaskCount(g.id) !== 1 ? 's' : ''} activa{gestorTaskCount(g.id) !== 1 ? 's' : ''}</p>
                </div>
                {assignedGestorId === g.id && (
                  <svg className="w-5 h-5 text-navy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">4. Notas adicionales (opcional)</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Información adicional para el gestor..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit">Crear Tarea</Button>
          <Link to="/tasks"><Button type="button" variant="secondary">Cancelar</Button></Link>
        </div>
      </form>
    </div>
  )
}
