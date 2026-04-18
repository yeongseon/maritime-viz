import { create } from 'zustand'
import type { SelectedEntity, EntityType } from '../types'
import { busanPortData } from '../data/portData'

type OverlayMode = 'none' | 'congestion' | 'carbon' | 'delay'
export type CameraPreset = 'reset' | 'top' | 'side' | 'focus'

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

interface AppState {
  portData: typeof busanPortData

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

  getEntityName: (id: string) => string
  getEntityType: (id: string) => EntityType | null
  getEntityPosition: (id: string) => [number, number, number] | null
  getRelatedEntities: (id: string) => string[]
  getEventsForEntity: (id: string) => typeof busanPortData.events
}

export const useStore = create<AppState>((set, get) => ({
  portData: busanPortData,

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
    if (id === 'port_busan') return 'Busan Port'
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
    if (id === 'port_busan') return 'port'
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
}))
