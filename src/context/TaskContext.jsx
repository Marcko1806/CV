import { createContext, useState } from 'react'
import { TASKS } from '../mock/tasks'

export const TaskContext = createContext(null)

let nextId = TASKS.length + 1

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(TASKS)

  function createTask(data) {
    const id = `t${nextId++}`
    const now = new Date().toISOString()
    const newTask = {
      id,
      ...data,
      status: 'pendiente',
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: 'pendiente', changedAt: now, changedBy: data.createdByDespId }],
    }
    setTasks((prev) => [newTask, ...prev])
    return id
  }

  function updateTaskStatus(taskId, newStatus, changedBy) {
    const now = new Date().toISOString()
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              updatedAt: now,
              statusHistory: [...t.statusHistory, { status: newStatus, changedAt: now, changedBy }],
            }
          : t
      )
    )
  }

  function updateTaskGestor(taskId, gestorId) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignedGestorId: gestorId, updatedAt: new Date().toISOString() } : t))
    )
  }

  function getTaskById(taskId) {
    return tasks.find((t) => t.id === taskId)
  }

  function getTasksForGestor(gestorId) {
    return tasks.filter((t) => t.assignedGestorId === gestorId)
  }

  return (
    <TaskContext.Provider value={{ tasks, createTask, updateTaskStatus, updateTaskGestor, getTaskById, getTasksForGestor }}>
      {children}
    </TaskContext.Provider>
  )
}
