import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { t } from '../../i18n'

const SEVERITY_COLOR: Record<string, string> = {
  critical: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
}

export function InsightsPanel() {
  const language = useStore((s) => s.language)
  const liveEvents = useStore((s) => s.liveEvents)
  const clearLiveEvents = useStore((s) => s.clearLiveEvents)
  const inferredAlerts = useStore((s) => s.inferredAlerts)
  const selectEntity = useStore((s) => s.selectEntity)
  const focusEntity = useStore((s) => s.focusEntity)
  const getEntityType = useStore((s) => s.getEntityType)
  const liveMode = useStore((s) => s.liveMode)
  const [tab, setTab] = useState<'alerts' | 'events'>('alerts')
  const [open, setOpen] = useState(true)

  const alerts = inferredAlerts()

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-20 right-4 bg-slate-900/95 border border-slate-700/50 rounded-xl px-3 py-2 backdrop-blur-md text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
      >
        🧠 {t('inferred_alerts', language)}
        {(alerts.length > 0 || liveEvents.length > 0) && (
          <span className="bg-red-500/30 text-red-300 px-1.5 py-0.5 rounded-full text-[10px]">
            {alerts.length + liveEvents.length}
          </span>
        )}
      </button>
    )
  }

  const focus = (id: string) => {
    const type = getEntityType(id)
    if (type) {
      selectEntity({ id, type })
      focusEntity(id)
    }
  }

  return (
    <div className="absolute bottom-20 right-4 w-[min(22rem,calc(100vw-2rem))] bg-slate-900/95 border border-slate-700/50 rounded-xl backdrop-blur-md flex flex-col max-h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between px-3 pt-2">
        <div className="flex gap-1">
          <button
            onClick={() => setTab('alerts')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
              tab === 'alerts' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            🧠 {t('inferred_alerts', language)} {alerts.length > 0 && <span className="text-red-400">({alerts.length})</span>}
          </button>
          <button
            onClick={() => setTab('events')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
              tab === 'events' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            📡 {t('live_events', language)} {liveEvents.length > 0 && <span className="text-amber-400">({liveEvents.length})</span>}
          </button>
        </div>
        <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white text-lg leading-none px-1">▾</button>
      </div>

      <div className="overflow-y-auto p-2 flex-1">
        {tab === 'alerts' && (
          alerts.length === 0 ? (
            <div className="text-[11px] text-slate-500 text-center py-4">{t('no_alerts', language)}</div>
          ) : (
            <div className="space-y-1.5">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className="rounded-md p-2 text-[11px] border-l-2"
                  style={{ borderColor: SEVERITY_COLOR[a.severity], background: `${SEVERITY_COLOR[a.severity]}15` }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-slate-200 uppercase text-[9px] tracking-wider">{a.severity}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{a.rule.split(':')[0]}</span>
                  </div>
                  <div className="text-slate-300">{a.message}</div>
                  {a.targetIds.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {a.targetIds.slice(0, 4).map((id) => (
                        <button
                          key={id}
                          onClick={() => focus(id)}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[9px] text-slate-400 font-mono"
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'events' && (
          liveEvents.length === 0 ? (
            <div className="text-[11px] text-slate-500 text-center py-4">
              {liveMode ? '...' : t('no_events', language)}
            </div>
          ) : (
            <div className="space-y-1">
              {liveEvents.map((e) => (
                <div
                  key={e.id}
                  className="rounded-md p-2 text-[11px] border-l-2 cursor-pointer hover:bg-slate-800/50"
                  style={{ borderColor: SEVERITY_COLOR[e.severity], background: `${SEVERITY_COLOR[e.severity]}10` }}
                  onClick={() => focus(e.targetId)}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-slate-200 text-[10px]">{e.type.replace('_', ' ')}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{e.timestamp.slice(11, 16)}</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">{e.description}</div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {tab === 'events' && liveEvents.length > 0 && (
        <div className="px-3 py-1.5 border-t border-slate-700/50">
          <button
            onClick={clearLiveEvents}
            className="text-[10px] text-slate-400 hover:text-blue-400"
          >
            {t('clear', language)}
          </button>
        </div>
      )}
    </div>
  )
}
