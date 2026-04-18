import { useStore } from '../../store/useStore'
import { SearchBox } from './SearchBox'

export function InfoPanel() {
  const { selectedEntity, portData, getEntityName, getRelatedEntities, getEventsForEntity } = useStore()

  if (!selectedEntity) {
    return (
      <div className="absolute top-4 right-4 w-80 bg-slate-900/95 border border-slate-700/50 rounded-xl p-5 backdrop-blur-md">
        <h2 className="text-lg font-bold text-white mb-1">부산항 (Busan Port)</h2>
        <p className="text-sm text-slate-400 mb-3">해운물류 온톨로지 3D 시각화</p>
        <SearchBox />
        <div className="grid grid-cols-2 gap-3 mt-4">
          <StatCard label="Terminals" value={portData.terminals.length} />
          <StatCard label="Vessels" value={portData.vessels.length} />
          <StatCard label="Berths" value={portData.berths.length} />
          <StatCard label="Events" value={portData.events.length} color="#f59e0b" />
        </div>
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">Click any object · Press <kbd className="px-1 bg-slate-800 rounded">/</kbd> to search</p>
        </div>
      </div>
    )
  }

  const entity = findEntity(selectedEntity.id, portData)
  const relatedIds = getRelatedEntities(selectedEntity.id)
  const events = getEventsForEntity(selectedEntity.id)

  return (
    <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto bg-slate-900/95 border border-blue-500/30 rounded-xl p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-blue-400 font-medium uppercase tracking-wider">{selectedEntity.type}</div>
          <h2 className="text-lg font-bold text-white">{getEntityName(selectedEntity.id)}</h2>
        </div>
        <button
          onClick={() => useStore.getState().selectEntity(null)}
          className="text-slate-500 hover:text-white text-xl leading-none"
        >
          ×
        </button>
      </div>

      {entity && <EntityDetails entity={entity} type={selectedEntity.type} />}

      {events.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Events ({events.length})</h3>
          {events.map((evt) => (
            <div
              key={evt.id}
              className="mb-2 p-2 rounded-lg text-xs"
              style={{
                background: evt.severity === 'critical' ? 'rgba(239,68,68,0.1)' :
                  evt.severity === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                borderLeft: `3px solid ${evt.severity === 'critical' ? '#ef4444' : evt.severity === 'warning' ? '#f59e0b' : '#3b82f6'}`,
              }}
            >
              <div className="font-semibold text-slate-200">{evt.type.replace('_', ' ')}</div>
              <div className="text-slate-400 mt-0.5">{evt.description}</div>
            </div>
          ))}
        </div>
      )}

      {relatedIds.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Related ({relatedIds.length})</h3>
          <div className="flex flex-wrap gap-1.5">
            {relatedIds.map((rid) => (
              <button
                key={rid}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 border border-slate-700/50 transition-colors"
                onClick={() => {
                  const s = useStore.getState()
                  const type = s.getEntityType(rid)
                  if (type) {
                    s.selectEntity({ id: rid, type })
                    s.focusEntity(rid)
                  }
                }}
              >
                {getEntityName(rid)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-slate-800/60 rounded-lg p-3">
      <div className="text-2xl font-bold" style={{ color: color || '#60a5fa' }}>{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  )
}

function EntityDetails({ entity, type }: { entity: Record<string, unknown>; type: string }) {
  const fields = getDisplayFields(entity, type)
  if (fields.length === 0) return null

  return (
    <div className="space-y-1.5">
      {fields.map(({ label, value, color }) => (
        <div key={label} className="flex justify-between items-center text-sm">
          <span className="text-slate-400">{label}</span>
          <span className="font-medium" style={{ color: color || '#e2e8f0' }}>{value}</span>
        </div>
      ))}
    </div>
  )
}

function getDisplayFields(entity: Record<string, unknown>, type: string): Array<{ label: string; value: string; color?: string }> {
  switch (type) {
    case 'vessel': {
      const v = entity as Record<string, unknown>
      return [
        { label: 'Status', value: String(v.status).toUpperCase(), color: v.status === 'waiting' ? '#f59e0b' : v.status === 'berthed' ? '#3b82f6' : '#10b981' },
        { label: 'Capacity', value: `${Number(v.currentLoad).toLocaleString()} / ${Number(v.capacity).toLocaleString()} TEU` },
        { label: 'Load', value: `${Math.round((Number(v.currentLoad) / Number(v.capacity)) * 100)}%` },
        { label: 'ETA', value: new Date(String(v.eta)).toLocaleTimeString() },
        { label: 'ETD', value: new Date(String(v.etd)).toLocaleTimeString() },
        { label: 'CO2 Rate', value: `${v.co2EmissionRate} t/hr`, color: Number(v.co2EmissionRate) > 3 ? '#ef4444' : '#10b981' },
      ]
    }
    case 'terminal': {
      const t = entity as Record<string, unknown>
      const congLevel = String(t.congestionLevel)
      return [
        { label: 'Congestion', value: congLevel.toUpperCase(), color: congLevel === 'high' || congLevel === 'critical' ? '#ef4444' : congLevel === 'medium' ? '#f59e0b' : '#10b981' },
        { label: 'Yard Usage', value: `${Math.round(Number(t.yardUtilization) * 100)}%`, color: Number(t.yardUtilization) > 0.8 ? '#ef4444' : '#10b981' },
        { label: 'Gate Queue', value: String(t.gateQueueLength), color: Number(t.gateQueueLength) > 10 ? '#f59e0b' : '#10b981' },
      ]
    }
    case 'berth': {
      const b = entity as Record<string, unknown>
      return [
        { label: 'Status', value: String(b.status).toUpperCase(), color: b.status === 'occupied' ? '#f59e0b' : b.status === 'maintenance' ? '#ef4444' : '#10b981' },
        { label: 'Length', value: `${b.length}m` },
      ]
    }
    case 'yard': {
      const y = entity as Record<string, unknown>
      return [
        { label: 'Utilization', value: `${Math.round(Number(y.utilization) * 100)}%`, color: Number(y.utilization) > 0.85 ? '#ef4444' : '#10b981' },
        { label: 'Containers', value: `${y.containerCount} / ${y.maxCapacity}` },
      ]
    }
    case 'gate': {
      const g = entity as Record<string, unknown>
      return [
        { label: 'Status', value: String(g.status).toUpperCase(), color: g.status === 'congested' ? '#f59e0b' : '#10b981' },
        { label: 'Queue', value: String(g.queueLength) },
        { label: 'Avg Wait', value: `${g.avgWaitMinutes} min` },
      ]
    }
    default:
      return []
  }
}

function findEntity(id: string, data: typeof import('../../data/portData').busanPortData): Record<string, unknown> | null {
  const v = data.vessels.find((v) => v.id === id)
  if (v) return v as unknown as Record<string, unknown>
  const t = data.terminals.find((t) => t.id === id)
  if (t) return t as unknown as Record<string, unknown>
  const b = data.berths.find((b) => b.id === id)
  if (b) return b as unknown as Record<string, unknown>
  const y = data.yardBlocks.find((y) => y.id === id)
  if (y) return y as unknown as Record<string, unknown>
  const g = data.gates.find((g) => g.id === id)
  if (g) return g as unknown as Record<string, unknown>
  return null
}
