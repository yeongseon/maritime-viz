import { PortScene } from './components/scene/PortScene'
import { InfoPanel } from './components/ui/InfoPanel'
import { ControlPanel } from './components/ui/ControlPanel'
import { StatusBar } from './components/ui/StatusBar'
import { KnowledgeGraph } from './components/ui/KnowledgeGraph'

export default function App() {
  return (
    <div className="relative w-full h-full">
      <PortScene />
      <StatusBar />
      <InfoPanel />
      <ControlPanel />
      <KnowledgeGraph />
    </div>
  )
}
