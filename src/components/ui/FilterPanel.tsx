import { useState } from 'react'
import { useStore, type EntityKind } from '../../store/useStore'
import type { RelationType } from '../../types'
import { t } from '../../i18n'

const ENTITY_KINDS: Array<{ key: EntityKind; icon: string; tkey: Parameters<typeof t>[0] }> = [
  { key: 'vessel', icon: '🚢', tkey: 'vessels' },
  { key: 'terminal', icon: '🏗', tkey: 'terminals' },
  { key: 'berth', icon: '⚓', tkey: 'berths' },
  { key: 'yard', icon: '📦', tkey: 'yards' },
  { key: 'gate', icon: '🚪', tkey: 'gates' },
  { key: 'event', icon: '⚠', tkey: 'events' },
]

const RELATION_TYPES: RelationType[] = [
  'callsAt', 'assignedTo', 'handledBy', 'storedIn',
  'belongsTo', 'produces', 'causes', 'affectedBy',
]

export function FilterPanel() {
  const {
    visibleEntityKinds, visibleRelationTypes,
    toggleEntityKind, toggleRelationType, resetFilters,
    language,
  } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute bottom-4 right-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 bg-slate-900/95 border border-slate-700/50 rounded-xl text-xs text-slate-300 hover:bg-slate-800 backdrop-blur-md flex items-center gap-2"
          title="Open filters"
        >
          <span>⚙</span> {t('filters', language)}
          <span className="text-slate-500">
            ({visibleEntityKinds.size}/{ENTITY_KINDS.length})
          </span>
        </button>
      ) : (
        <div className="w-72 bg-slate-900/95 border border-slate-700/50 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">{t('filters', language)}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="text-[10px] text-slate-400 hover:text-blue-400"
              >
                {t('reset', language)}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">{t('entities', language)}</div>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {ENTITY_KINDS.map((ent) => {
              const active = visibleEntityKinds.has(ent.key)
              return (
                <button
                  key={ent.key}
                  onClick={() => toggleEntityKind(ent.key)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  <span>{ent.icon}</span> {t(ent.tkey, language)}
                </button>
              )
            })}
          </div>

          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">{t('relations', language)}</div>
          <div className="flex flex-wrap gap-1">
            {RELATION_TYPES.map((rel) => {
              const active = visibleRelationTypes.has(rel)
              return (
                <button
                  key={rel}
                  onClick={() => toggleRelationType(rel)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  {rel}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
