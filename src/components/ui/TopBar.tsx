import { useStore } from '../../store/useStore'
import { t } from '../../i18n'

export function TopBar() {
  const language = useStore((s) => s.language)
  const setLanguage = useStore((s) => s.setLanguage)
  const viewMode = useStore((s) => s.viewMode)
  const setViewMode = useStore((s) => s.setViewMode)
  const liveMode = useStore((s) => s.liveMode)
  const toggleLiveMode = useStore((s) => s.toggleLiveMode)

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/95 border border-slate-700/50 rounded-full px-2 py-1.5 backdrop-blur-md shadow-xl z-10">
      <div className="flex rounded-full overflow-hidden border border-slate-700/60">
        <button
          onClick={() => setViewMode('port')}
          className={`px-3 py-1 text-xs font-medium transition-all ${
            viewMode === 'port' ? 'bg-blue-500/30 text-blue-200' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="W"
        >
          ⚓ {t('view_port', language)}
        </button>
        <button
          onClick={() => setViewMode('world')}
          className={`px-3 py-1 text-xs font-medium transition-all ${
            viewMode === 'world' ? 'bg-blue-500/30 text-blue-200' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="W"
        >
          🌐 {t('view_world', language)}
        </button>
      </div>

      <div className="w-px h-5 bg-slate-700/60" />

      <button
        onClick={toggleLiveMode}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          liveMode ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse' : 'bg-slate-800 text-slate-400 border border-slate-700/50'
        }`}
        title="M"
      >
        {liveMode ? t('live_on', language) : t('live_off', language)}
      </button>

      <div className="w-px h-5 bg-slate-700/60" />

      <div className="flex rounded-full overflow-hidden border border-slate-700/60">
        <button
          onClick={() => setLanguage('ko')}
          className={`px-2.5 py-1 text-xs font-medium transition-all ${
            language === 'ko' ? 'bg-blue-500/30 text-blue-200' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="K"
        >
          KO
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 text-xs font-medium transition-all ${
            language === 'en' ? 'bg-blue-500/30 text-blue-200' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="K"
        >
          EN
        </button>
      </div>
    </div>
  )
}
