import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const ok = login(email, password)
    if (ok) {
      navigate('/dashboard')
    } else {
      setError('Credenciales incorrectas. Verificá el email y la contraseña.')
    }
  }

  function quickLogin(role) {
    if (role === 'despachante') {
      setEmail('carlos@adgest.uy')
      setPassword('desp123')
    } else {
      setEmail('luis@adgest.uy')
      setPassword('gest123')
    }
    setError('')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-700 mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy-700">AdGest UY</h1>
          <p className="text-slate-500 text-sm mt-1">Sistema de Gestión de Despachos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Quick login */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Acceso rápido (demo)</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => quickLogin('despachante')}
              className="py-2 px-3 rounded-lg border-2 border-navy-700 text-navy-700 text-sm font-medium hover:bg-navy-50 transition-colors"
            >
              Despachante
            </button>
            <button
              type="button"
              onClick={() => quickLogin('gestor')}
              className="py-2 px-3 rounded-lg border-2 border-amber-500 text-amber-600 text-sm font-medium hover:bg-amber-50 transition-colors"
            >
              Gestor
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">o ingresá con tus datos</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                placeholder="tu@email.uy"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-navy-700 text-white rounded-lg font-medium text-sm hover:bg-navy-800 transition-colors"
            >
              Ingresar
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-4">
            Demo: despachante / gestor — contraseña: desp123 / gest123
          </p>
        </div>
      </div>
    </div>
  )
}
