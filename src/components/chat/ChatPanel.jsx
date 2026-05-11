import { useEffect, useRef } from 'react'
import { useChat } from '../../hooks/useChat'
import { useAuth } from '../../hooks/useAuth'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'

export function ChatPanel({ taskId }) {
  const { getMessagesForTask, sendMessage } = useChat()
  const { currentUser } = useAuth()
  const bottomRef = useRef(null)

  const messages = getMessagesForTask(taskId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(text) {
    sendMessage(taskId, text, currentUser)
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      <div className="px-4 py-3 border-b border-slate-200 shrink-0">
        <p className="text-sm font-semibold text-slate-700">Chat de la tarea</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-400 mt-8">Sin mensajes aún. Iniciá la conversación.</p>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}
        <div ref={bottomRef} />
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  )
}
