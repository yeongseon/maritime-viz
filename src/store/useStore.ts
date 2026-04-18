import { create } from 'zustand'
import type { SelectedEntity, EntityType, RelationType, PortData, Vessel, LogisticsEvent } from '../types'
import { busanPortData } from '../data/portData'
import { portPresets } from '../data/portPresets'
import { generateLiveEvent, inferAlerts, type InferredAlert } from '../lib/inference'
import type { Lang } from '../i18n'

type OverlayMode = 'none' | 'congestion' | 'carbon' | 'delay'
export type CameraPreset = 'reset' | 'top' | 'side' | 'focus'
export type EntityKind = 'vessel' | 'terminal' | 'berth' | 'yard' | 'gate' | 'event'
export type ViewMode = 'port' | 'world' | 'inland'

export interface CameraCommand {
  preset: CameraPreset
  target?: [number, number, number]
  nonce: number
}

export interface SearchResult {
  id: string
  type: EntityType
  name: string
  position: [number, number, number]
}

export interface TimeRange {
  min: number
  max: number
}

const ALL_ENTITY_KINDS: EntityKind[] = ['vessel', 'terminal', 'berth', 'yard', 'gate', 'event']
const ALL_RELATION_TYPES: RelationType[] = [
  'callsAt', 'assignedTo', 'handledBy', 'storedIn', 'transportedBy',
  'deliveredTo', 'causes', 'affectedBy', 'produces', 'belongsTo', 'containedIn',
]

function computeTimeRange(data: PortData): TimeRange {
  const stamps: number[] = []
  data.events.forEach((e) => stamps.push(new Date(e.timestamp).getTime()))
  data.vessels.forEach((v) => {
    stamps.push(new Date(v.eta).getTime())
    stamps.push(new Date(v.etd).getTime())
  })
  data.emissions.forEach((e) => stamps.push(new Date(e.timestamp).getTime()))
  if (stamps.length === 0) {
    const now = Date.now()
    return { min: now - 12 * 3600_000, max: now + 12 * 3600_000 }
  }
  return { min: Math.min(...stamps), max: Math.max(...stamps) }
}

function lerp3(a: [number, number, number], b: [number, number, number], k: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
}

interface AppState {
  portData: PortData
  isCustomData: boolean
  loadCustomData: (data: PortData) => void
  resetData: () => void

  language: Lang
  setLanguage: (l: Lang) => void

  viewMode: ViewMode
  setViewMode: (m: ViewMode) => void

  liveMode: boolean
  toggleLiveMode: () => void
  applyLiveTick: () => void
  liveEvents: LogisticsEvent[]
  clearLiveEvents: () => void

  activePortPresetId: string
  setActivePortPreset: (id: string) => void

  inferredAlerts: () => InferredAlert[]

  selectedEntity: SelectedEntity | null
  hoveredEntity: SelectedEntity | null
  selectEntity: (entity: SelectedEntity | null) => void
  hoverEntity: (entity: SelectedEntity | null) => void

  overlayMode: OverlayMode
  setOverlayMode: (mode: OverlayMode) => void

  showRelations: boolean
  toggleRelations: () => void
  showLabels: boolean
  toggleLabels: () => void
  showGraphView: boolean
  toggleGraphView: () => void

  searchQuery: string
  setSearchQuery: (q: string) => void
  searchResults: () => SearchResult[]

  cameraCommand: CameraCommand
  triggerCamera: (preset: CameraPreset, target?: [number, number, number]) => void
  focusEntity: (id: string) => void

  timeRange: TimeRange
  currentTime: number
  isPlaying: boolean
  playbackSpeed: number
  timeFilterEnabled: boolean
  setCurrentTime: (t: number) => void
  setPlaying: (p: boolean) => void
  togglePlaying: () => void
  setPlaybackSpeed: (s: number) => void
  toggleTimeFilter: () => void
  tickTime: (deltaMs: number) => void

  visibleEntityKinds: Set<EntityKind>
  visibleRelationTypes: Set<RelationType>
  toggleEntityKind: (k: EntityKind) => void
  toggleRelationType: (r: RelationType) => void
  resetFilters: () => void

  getEntityName: (id: string) => string
  getEntityType: (id: string) => EntityType | null
  getEntityPosition: (id: string) => [number, number, number] | null
  getRelatedEntities: (id: string) => string[]
  getEventsForEntity: (id: string) => PortData['events']
  getVisibleVessels: () => PortData['vessels']
  getInterpolatedVessels: () => Vessel[]
  getVisibleEvents: () => PortData['events']
}

const initialRange = computeTimeRange(busanPortData)

export const useStore = create<AppState>((set, get) => ({
  portData: busanPortData,
  isCustomData: false,
  loadCustomData: (data) => {
    const range = computeTimeRange(data)
    set({
      portData: data,
      isCustomData: true,
      timeRange: range,
      currentTime: range.max,
      selectedEntity: null,
    })
  },
  resetData: () => {
    const range = computeTimeRange(busanPortData)
    set({
      portData: busanPortData,
      isCustomData: false,
      timeRange: range,
      currentTime: range.max,
      selectedEntity: null,
    })
  },

  language: 'ko',
  setLanguage: (l) => set({ language: l }),

  viewMode: 'port',
  setViewMode: (m) => set({ viewMode: m }),

  liveMode: false,
  toggleLiveMode: () => set((s) => ({ liveMode: !s.liveMode })),
  applyLiveTick: () => set((s) => {
    if (!s.liveMode) return s
    const next = { ...s.portData }
    next.gates = s.portData.gates.map((g) => ({
      ...g,
      queueLength: Math.max(0, Math.round(g.queueLength + (Math.random() - 0.5) * 4)),
      avgWaitMinutes: Math.max(1, Math.round(g.avgWaitMinutes + (Math.random() - 0.5) * 6)),
    }))
    next.terminals = s.portData.terminals.map((t) => ({
      ...t,
      gateQueueLength: Math.max(0, t.gateQueueLength + Math.round((Math.random() - 0.5) * 3)),
      yardUtilization: Math.max(0.1, Math.min(0.99, t.yardUtilization + (Math.random() - 0.5) * 0.04)),
    }))
    next.yardBlocks = s.portData.yardBlocks.map((y) => {
      const u = Math.max(0.1, Math.min(0.99, y.utilization + (Math.random() - 0.5) * 0.05))
      return { ...y, utilization: u, containerCount: Math.round(u * y.maxCapacity) }
    })
    next.emissions = s.portData.emissions.map((e) => ({
      ...e,
      co2Tons: Math.max(0.5, +(e.co2Tons + (Math.random() - 0.5) * 1.5).toFixed(2)),
    }))
    next.vessels = s.portData.vessels.map((v) => ({
      ...v,
      co2EmissionRate: +Math.max(0.5, v.co2EmissionRate + (Math.random() - 0.5) * 0.4).toFixed(2),
    }))
    const generated = generateLiveEvent(next, Date.now())
    const liveEvents = generated ? [generated, ...s.liveEvents].slice(0, 30) : s.liveEvents
    return { portData: next, liveEvents }
  }),
  liveEvents: [],
  clearLiveEvents: () => set({ liveEvents: [] }),

  activePortPresetId: 'port_busan',
  setActivePortPreset: (id) => {
    const preset = portPresets.find((p) => p.id === id)
    if (!preset) return
    const range = computeTimeRange(preset.data)
    set({
      portData: preset.data,
      activePortPresetId: id,
      isCustomData: false,
      timeRange: range,
      currentTime: range.max,
      selectedEntity: null,
      liveEvents: [],
    })
  },

  inferredAlerts: () => {
    const s = get()
    return inferAlerts(s.portData, s.currentTime)
  },

  selectedEntity: null,
  hoveredEntity: null,
  selectEntity: (entity) => set({ selectedEntity: entity }),
  hoverEntity: (entity) => set({ hoveredEntity: entity }),

  overlayMode: 'none',
  setOverlayMode: (mode) => set({ overlayMode: mode }),

  showRelations: true,
  toggleRelations: () => set((s) => ({ showRelations: !s.showRelations })),
  showLabels: true,
  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
  showGraphView: false,
  toggleGraphView: () => set((s) => ({ showGraphView: !s.showGraphView })),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  searchResults: () => {
    const q = get().searchQuery.trim().toLowerCase()
    if (!q) return []
    const d = get().portData
    const out: SearchResult[] = []
    d.vessels.forEach((v) => {
      if (v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q)) {
        out.push({ id: v.id, type: 'vessel', name: v.name, position: v.position })
      }
    })
    d.terminals.forEach((t) => {
      if (t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) {
        out.push({ id: t.id, type: 'terminal', name: t.name, position: t.position })
      }
    })
    d.berths.forEach((b) => {
      if (b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)) {
        out.push({ id: b.id, type: 'berth', name: b.name, position: b.position })
      }
    })
    return out.slice(0, 8)
  },

  cameraCommand: { preset: 'reset', nonce: 0 },
  triggerCamera: (preset, target) =>
    set((s) => ({ cameraCommand: { preset, target, nonce: s.cameraCommand.nonce + 1 } })),
  focusEntity: (id) => {
    const pos = get().getEntityPosition(id)
    if (pos) get().triggerCamera('focus', pos)
  },

  timeRange: initialRange,
  currentTime: initialRange.max,
  isPlaying: false,
  playbackSpeed: 1,
  timeFilterEnabled: false,
  setCurrentTime: (t) => set({ currentTime: t }),
  setPlaying: (p) => set({ isPlaying: p }),
  togglePlaying: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setPlaybackSpeed: (s) => set({ playbackSpeed: s }),
  toggleTimeFilter: () => set((s) => ({ timeFilterEnabled: !s.timeFilterEnabled })),
  tickTime: (deltaMs) => {
    const s = get()
    if (!s.isPlaying) return
    const next = s.currentTime + deltaMs * s.playbackSpeed * 3.6
    if (next >= s.timeRange.max) {
      set({ currentTime: s.timeRange.max, isPlaying: false })
    } else {
      set({ currentTime: next })
    }
  },

  visibleEntityKinds: new Set(ALL_ENTITY_KINDS),
  visibleRelationTypes: new Set(ALL_RELATION_TYPES),
  toggleEntityKind: (k) => set((s) => {
    const next = new Set(s.visibleEntityKinds)
    if (next.has(k)) next.delete(k); else next.add(k)
    return { visibleEntityKinds: next }
  }),
  toggleRelationType: (r) => set((s) => {
    const next = new Set(s.visibleRelationTypes)
    if (next.has(r)) next.delete(r); else next.add(r)
    return { visibleRelationTypes: next }
  }),
  resetFilters: () => set({
    visibleEntityKinds: new Set(ALL_ENTITY_KINDS),
    visibleRelationTypes: new Set(ALL_RELATION_TYPES),
  }),

  getEntityName: (id: string) => {
    const d = get().portData
    const v = d.vessels.find((v) => v.id === id)
    if (v) return v.name
    const t = d.terminals.find((t) => t.id === id)
    if (t) return t.name
    const b = d.berths.find((b) => b.id === id)
    if (b) return b.name
    const y = d.yardBlocks.find((y) => y.id === id)
    if (y) return y.id
    const g = d.gates.find((g) => g.id === id)
    if (g) return `Gate ${g.id.split('_')[1]}`
    const e = d.events.find((e) => e.id === id)
    if (e) return e.description.slice(0, 40)
    if (id === d.port.id) return d.port.name
    return id
  },

  getEntityType: (id: string) => {
    const d = get().portData
    if (d.vessels.find((v) => v.id === id)) return 'vessel'
    if (d.terminals.find((t) => t.id === id)) return 'terminal'
    if (d.berths.find((b) => b.id === id)) return 'berth'
    if (d.yardBlocks.find((y) => y.id === id)) return 'yard'
    if (d.gates.find((g) => g.id === id)) return 'gate'
    if (d.events.find((e) => e.id === id)) return 'event'
    if (id === d.port.id) return 'port'
    return null
  },

  getEntityPosition: (id: string) => {
    const d = get().portData
    const v = d.vessels.find((v) => v.id === id)
    if (v) return v.position
    const t = d.terminals.find((t) => t.id === id)
    if (t) return t.position
    const b = d.berths.find((b) => b.id === id)
    if (b) return b.position
    const y = d.yardBlocks.find((y) => y.id === id)
    if (y) return y.position
    const g = d.gates.find((g) => g.id === id)
    if (g) return g.position
    return null
  },

  getRelatedEntities: (id: string) => {
    const d = get().portData
    const related = new Set<string>()
    d.relations.forEach((r) => {
      if (r.sourceId === id) related.add(r.targetId)
      if (r.targetId === id) related.add(r.sourceId)
    })
    d.events.forEach((e) => {
      if (e.targetId === id || e.relatedEntities.includes(id)) {
        related.add(e.id)
        related.add(e.targetId)
        e.relatedEntities.forEach((re) => related.add(re))
      }
    })
    related.delete(id)
    return Array.from(related)
  },

  getEventsForEntity: (id: string) => {
    const d = get().portData
    return d.events.filter(
      (e) => e.targetId === id || e.relatedEntities.includes(id)
    )
  },

  getVisibleVessels: () => {
    const s = get()
    if (!s.visibleEntityKinds.has('vessel')) return []
    const all = s.timeFilterEnabled ? s.getInterpolatedVessels() : s.portData.vessels
    if (!s.timeFilterEnabled) return all
    return all.filter((v) => {
      const eta = new Date(v.eta).getTime()
      const etd = new Date(v.etd).getTime()
      return s.currentTime >= eta - 6 * 3600_000 && s.currentTime <= etd + 6 * 3600_000
    })
  },

  getInterpolatedVessels: () => {
    const s = get()
    const t = s.currentTime
    const data = s.portData
    return data.vessels.map<Vessel>((v) => {
      const berth = v.assignedBerth ? data.berths.find((b) => b.id === v.assignedBerth) : null
      const berthPos: [number, number, number] = berth
        ? [berth.position[0], 0, berth.position[2] - 3]
        : v.position
      const eta = new Date(v.eta).getTime()
      const etd = new Date(v.etd).getTime()
      const approachStart: [number, number, number] = [berthPos[0] + (v.id.charCodeAt(7) % 2 ? 8 : -8), 0, -38]
      const departEnd: [number, number, number] = [berthPos[0] + (v.id.charCodeAt(7) % 2 ? -10 : 10), 0, -42]

      let pos: [number, number, number]
      let status: Vessel['status']
      let rotation = v.rotation

      if (t < eta) {
        const span = 6 * 3600_000
        const k = Math.max(0, Math.min(1, (t - (eta - span)) / span))
        pos = lerp3(approachStart, berthPos, k)
        status = 'approaching'
        rotation = Math.atan2(berthPos[0] - approachStart[0], berthPos[2] - approachStart[2])
      } else if (t <= etd) {
        pos = berthPos
        status = 'berthed'
        rotation = 0
      } else {
        const span = 6 * 3600_000
        const k = Math.max(0, Math.min(1, (t - etd) / span))
        pos = lerp3(berthPos, departEnd, k)
        status = 'departing'
        rotation = Math.atan2(departEnd[0] - berthPos[0], departEnd[2] - berthPos[2])
      }
      return { ...v, position: pos, rotation, status }
    })
  },

  getVisibleEvents: () => {
    const s = get()
    if (!s.visibleEntityKinds.has('event')) return []
    if (!s.timeFilterEnabled) return s.portData.events
    return s.portData.events.filter((e) => new Date(e.timestamp).getTime() <= s.currentTime)
  },
}))
