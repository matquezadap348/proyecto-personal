import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App' 
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Projects from './pages/Projects'
import ProtectedRoute from './components/ProtectedRoute'

export function AppRouter() {
  return (

    <BrowserRouter>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'font-sans font-bold text-sm tracking-wide',
          style: {
            background: '#020617',
            color: '#f8fafc',
            border: '1px solid #1e293b',
          },
          success: {
            iconTheme: { primary: '#84cc16', secondary: '#020617' },
            style: { 
              border: '1px solid #84cc16', 
              boxShadow: '0 0 15px rgba(132, 204, 22, 0.1)' 
            }
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#020617' },
            style: { 
              border: '1px solid #ef4444',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.1)' 
            }
          }
        }}
      />

      <Routes>
        <Route path="/login" element={<App />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/proyectos" 
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
