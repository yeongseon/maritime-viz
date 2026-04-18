import { create } from 'zustand'
import type { SelectedEntity, EntityType } from '../types'
import { busanPortData } from '../data/portData'

type OverlayMode = 'none' | 'congestion' | 'carbon' | 'delay'

interface AppState {
  // Data
  portData: typeof busanPortData

  // Selection
  selectedEntity: SelectedEntity | null
  hoveredEntity: SelectedEntity | null
  selectEntity: (entity: SelectedEntity | null) => void
  hoverEntity: (entity: SelectedEntity | null) => void

  // Overlay
  overlayMode: OverlayMode
  setOverlayMode: (mode: OverlayMode) => void

  // View
  showRelations: boolean
  toggleRelations: () => void
  showLabels: boolean
  toggleLabels: () => void

  // Graph view
  showGraphView: boolean
  toggleGraphView: () => void

  // Helpers
  getEntityName: (id: string) => string
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
