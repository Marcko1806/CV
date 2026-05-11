import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-navy-700">404</p>
        <p className="mt-2 text-slate-500">Página no encontrada</p>
        <Link to="/dashboard" className="mt-6 inline-block text-sm text-navy-700 underline">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
