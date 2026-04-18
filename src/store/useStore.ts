import { create } from 'zustand'
import type { SelectedEntity, EntityType, RelationType, PortData } from '../types'
import { busanPortData } from '../data/portData'

type OverlayMode = 'none' | 'congestion' | 'carbon' | 'delay'
export type CameraPreset = 'reset' | 'top' | 'side' | 'focus'
export type EntityKind = 'vessel' | 'terminal' | 'berth' | 'yard' | 'gate' | 'event'

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

interface AppState {
  portData: PortData
  isCustomData: boolean
  loadCustomData: (data: PortData) => void
  resetData: () => void

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
    if (!s.timeFilterEnabled) return s.portData.vessels
    return s.portData.vessels.filter((v) => {
      const eta = new Date(v.eta).getTime()
      const etd = new Date(v.etd).getTime()
      return s.currentTime >= eta - 6 * 3600_000 && s.currentTime <= etd + 6 * 3600_000
    })
  },

  getVisibleEvents: () => {
    const s = get()
    if (!s.visibleEntityKinds.has('event')) return []
    if (!s.timeFilterEnabled) return s.portData.events
    return s.portData.events.filter((e) => new Date(e.timestamp).getTime() <= s.currentTime)
  },
}))
