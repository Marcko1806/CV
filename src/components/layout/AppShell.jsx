import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tareas',
  '/duas': 'DUAs',
  '/tasks/new': 'Nueva Tarea',
}

function getTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/tasks/')) return 'Detalle de Tarea'
  return 'AdGest UY'
}

export function AppShell() {
  const location = useLocation()
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={getTitle(location.pathname)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
