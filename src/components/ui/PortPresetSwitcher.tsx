import { useStore } from '../../store/useStore'
import { portPresets } from '../../data/portPresets'
import { t } from '../../i18n'

export function PortPresetSwitcher() {
  const language = useStore((s) => s.language)
  const activeId = useStore((s) => s.activePortPresetId)
  const setActive = useStore((s) => s.setActivePortPreset)
  const isCustom = useStore((s) => s.isCustomData)

  if (isCustom) return null

  return (
    <div className="absolute bottom-20 left-4 bg-slate-900/95 border border-slate-700/50 rounded-xl p-2 backdrop-blur-md flex items-center gap-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold pl-1 pr-1">
        {t('port_preset', language)}
      </div>
      <div className="flex rounded-lg overflow-hidden border border-slate-700/60">
        {portPresets.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`px-2.5 py-1 text-[11px] font-medium transition-all ${
              activeId === p.id ? 'bg-blue-500/30 text-blue-200' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {language === 'ko' ? p.nameKo : p.name}
          </button>
        ))}
      </div>
    </div>
  )
}
