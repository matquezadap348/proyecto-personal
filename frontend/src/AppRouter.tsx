import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // <-- 1. Importamos el Toaster
import App from './App' 
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'

export function AppRouter() {
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <BrowserRouter>
      {/* 2. Colocamos el Toaster arriba de las rutas con el estilo VORTEX */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'font-sans font-bold text-sm tracking-wide',
          style: {
            background: '#020617', // bg-slate-950
            color: '#f8fafc',      // text-slate-50
            border: '1px solid #1e293b', // border-slate-800
          },
          success: {
            iconTheme: { primary: '#84cc16', secondary: '#020617' }, // lime-500
            style: { 
              border: '1px solid #84cc16', 
              boxShadow: '0 0 15px rgba(132, 204, 22, 0.1)' 
            }
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#020617' }, // red-500
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
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/proyectos" 
          element={isAuthenticated ? <div className="text-slate-400 p-10 min-h-screen bg-slate-950 font-bold">Módulo de Proyectos (Próximamente)</div> : <Navigate to="/login" />} 
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}