import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userName, setUserName] = useState('Usuario')
  
  const isDashboard = location.pathname === '/dashboard'
  const isProjects = location.pathname === '/proyectos' || location.pathname === '/projects'
  const lastProjectId = localStorage.getItem('lastProjectId')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const res = await axios.get(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserName(res.data.email.split('@')[0])
      } catch (error) {
      }
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('lastProjectId')
    window.location.href = '/login'
  }

  const handleTableroClick = () => {
    if (lastProjectId) {
      navigate(`/dashboard?projectId=${lastProjectId}`)
    }
  }

  return (
    <aside className="w-64 border-r border-slate-900 p-8 flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tighter mb-12 italic">VORTEX</h1>
        <nav className="space-y-4">
          <button 
            onClick={() => navigate('/proyectos')}
            className={`w-full text-left px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${isProjects ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20 shadow-[0_0_15px_rgba(163,230,53,0.1)]' : 'text-slate-500 hover:text-lime-400 hover:bg-lime-500/5'}`}
          >
            Proyectos
          </button>
          
          <button 
            onClick={handleTableroClick}
            disabled={!lastProjectId}
            className={`w-full text-left px-4 py-2 rounded-lg font-bold transition-all group flex items-center gap-2 ${
              isDashboard ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20 shadow-[0_0_15px_rgba(163,230,53,0.1)]' 
              : lastProjectId ? 'text-slate-500 hover:text-lime-400 hover:bg-lime-500/5 cursor-pointer' 
              : 'hidden'
            }`}
          >
            Tablero
            {!isDashboard && lastProjectId && <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-xs">→</span>}
          </button>
        </nav>
      </div>
      <div className="space-y-4">
        <div className="px-4 py-3 bg-slate-900/50 rounded-xl border border-slate-800">
          <p className="text-[10px] text-lime-500 uppercase font-black mb-1 tracking-widest text-center">Operator</p>
          <p className="text-white font-bold truncate text-sm text-center">{userName}</p>
        </div>
        <button onClick={handleLogout} className="w-full text-xs font-bold text-slate-600 hover:text-red-500 transition-colors uppercase tracking-widest">
          Log Out
        </button>
      </div>
    </aside>
  )
}
