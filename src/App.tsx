import { useEffect, lazy, Suspense } from 'react'
import { PortScene } from './components/scene/PortScene'
import { InfoPanel } from './components/ui/InfoPanel'
import { ControlPanel } from './components/ui/ControlPanel'
import { StatusBar } from './components/ui/StatusBar'
import { TimelinePanel } from './components/ui/TimelinePanel'
import { FilterPanel } from './components/ui/FilterPanel'
import { TopBar } from './components/ui/TopBar'
import { useStore } from './store/useStore'

const WorldScene = lazy(() => import('./components/scene/WorldScene').then((m) => ({ default: m.WorldScene })))
const InlandScene = lazy(() => import('./components/scene/InlandScene').then((m) => ({ default: m.InlandScene })))
const KnowledgeGraph = lazy(() => import('./components/ui/KnowledgeGraph').then((m) => ({ default: m.KnowledgeGraph })))

function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
      <div className="text-slate-400 text-sm animate-pulse">Loading scene…</div>
    </div>
  )
}

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
        case 'W': {
          const order: Array<'port' | 'world' | 'inland'> = ['port', 'world', 'inland']
          const i = order.indexOf(s.viewMode)
          s.setViewMode(order[(i + 1) % order.length])
          break
        }
        case 'i':
        case 'I':
          s.setViewMode('inland')
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
      {viewMode === 'world' ? (
        <Suspense fallback={<SceneFallback />}><WorldScene /></Suspense>
      ) : viewMode === 'inland' ? (
        <Suspense fallback={<SceneFallback />}><InlandScene /></Suspense>
      ) : (
        <PortScene />
      )}
      <TopBar />
      <StatusBar />
      <InfoPanel />
      {viewMode === 'port' && <ControlPanel />}
      {viewMode === 'port' && <FilterPanel />}
      {viewMode === 'port' && <TimelinePanel />}
      <Suspense fallback={null}><KnowledgeGraph /></Suspense>
    </div>
  )
}
