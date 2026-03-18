import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast' // <-- Importamos nuestra nueva herramienta

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Validación con Toast de error
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    // 2. Disparamos el Toast de estado "Cargando" y guardamos su ID
    const loadingToastId = toast.loading("Registrando usuario...")

    try {
      await axios.post('http://localhost:8000/users/', {
        name: name,
        email: email,
        password: password
      })

      // 3. Si hay éxito, el Toast de carga se transforma en Toast de éxito
      toast.success("¡Registro exitoso! Redirigiendo...", { id: loadingToastId })

      // Esperamos 1.5 segundos para que leas el mensaje antes de cambiar de pantalla
      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (error: any) {
      console.error("Error al registrar:", error)
      // 4. Si hay error, el Toast de carga se transforma en Toast de error
      toast.error("Error: Posible correo duplicado", { id: loadingToastId })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl p-10 border border-slate-800 relative overflow-hidden">
        
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-lime-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <h2 className="text-4xl font-black text-white text-center mb-2 tracking-tighter italic">
          VORTEX
        </h2>
        <p className="text-slate-500 text-center mb-10 text-xs uppercase tracking-widest font-bold">
          Registro
        </p>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Nombre de Operador</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-lime-500 outline-none transition-all"
              placeholder="Ej: Matias"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-lime-500 outline-none transition-all"
              placeholder="nuevo@vortex.com"
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

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Confirmar Contraseña</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-lime-500 outline-none transition-all border-l-4 border-l-lime-500/50"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 px-4 bg-slate-800 border border-lime-500/50 hover:bg-lime-500 hover:text-slate-950 text-lime-400 font-black rounded-lg transition-all active:scale-95 mt-4 uppercase tracking-widest"
          >
            registrarse
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          ¿Ya tienes una cuenta? <br className="sm:hidden" />
          <span 
            onClick={() => navigate('/login')} 
            className="text-lime-500 hover:text-lime-400 cursor-pointer transition-colors font-bold underline decoration-lime-500/30 underline-offset-4 ml-1"
          >
            Accede aquí
          </span>
        </p>
      </div>
    </div>
  )
}