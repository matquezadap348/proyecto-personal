interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-8 shadow-2xl flex flex-col items-center shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 via-red-500 to-red-500/50"></div>
        
        <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center mb-6 border border-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-black text-white mb-2 text-center tracking-tight">{title}</h3>
        <p className="text-slate-400 text-sm text-center mb-8">{message}</p>
        
        <div className="flex gap-4 w-full">
          <button 
            onClick={onCancel} 
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 rounded-xl font-bold transition-colors border border-slate-700 uppercase tracking-widest text-xs"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 bg-lime-500 hover:bg-lime-400 text-slate-950 px-4 py-3 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)] active:scale-95 uppercase tracking-widest text-xs"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
