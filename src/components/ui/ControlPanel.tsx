import { useStore } from '../../store/useStore'

const overlayOptions = [
  { key: 'none' as const, label: 'Default', icon: '🌐', hotkey: '1' },
  { key: 'congestion' as const, label: 'Congestion', icon: '🚧', hotkey: '2' },
  { key: 'delay' as const, label: 'Delay', icon: '⏱', hotkey: '3' },
  { key: 'carbon' as const, label: 'Carbon', icon: '🌿', hotkey: '4' },
]

const cameraPresets = [
  { key: 'reset' as const, label: 'Reset', icon: '⌂', hotkey: 'R' },
  { key: 'top' as const, label: 'Top', icon: '⬇', hotkey: 'T' },
  { key: 'side' as const, label: 'Side', icon: '➡', hotkey: 'Y' },
]

export function ControlPanel() {
  const {
    overlayMode, setOverlayMode,
    showRelations, toggleRelations,
    showLabels, toggleLabels,
    showGraphView, toggleGraphView,
    triggerCamera,
  } = useStore()

  return (
    <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-700/50 rounded-xl p-4 backdrop-blur-md min-w-[320px]">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Overlay</div>
      <div className="flex gap-2 mb-3">
        {overlayOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setOverlayMode(opt.key)}
            title={`Hotkey: ${opt.hotkey}`}
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

      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Camera</div>
      <div className="flex gap-2 mb-3">
        {cameraPresets.map((p) => (
          <button
            key={p.key}
            onClick={() => triggerCamera(p.key)}
            title={`Hotkey: ${p.hotkey}`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/50 hover:bg-slate-700 transition-all"
          >
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Display</div>
      <div className="flex gap-2 mb-3">
        <ToggleButton label="Relations (E)" active={showRelations} onClick={toggleRelations} />
        <ToggleButton label="Labels (L)" active={showLabels} onClick={toggleLabels} />
        <ToggleButton label="Graph (G)" active={showGraphView} onClick={toggleGraphView} />
      </div>

      <div className="pt-2 border-t border-slate-700/50 text-[10px] text-slate-500">
        <kbd className="px-1 bg-slate-800 rounded">/</kbd> search ·{' '}
        <kbd className="px-1 bg-slate-800 rounded">Esc</kbd> deselect
      </div>
    </div>
  )
}

function ToggleButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-xs transition-all ${
        active ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  )
}
