import type { PortData, LogisticsEvent } from '../types'

export interface InferredAlert {
  id: string
  severity: 'info' | 'warning' | 'critical'
  rule: string
  message: string
  targetIds: string[]
}

const RULE_HIGH_YARD_BOTTLENECK = 'R1: Yard congestion + incoming vessel'
const RULE_GATE_OVERLOAD = 'R2: Gate queue + truck arrival rate'
const RULE_EMISSION_SPIKE = 'R3: CO2 emission spike'
const RULE_BERTH_STARVATION = 'R4: Berth idle while vessels waiting'

export function inferAlerts(data: PortData, currentTime: number): InferredAlert[] {
  const alerts: InferredAlert[] = []

  data.terminals.forEach((t) => {
    if (t.yardUtilization > 0.85) {
      const incoming = data.vessels.filter((v) => {
        const eta = new Date(v.eta).getTime()
        return v.status === 'approaching' && eta - currentTime < 12 * 3600_000
      })
      if (incoming.length > 0) {
        alerts.push({
          id: `inf_yard_${t.id}`,
          severity: 'critical',
          rule: RULE_HIGH_YARD_BOTTLENECK,
          message: `${t.name}: yard ${Math.round(t.yardUtilization * 100)}% + ${incoming.length} vessel(s) ETA <12h`,
          targetIds: [t.id, ...incoming.map((v) => v.id)],
        })
      }
    }
  })

  data.gates.forEach((g) => {
    if (g.queueLength > 15 && g.avgWaitMinutes > 20) {
      alerts.push({
        id: `inf_gate_${g.id}`,
        severity: 'warning',
        rule: RULE_GATE_OVERLOAD,
        message: `Gate ${g.id.split('_')[1]}: queue ${g.queueLength}, wait ${g.avgWaitMinutes}m`,
        targetIds: [g.id],
      })
    }
  })

  const recentEmissions = data.emissions.filter((e) => {
    const t = new Date(e.timestamp).getTime()
    return Math.abs(t - currentTime) < 6 * 3600_000
  })
  const avgCO2 = recentEmissions.length > 0
    ? recentEmissions.reduce((s, e) => s + e.co2Tons, 0) / recentEmissions.length
    : 0
  recentEmissions.forEach((e) => {
    if (avgCO2 > 0 && e.co2Tons > avgCO2 * 1.8) {
      alerts.push({
        id: `inf_em_${e.id}`,
        severity: 'warning',
        rule: RULE_EMISSION_SPIKE,
        message: `${e.sourceId}: CO2 ${e.co2Tons.toFixed(1)}t (avg ${avgCO2.toFixed(1)}t)`,
        targetIds: [e.sourceId],
      })
    }
  })

  const idleBerths = data.berths.filter((b) => b.status === 'available')
  const waitingVessels = data.vessels.filter((v) => v.status === 'waiting')
  if (idleBerths.length > 0 && waitingVessels.length > 0) {
    alerts.push({
      id: 'inf_berth_starv',
      severity: 'info',
      rule: RULE_BERTH_STARVATION,
      message: `${idleBerths.length} idle berth(s) while ${waitingVessels.length} vessel(s) waiting`,
      targetIds: [...idleBerths.map((b) => b.id), ...waitingVessels.map((v) => v.id)],
    })
  }

  return alerts
}

const EVENT_TYPES: LogisticsEvent['type'][] = ['delay', 'congestion', 'weather', 'equipment_failure', 'emission_alert']

export function generateLiveEvent(data: PortData, currentTime: number): LogisticsEvent | null {
  if (Math.random() > 0.4) return null
  const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)]
  const targets: Array<{ id: string; type: LogisticsEvent['targetType'] }> = []
  data.vessels.forEach((v) => targets.push({ id: v.id, type: 'vessel' }))
  data.terminals.forEach((t) => targets.push({ id: t.id, type: 'terminal' }))
  data.gates.forEach((g) => targets.push({ id: g.id, type: 'gate' }))
  if (targets.length === 0) return null
  const tgt = targets[Math.floor(Math.random() * targets.length)]
  const severity: LogisticsEvent['severity'] = Math.random() < 0.15 ? 'critical' : Math.random() < 0.5 ? 'warning' : 'info'
  return {
    id: `live_${currentTime}_${Math.floor(Math.random() * 1000)}`,
    type,
    severity,
    targetId: tgt.id,
    targetType: tgt.type,
    cause: `Auto-generated ${type}`,
    description: `${type.replace('_', ' ')} detected on ${tgt.id}`,
    timestamp: new Date(currentTime).toISOString(),
    relatedEntities: [],
  }
}
