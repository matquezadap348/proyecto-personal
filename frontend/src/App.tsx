import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const toastId = toast.loading('Verificando credenciales...')

    try {
      const formData = new FormData()
      formData.append('username', email) 
      formData.append('password', password)

      const response = await axios.post('http://localhost:8000/login', formData)

      // Guardamos el token de acceso en el almacenamiento local
      localStorage.setItem('token', response.data.access_token)

      toast.success('Acceso autorizado. Iniciando VORTEX...', { id: toastId })

      // Redirigimos forzando la recarga para que AppRouter actualice el estado de autenticación
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1000)

    } catch (error: any) {
      console.error("Error al conectar:", error)
      toast.error('Error: Credenciales incorrectas o acceso denegado', { id: toastId })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl p-10 border border-slate-800 relative overflow-hidden">
        
        {/* Efecto de luz de fondo sutil */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <h2 className="text-4xl font-black text-white text-center mb-2 tracking-tighter italic">
          VORTEX
        </h2>
        <p className="text-slate-500 text-center mb-10 text-xs uppercase tracking-widest font-bold">
          Autenticación de Operador
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-lime-500 outline-none transition-all"
              placeholder="operador@vortex.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-lime-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 px-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black rounded-lg transition-all shadow-[0_0_20px_rgba(132,204,22,0.2)] active:scale-95 mt-4"
          >
            ACCEDER
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          ¿No tienes una cuenta? <br className="sm:hidden" />
          <span 
            onClick={() => navigate('/register')} 
            className="text-lime-500 hover:text-lime-400 cursor-pointer transition-colors font-bold underline decoration-lime-500/30 underline-offset-4 ml-1"
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  )
}

export default App