import { memo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import type { Task } from './TaskCard'

interface DroppableColumnProps {
  status: string
  label: string
  tasks: Task[]
  handleDelete?: (e: React.MouseEvent, id: number) => void
}

const DroppableColumn = memo(function DroppableColumn({ status, label, tasks, handleDelete }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  return (
    <div 
      ref={setNodeRef} 
      className={`flex-1 min-w-[320px] rounded-2xl p-5 border flex flex-col transition-colors ${isOver ? 'bg-slate-800/60 border-lime-500/50' : 'bg-slate-900/40 border-slate-800/50'}`}
    >
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">{label}</h3>
        <span className="text-lime-400 text-xs font-bold border border-lime-500/20 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.2)]">
          {tasks.length}
        </span>
      </div>
      
      {tasks.length === 0 && (
        <div className="flex-1 border-2 border-dashed border-slate-800/50 rounded-xl flex items-center justify-center">
          <span className="text-slate-600 text-sm font-medium">Vacío / Suelta aquí</span>
        </div>
      )}

      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} handleDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
})

export default DroppableColumn
