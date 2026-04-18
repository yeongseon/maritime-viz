import { useStore } from '../../store/useStore'

const SPEEDS = [1, 4, 16, 64]

function fmt(t: number): string {
  const d = new Date(t)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`
}

export function TimelinePanel() {
  const {
    timeRange, currentTime, isPlaying, playbackSpeed, timeFilterEnabled,
    setCurrentTime, togglePlaying, setPlaybackSpeed, toggleTimeFilter,
  } = useStore()

  const span = timeRange.max - timeRange.min || 1
  const progress = ((currentTime - timeRange.min) / span) * 100

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(640px,calc(100vw-2rem))] bg-slate-900/95 border border-slate-700/50 rounded-xl p-3 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={togglePlaying}
          disabled={!timeFilterEnabled}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
            timeFilterEnabled
              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/40'
              : 'bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed'
          }`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min={timeRange.min}
            max={timeRange.max}
            value={currentTime}
            step={60_000}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            disabled={!timeFilterEnabled}
            className="w-full accent-blue-500 disabled:opacity-40"
          />
        </div>

        <div className="text-xs text-slate-300 font-mono whitespace-nowrap min-w-[150px] text-right">
          {fmt(currentTime)}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500">
        <button
          onClick={toggleTimeFilter}
          className={`px-2 py-1 rounded transition-all ${
            timeFilterEnabled
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700/50 hover:bg-slate-700'
          }`}
        >
          {timeFilterEnabled ? '⏱ Time filter ON' : '⏱ Time filter OFF'}
        </button>

        <div className="flex items-center gap-1">
          <span className="mr-1">Speed:</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`px-1.5 py-0.5 rounded ${
                playbackSpeed === s
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>

        <div className="font-mono">{progress.toFixed(0)}%</div>
      </div>
    </div>
  )
}
