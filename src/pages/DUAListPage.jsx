import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DUAS } from '../mock/duas'
import { Badge } from '../components/ui/Badge'
import { formatDate } from '../utils/formatters'

export function DUAListPage() {
  const [search, setSearch] = useState('')

  const filtered = DUAS.filter(
    (d) =>
      !search ||
      d.number.toLowerCase().includes(search.toLowerCase()) ||
      d.client.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-500 text-sm">DUAs recibidos de clientes</p>
        <input
          type="text"
          placeholder="Buscar por número o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 w-64"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">N° DUA</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Mercadería</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Recibido</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((dua) => (
              <tr key={dua.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{dua.number}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{dua.client}</p>
                  <p className="text-xs text-slate-400">{dua.clientRUT}</p>
                </td>
                <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{dua.tipoDespacho}</td>
                <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{dua.mercaderia}</td>
                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{formatDate(dua.dateReceived)}</td>
                <td className="px-4 py-3">
                  {dua.hasTask ? (
                    <Badge color="green">Con tarea</Badge>
                  ) : (
                    <Badge color="yellow">Sin tarea</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {!dua.hasTask && (
                    <Link
                      to={`/tasks/new?duaId=${dua.id}`}
                      className="text-xs text-navy-700 font-medium hover:underline"
                    >
                      Crear tarea
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">No se encontraron DUAs.</p>
        )}
      </div>
    </div>
  )
}
