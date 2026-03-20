import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom' 
import { 
  DndContext, 
  PointerSensor, 
  useSensor, 
  useSensors,
  closestCorners
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import toast from 'react-hot-toast'
import DroppableColumn from '../components/DroppableColumn' 
import Sidebar from '../components/Sidebar'
import ConfirmModal from '../components/ConfirmModal'
import type { Task } from '../components/TaskCard'

export default function Dashboard() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId') 
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [projectName, setProjectName] = useState('Cargando...')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  
  const navigate = useNavigate()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      setIsInitialLoading(false)
      return
    }

    if (!projectId) {
      navigate('/proyectos', { replace: true })
      return
    }

    try {
      const projectRes = await axios.get(`http://localhost:8000/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjectName(projectRes.data.title)

      const tasksRes = await axios.get(`http://localhost:8000/tasks/?project_id=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setTasks(tasksRes.data.map((t: any) => ({
        ...t,
        status: t.completed ? 'done' : 'todo'
      })))
    } catch (error) {
      if (!isInitialLoading) {
        toast.error("Error al sincronizar con Vortex")
      }
    } finally {
      setIsInitialLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [projectId])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    const toastId = toast.loading('Desplegando tarea...')
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8000/tasks/', 
        { ...newTask, project_id: parseInt(projectId!) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIsModalOpen(false)
      setNewTask({ title: '', description: '' })
      fetchData()
      toast.success('Tarea asignada', { id: toastId })
    } catch (error) {
      toast.error('Fallo en la asignación', { id: toastId })
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = parseInt(active.id as string)
    const newStatus = over.id as 'todo' | 'done'
    
    const currentTask = tasks.find(t => t.id === taskId)
    if (!currentTask || currentTask.status === newStatus) return

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))

    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:8000/tasks/${taskId}/`, 
        { completed: newStatus === 'done' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (newStatus === 'done' && currentTask.status === 'todo') {
        toast.success('¡Tarea completada!')
      }
    } catch (error) {
      toast.error("Error de persistencia")
      fetchData()
    }
  }

  const confirmDeleteTask = (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation()
    setTaskToDelete(taskId)
  }

  const handleDeleteTask = async () => {
    if (!taskToDelete) return
    const taskId = taskToDelete
    setTaskToDelete(null)
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8000/tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
    } catch (error) {
      toast.error('Error al eliminar la tarea')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      <Sidebar />
      
      <main className="flex-1 p-10 flex flex-col h-screen overflow-hidden">
        <header className="flex justify-between items-center mb-12 shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Proyecto: <span className="text-lime-500">{projectName}</span>
            </h2>
            <p className="text-slate-500 text-sm italic">ID de Operación: #{projectId}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/proyectos')} className="text-slate-400 hover:text-white font-bold text-sm px-4">Volver</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-lime-500 hover:bg-lime-400 text-slate-950 px-6 py-2.5 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)]">
                + Nueva Tarea
            </button>
          </div>
        </header>

        <div className="flex gap-6 flex-1 overflow-hidden pb-4">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <DroppableColumn status="todo" label="Pendientes" tasks={tasks.filter(t => t.status === 'todo')} handleDelete={confirmDeleteTask} />
            <DroppableColumn status="done" label="Finalizadas" tasks={tasks.filter(t => t.status === 'done')} handleDelete={confirmDeleteTask} />
          </DndContext>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 underline decoration-lime-500 underline-offset-8">Nueva Tarea</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-left">
              <input 
                required 
                type="text" 
                value={newTask.title} 
                onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-lime-500 outline-none" 
                placeholder="Título de la tarea..." 
              />
              <textarea 
                value={newTask.description} 
                onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-lime-500 outline-none h-24" 
                placeholder="Descripción detallada..."
              ></textarea>
              
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 text-slate-500 font-bold hover:text-slate-300">Cancelar</button>
                <button type="submit" className="flex-1 bg-lime-500 text-slate-950 px-4 py-2 rounded-lg font-black hover:bg-lime-400 transition-colors">Asignar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={taskToDelete !== null}
        title="¿Eliminar Tarea?"
        message="Esta acción no se puede deshacer. La tarea será purgada permanentemente del sistema."
        onConfirm={handleDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  )
}