import { useEffect } from 'react'
import { PortScene } from './components/scene/PortScene'
import { WorldScene } from './components/scene/WorldScene'
import { InfoPanel } from './components/ui/InfoPanel'
import { ControlPanel } from './components/ui/ControlPanel'
import { StatusBar } from './components/ui/StatusBar'
import { KnowledgeGraph } from './components/ui/KnowledgeGraph'
import { TimelinePanel } from './components/ui/TimelinePanel'
import { FilterPanel } from './components/ui/FilterPanel'
import { TopBar } from './components/ui/TopBar'
import { useStore } from './store/useStore'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export default function App() {
  const selectedEntity = useStore((s) => s.selectedEntity)
  const viewMode = useStore((s) => s.viewMode)
  const liveMode = useStore((s) => s.liveMode)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('selected')
    if (!id) return
    const { getEntityType, selectEntity, focusEntity } = useStore.getState()
    const type = getEntityType(id)
    if (type) {
      selectEntity({ id, type })
      focusEntity(id)
    }
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (selectedEntity) {
      url.searchParams.set('selected', selectedEntity.id)
    } else {
      url.searchParams.delete('selected')
    }
    window.history.replaceState(null, '', url.toString())
  }, [selectedEntity])

  useEffect(() => {
    if (!liveMode) return
    const id = window.setInterval(() => useStore.getState().applyLiveTick(), 5000)
    return () => window.clearInterval(id)
  }, [liveMode])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      const s = useStore.getState()
      switch (e.key) {
        case 'Escape':
          s.selectEntity(null)
          break
        case 'g':
        case 'G':
          s.toggleGraphView()
          break
        case 'l':
        case 'L':
          s.toggleLabels()
          break
        case 'e':
        case 'E':
          s.toggleRelations()
          break
        case 'r':
        case 'R':
          s.triggerCamera('reset')
          break
        case 't':
        case 'T':
          s.triggerCamera('top')
          break
        case 'y':
        case 'Y':
          s.triggerCamera('side')
          break
        case 'w':
        case 'W':
          s.setViewMode(s.viewMode === 'port' ? 'world' : 'port')
          break
        case 'm':
        case 'M':
          s.toggleLiveMode()
          break
        case 'k':
        case 'K':
          s.setLanguage(s.language === 'ko' ? 'en' : 'ko')
          break
        case '1':
          s.setOverlayMode('none')
          break
        case '2':
          s.setOverlayMode('congestion')
          break
        case '3':
          s.setOverlayMode('delay')
          break
        case '4':
          s.setOverlayMode('carbon')
          break
        case ' ':
          if (s.timeFilterEnabled) {
            e.preventDefault()
            s.togglePlaying()
          }
          break
        case 'f':
        case 'F':
          s.toggleTimeFilter()
          break
        case '/':
          e.preventDefault()
          document.getElementById('global-search')?.focus()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="relative w-full h-full">
      {viewMode === 'world' ? <WorldScene /> : <PortScene />}
      <TopBar />
      <StatusBar />
      <InfoPanel />
      {viewMode === 'port' && <ControlPanel />}
      {viewMode === 'port' && <FilterPanel />}
      {viewMode === 'port' && <TimelinePanel />}
      <KnowledgeGraph />
    </div>
  )
}
