import type { PortData } from '../types'
import { busanPortData } from './portData'

export interface PortPreset {
  id: string
  name: string
  nameKo: string
  data: PortData
}

function deriveVariant(opts: {
  id: string
  name: string
  nameKo: string
  utilizationFactor: number
  vesselCountFactor: number
  emissionFactor: number
  gateLoadFactor: number
}): PortData {
  const base = busanPortData
  const clamp = (v: number, lo = 0.05, hi = 0.99) => Math.max(lo, Math.min(hi, v))

  return {
    port: {
      id: opts.id,
      name: opts.name,
      nameKo: opts.nameKo,
      position: [0, 0, 0],
      terminals: base.port.terminals,
    },
    terminals: base.terminals.map((t) => ({
      ...t,
      portId: opts.id,
      yardUtilization: clamp(t.yardUtilization * opts.utilizationFactor),
      gateQueueLength: Math.max(0, Math.round(t.gateQueueLength * opts.gateLoadFactor)),
      congestionLevel: opts.utilizationFactor > 1.05 ? 'high' : opts.utilizationFactor < 0.85 ? 'low' : 'medium',
    })),
    berths: base.berths.map((b, i) => ({
      ...b,
      status: opts.vesselCountFactor < 0.7 && i % 2 === 0 ? 'available' : b.status,
    })),
    yardBlocks: base.yardBlocks.map((y) => {
      const u = clamp(y.utilization * opts.utilizationFactor)
      return { ...y, utilization: u, containerCount: Math.round(y.maxCapacity * u) }
    }),
    gates: base.gates.map((g) => ({
      ...g,
      queueLength: Math.max(0, Math.round(g.queueLength * opts.gateLoadFactor)),
      avgWaitMinutes: Math.max(1, Math.round(g.avgWaitMinutes * opts.gateLoadFactor)),
    })),
    vessels: base.vessels.slice(0, Math.max(2, Math.round(base.vessels.length * opts.vesselCountFactor))),
    containers: base.containers,
    events: base.events,
    emissions: base.emissions.map((e) => ({ ...e, co2Tons: +(e.co2Tons * opts.emissionFactor).toFixed(2) })),
    relations: base.relations,
  }
}

export const portPresets: PortPreset[] = [
  { id: 'port_busan', name: 'Busan', nameKo: '부산항', data: busanPortData },
  {
    id: 'port_gwangyang',
    name: 'Gwangyang',
    nameKo: '광양항',
    data: deriveVariant({
      id: 'port_gwangyang',
      name: 'Gwangyang Port',
      nameKo: '광양항',
      utilizationFactor: 0.78,
      vesselCountFactor: 0.7,
      emissionFactor: 0.65,
      gateLoadFactor: 0.6,
    }),
  },
  {
    id: 'port_incheon',
    name: 'Incheon',
    nameKo: '인천항',
    data: deriveVariant({
      id: 'port_incheon',
      name: 'Incheon Port',
      nameKo: '인천항',
      utilizationFactor: 1.12,
      vesselCountFactor: 0.85,
      emissionFactor: 1.25,
      gateLoadFactor: 1.4,
    }),
  },
]
