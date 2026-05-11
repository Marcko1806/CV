import { useAuth } from '../../hooks/useAuth'
import { formatDateTime } from '../../utils/formatters'

export function MessageBubble({ message }) {
  const { currentUser } = useAuth()
  const isOwn = message.senderId === currentUser?.id

  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-3`}>
      {!isOwn && (
        <span className="text-xs text-slate-400 mb-1 ml-1">
          {message.senderName} · <span className="capitalize">{message.senderRole}</span>
        </span>
      )}
      <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${isOwn ? 'bg-navy-700 text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'}`}>
        {message.text}
      </div>
      <span className="text-xs text-slate-400 mt-1 mx-1">{formatDateTime(message.sentAt)}</span>
    </div>
  )
}
