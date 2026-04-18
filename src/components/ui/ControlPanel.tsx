import { useStore } from '../../store/useStore'

const overlayOptions = [
  { key: 'none' as const, label: 'Default', icon: '🌐' },
  { key: 'congestion' as const, label: 'Congestion', icon: '🚧' },
  { key: 'delay' as const, label: 'Delay', icon: '⏱' },
  { key: 'carbon' as const, label: 'Carbon', icon: '🌿' },
]

export function ControlPanel() {
  const {
    overlayMode, setOverlayMode,
    showRelations, toggleRelations,
    showLabels, toggleLabels,
    showGraphView, toggleGraphView,
  } = useStore()

  return (
    <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-700/50 rounded-xl p-4 backdrop-blur-md">
      <div className="flex gap-2 mb-3">
        {overlayOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setOverlayMode(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              overlayMode === opt.key
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700/50 hover:bg-slate-700'
            }`}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <ToggleButton label="Relations" active={showRelations} onClick={toggleRelations} />
        <ToggleButton label="Labels" active={showLabels} onClick={toggleLabels} />
        <ToggleButton label="Graph" active={showGraphView} onClick={toggleGraphView} />
      </div>
    </div>
  )
}

function ToggleButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-xs transition-all ${
        active ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'
      }`}
    >
      {label}
    </button>
  )
}
