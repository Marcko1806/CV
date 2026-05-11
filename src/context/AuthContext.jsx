import { createContext, useState } from 'react'
import { USERS } from '../mock/users'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  function login(email, password) {
    const user = USERS.find(
      (u) => u.email === email.trim() && u.password === password
    )
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  function logout() {
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
