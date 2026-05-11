import { createContext, useState } from 'react'
import { MESSAGES } from '../mock/messages'

export const ChatContext = createContext(null)

let nextMsgId = MESSAGES.length + 1

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(MESSAGES)

  function sendMessage(taskId, text, sender) {
    const msg = {
      id: `m${nextMsgId++}`,
      taskId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      text,
      sentAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, msg])
  }

  function getMessagesForTask(taskId) {
    return messages.filter((m) => m.taskId === taskId)
  }

  return (
    <ChatContext.Provider value={{ sendMessage, getMessagesForTask }}>
      {children}
    </ChatContext.Provider>
  )
}
