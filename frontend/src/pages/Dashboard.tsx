import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Mantenemos la interfaz interna para el diseño Kanban
interface Task {
  id: number
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [userName, setUserName] = useState('Usuario')
  
  // Quitamos 'priority' del formulario porque tu DB no lo soporta (por ahora)
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  
  const navigate = useNavigate()

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    try {
      const userRes = await axios.get('http://localhost:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserName(userRes.data.email.split('@')[0])
      
      const tasksRes = await axios.get('http://localhost:8000/tasks/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // PATRÓN ADAPTER: Traducimos el idioma del backend al idioma del frontend
      const mappedTasks: Task[] = tasksRes.data.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.completed ? 'done' : 'todo', // Si completed es true, va a Terminado
        priority: 'medium' // Hardcodeado para mantener tu diseño bonito
      }))
      
      setTasks(mappedTasks)
    } catch (error) {
      console.error("Error cargando datos", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      // Enviamos SOLO lo que el backend de Python entiende (title y description)
      await axios.post('http://localhost:8000/tasks/', 
        { 
          title: newTask.title, 
          description: newTask.description
          // completed: false se suele poner por defecto en FastAPI
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIsModalOpen(false)
      setNewTask({ title: '', description: '' })
      fetchData()
    } catch (error) {
      console.error(error)
      alert("Error al guardar la tarea. Revisa la consola.")
    }
  }

  const handleMoveTask = async (taskId: number, currentStatus: Task['status']) => {
    // Como tu backend solo tiene "completado" o "no completado", 
    // saltaremos directo de Pendiente a Terminado para no romper la lógica de DB.
    const isNowCompleted = currentStatus === 'todo' ? true : false
    
    try {
      const token = localStorage.getItem('token')
      
      // Enviamos el dato en el formato que FastAPI espera
      // (Asumiendo que tu endpoint PUT actualiza la tarea completa)
      const taskToUpdate = tasks.find(t => t.id === taskId)
      if (!taskToUpdate) return

      await axios.put(`http://localhost:8000/tasks/${taskId}/`, 
        { 
          title: taskToUpdate.title, 
          description: taskToUpdate.description,
          completed: isNowCompleted 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchData()
    } catch (error) {
      console.error("Error al mover la tarea", error)
    }
  }

  const handleDeleteTask = async (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation()
    if (!window.confirm("¿Eliminar esta tarea de Vortex?")) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8000/tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
    } catch (error) {
      alert("No se pudo eliminar")
    }
  }

  const renderColumn = (status: Task['status'], label: string) => {
    const filteredTasks = tasks.filter(t => t.status === status)

    return (
      <div className="flex-1 min-w-[320px] bg-slate-900/40 rounded-2xl p-5 border border-slate-800/50 flex flex-col">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">{label}</h3>
          <span className="text-lime-400 text-xs font-bold border border-lime-500/20 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.2)]">
            {filteredTasks.length}
          </span>
        </div>
        
        {/* Si la columna está vacía, mostramos un pequeño mensaje fantasma */}
        {filteredTasks.length === 0 && (
          <div className="flex-1 border-2 border-dashed border-slate-800/50 rounded-xl flex items-center justify-center">
            <span className="text-slate-600 text-sm font-medium">Vacío</span>
          </div>
        )}

        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => handleMoveTask(task.id, task.status)}
              className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-lime-500/40 transition-all cursor-pointer group relative"
            >
              <button onClick={(e) => handleDeleteTask(e, task.id)} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                🗑️
              </button>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase mb-3 inline-block bg-lime-500/10 text-lime-500`}>
                {task.priority === 'medium' ? 'Normal' : task.priority}
              </span>
              <h4 className="text-white font-semibold mb-1 group-hover:text-lime-400 transition-colors">{task.title}</h4>
              <p className="text-slate-500 text-sm line-clamp-2">{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      <aside className="w-64 border-r border-slate-900 p-8 flex flex-col justify-between hidden md:flex">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter mb-12 italic">VORTEX</h1>
          <nav className="space-y-4">
            <button className="w-full text-left px-4 py-2 rounded-lg bg-lime-500/10 text-lime-400 font-bold border border-lime-500/20 shadow-[0_0_15px_rgba(163,230,53,0.1)]">Tablero</button>
            <button 
              onClick={() => navigate('/proyectos')}
              className="w-full text-left px-4 py-2 rounded-lg text-slate-500 hover:text-lime-400 hover:bg-lime-500/5 transition-all group flex items-center gap-2"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              Proyectos
            </button>
          </nav>
        </div>
        <div className="space-y-4">
          <div className="px-4 py-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <p className="text-[10px] text-lime-500 uppercase font-black mb-1 tracking-widest text-center">Operator</p>
            <p className="text-white font-bold truncate text-sm text-center">{userName}</p>
          </div>
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="w-full text-xs font-bold text-slate-600 hover:text-red-500 transition-colors uppercase tracking-widest">
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 flex flex-col h-screen">
        <header className="flex justify-between items-center mb-12 shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Workspace de <span className="text-lime-500 capitalize">{userName}</span></h2>
            <p className="text-slate-500 text-sm italic">Gestión de flujo activo</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-lime-500 hover:bg-lime-400 text-slate-950 px-6 py-2.5 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)]">
            + Nueva Tarea
          </button>
        </header>

        <div className="flex gap-6 flex-1 overflow-hidden pb-4">
          {renderColumn('todo', 'Pendiente')}
          {/* Ocultamos temporalmente la columna "En Curso" ya que tu DB solo maneja completado/no completado */}
          {renderColumn('done', 'Terminado')}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 underline decoration-lime-500 underline-offset-8">Nueva Tarea</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-left">
              <input required type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-lime-500 outline-none" placeholder="Título..." />
              <textarea value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-lime-500 outline-none h-24" placeholder="Descripción..."></textarea>
              
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 text-slate-500 font-bold hover:text-slate-300">Cancelar</button>
                <button type="submit" className="flex-1 bg-lime-500 text-slate-950 px-4 py-2 rounded-lg font-black hover:bg-lime-400 transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}