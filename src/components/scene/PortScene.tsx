import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei'
import { useStore } from '../../store/useStore'
import { Water, Ground, Quay } from './Environment'
import { TerminalBlock } from './Terminal'
import { BerthSlot } from './Berth'
import { YardArea } from './YardBlock'
import { GateEntry } from './Gate'
import { VesselModel } from './Vessel'
import { RelationLines } from './RelationLines'
import { EventMarkers } from './EventMarkers'

export function PortScene() {
  const { portData, selectEntity } = useStore()

  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      onPointerMissed={() => selectEntity(null)}
    >
      <PerspectiveCamera makeDefault position={[0, 30, 40]} fov={50} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.1}
        minDistance={10}
        maxDistance={80}
        target={[5, 0, 0]}
      />

      <ambientLight intensity={0.4} />
      <directionalLight position={[30, 40, 20]} intensity={1.2} castShadow />
      <directionalLight position={[-20, 30, -10]} intensity={0.3} color="#6366f1" />
      <hemisphereLight args={['#1e3a5f', '#0a0e1a', 0.5]} />

      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0.5} fade speed={0.5} />
      <fog attach="fog" args={['#0a0e1a', 60, 120]} />

      <Water />
      <Ground />
      <Quay />

      {portData.terminals.map((t) => (
        <TerminalBlock key={t.id} terminal={t} />
      ))}
      {portData.berths.map((b) => (
        <BerthSlot key={b.id} berth={b} />
      ))}
      {portData.yardBlocks.map((y) => (
        <YardArea key={y.id} yard={y} />
      ))}
      {portData.gates.map((g) => (
        <GateEntry key={g.id} gate={g} />
      ))}
      {portData.vessels.map((v) => (
        <VesselModel key={v.id} vessel={v} />
      ))}

      <RelationLines />
      <EventMarkers />
    </Canvas>
  )
}
