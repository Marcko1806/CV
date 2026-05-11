import { TASK_STATUSES, STATUS_LABELS } from '../../utils/constants'

const STEPS = [
  TASK_STATUSES.PENDIENTE,
  TASK_STATUSES.EN_PROCESO,
  TASK_STATUSES.COMPLETADO,
]

export function StatusTimeline({ currentStatus }) {
  const currentIdx = STEPS.indexOf(currentStatus)
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx
        const active = idx === currentIdx
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                done ? 'bg-green-500 border-green-500 text-white'
                  : active ? 'bg-navy-700 border-navy-700 text-white'
                  : 'bg-white border-slate-300 text-slate-400'
              }`}>
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? 'text-navy-700' : done ? 'text-green-600' : 'text-slate-400'}`}>
                {STATUS_LABELS[step]}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mb-4 ${done || active ? 'bg-navy-700' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
