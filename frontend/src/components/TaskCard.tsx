import { memo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export interface Task {
  id: number
  title: string
  description: string
  status: 'todo' | 'done'
  project_id: number
}

interface TaskCardProps {
  task: Task
  handleDelete?: (e: React.MouseEvent, id: number) => void
}

const TaskCard = memo(function TaskCard({ task, handleDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id.toString(),
    data: { status: task.status }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1,
    willChange: isDragging ? 'transform' : 'auto',
    transition: isDragging ? 'none' : 'transform 200ms ease',
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={`bg-slate-900 p-5 rounded-xl border ${isDragging ? 'border-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.3)]' : 'border-slate-800 hover:border-lime-500/40'} transition-all cursor-grab active:cursor-grabbing group relative`}
    >
      {handleDelete && (
        <button 
          onPointerDown={(e) => handleDelete(e as any, task.id)} 
          className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          🗑️
        </button>
      )}
      <h4 className="text-white font-semibold mb-1 group-hover:text-lime-400 transition-colors pr-6">{task.title}</h4>
      <p className="text-slate-500 text-sm line-clamp-2">{task.description}</p>
    </div>
  )
})

export default TaskCard
