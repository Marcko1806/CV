import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import { ChatProvider } from './context/ChatContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './routes/RoleRoute'
import { AppShell } from './components/layout/AppShell'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { TaskListPage } from './pages/TaskListPage'
import { TaskDetailPage } from './pages/TaskDetailPage'
import { CreateTaskPage } from './pages/CreateTaskPage'
import { DUAListPage } from './pages/DUAListPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <ChatProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TaskListPage />} />
                  <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
                  <Route element={<RoleRoute requiredRole="despachante" />}>
                    <Route path="/tasks/new" element={<CreateTaskPage />} />
                    <Route path="/duas" element={<DUAListPage />} />
                  </Route>
                </Route>
              </Route>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ChatProvider>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
