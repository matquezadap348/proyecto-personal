import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './AppRouter' 
import { Toaster } from 'react-hot-toast'
import axios from 'axios'

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('lastProjectId')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter /> 
    <Toaster 
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#0f172a',
          color: '#f1f5f9',
          border: '1px solid #1e293b',
        },
        success: {
          iconTheme: {
            primary: '#84cc16',
            secondary: '#0f172a',
          },
        },
      }}
    />
  </StrictMode>,
)