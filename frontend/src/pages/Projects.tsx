import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import ConfirmModal from '../components/ConfirmModal'

interface Project {
  id: number
  title: string
  description: string
  task_count: number
  completed_task_count: number
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({ title: '', description: '' })
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null)
  
  const navigate = useNavigate()

  const getProgress = (completed: number, total: number) => {
    if (total === 0) return 0
    return Math.round((completed / total) * 100)
  }


  const fetchData = async () => {
    const token = localStorage.getItem('token')
    try {
      const projectsRes = await axios.get('http://localhost:8000/projects/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setProjects(projectsRes.data)
    } catch (error) {
      toast.error("Error de conexión con el servidor")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    const toastId = toast.loading('Inicializando proyecto...')
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8000/projects/', 
        { title: newProject.title, description: newProject.description },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIsModalOpen(false)
      setNewProject({ title: '', description: '' })
      fetchData()
      toast.success('Proyecto creado', { id: toastId })
    } catch (error) {
      toast.error('Error al generar el proyecto', { id: toastId })
    }
  }

  const confirmDelete = (projectId: number) => {
    setProjectToDelete(projectId)
  }

  const handleDeleteProject = async () => {
    if (!projectToDelete) return
    const projectId = projectToDelete
    setProjectToDelete(null)
    
    const toastId = toast.loading('Eliminando base de datos...')
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8000/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
      toast.success('Proyecto purgado', { id: toastId })
    } catch (error) {
      toast.error('Acceso denegado', { id: toastId })
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      <Sidebar />

      <main className="flex-1 p-10 flex flex-col h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-12 shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Directorio de <span className="text-lime-500 capitalize">Proyectos</span></h2>
            <p className="text-slate-500 text-sm italic">Gestión de infraestructuras</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-lime-500 hover:bg-lime-400 text-slate-950 px-6 py-2.5 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)]">
            + Nuevo Proyecto
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-slate-800/50 rounded-2xl py-20 flex flex-col items-center justify-center">
              <span className="text-4xl mb-4 opacity-50">📂</span>
              <p className="text-slate-500 font-medium">No hay proyectos activos en el sistema.</p>
            </div>
          )}
          
          {projects.map(project => (
            <div 
              key={project.id} 
              onClick={() => {
                localStorage.setItem('lastProjectId', project.id.toString())
                navigate(`/dashboard?projectId=${project.id}`)
              }}
              className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-lime-500/50 transition-all group relative overflow-hidden flex flex-col h-56 cursor-pointer"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-lime-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-lime-500/10 transition-colors"></div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  confirmDelete(project.id)
                }} 
                className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                🗑️
              </button>
              
              <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-lime-400 transition-colors pr-6">{project.title}</h3>
              <p className="text-slate-500 text-sm flex-1 overflow-hidden text-ellipsis line-clamp-2">{project.description}</p>
              
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400 font-medium">{getProgress(project.completed_task_count, project.task_count)}%</span>
                  <span className="text-xs text-slate-400 font-medium">{project.completed_task_count}/{project.task_count}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-lime-500 h-full rounded-full shadow-[0_0_10px_#84cc16] transition-all duration-500" 
                    style={{ width: `${getProgress(project.completed_task_count, project.task_count)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                <span className="text-[10px] text-lime-500 font-bold uppercase tracking-widest bg-lime-500/10 px-2 py-1 rounded">Activo</span>
                <span className="text-xs text-slate-600 font-medium">ID: {project.id}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 underline decoration-lime-500 underline-offset-8">Nuevo Proyecto</h3>
            <form onSubmit={handleCreateProject} className="space-y-4 text-left">
              <input required type="text" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-lime-500 outline-none" placeholder="Nombre del proyecto..." />
              <textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-lime-500 outline-none h-24" placeholder="Descripción detallada..."></textarea>
              
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 text-slate-500 font-bold hover:text-slate-300">Cancelar</button>
                <button type="submit" className="flex-1 bg-lime-500 text-slate-950 px-4 py-2 rounded-lg font-black hover:bg-lime-400 transition-colors">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={projectToDelete !== null}
        title="¿Purgar Proyecto?"
        message="Esta acción es irreversible. Se eliminarán todas las tareas y registros asociados al proyecto."
        onConfirm={handleDeleteProject}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  )
}