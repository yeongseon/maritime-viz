import { useStore } from '../../store/useStore'

export function StatusBar() {
  const { portData, overlayMode, currentTime, timeFilterEnabled } = useStore()

  const totalEmissions = portData.emissions.reduce((sum, e) => sum + e.co2Tons, 0)
  const avgYardUtil = portData.yardBlocks.length > 0
    ? portData.yardBlocks.reduce((sum, y) => sum + y.utilization, 0) / portData.yardBlocks.length
    : 0
  const criticalEvents = portData.events.filter((e) => e.severity === 'critical').length
  const berthOccupancy = portData.berths.length > 0
    ? portData.berths.filter((b) => b.status === 'occupied').length / portData.berths.length
    : 0

  return (
    <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[calc(100vw-2rem)]">
      <MetricBadge label="Berth Occ." value={`${Math.round(berthOccupancy * 100)}%`} color={berthOccupancy > 0.7 ? '#f59e0b' : '#10b981'} />
      <MetricBadge label="Yard Avg" value={`${Math.round(avgYardUtil * 100)}%`} color={avgYardUtil > 0.7 ? '#f59e0b' : '#10b981'} />
      <MetricBadge label="CO2 Total" value={`${totalEmissions.toFixed(1)}t`} color={totalEmissions > 50 ? '#ef4444' : '#f59e0b'} highlight={overlayMode === 'carbon'} />
      <MetricBadge label="Alerts" value={`${criticalEvents}`} color={criticalEvents > 0 ? '#ef4444' : '#10b981'} highlight={overlayMode === 'delay'} />
      {timeFilterEnabled && (
        <MetricBadge
          label="Sim Time"
          value={new Date(currentTime).toISOString().slice(11, 16) + 'Z'}
          color="#a78bfa"
          highlight
        />
      )}
    </div>
  )
}

function MetricBadge({ label, value, color, highlight }: { label: string; value: string; color: string; highlight?: boolean }) {
  return (
    <div
      className="bg-slate-900/95 border rounded-lg px-3 py-2 backdrop-blur-md"
      style={{ borderColor: highlight ? color : 'rgba(100, 116, 139, 0.3)' }}
    >
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-bold" style={{ color }}>{value}</div>
    </div>
  )
}
