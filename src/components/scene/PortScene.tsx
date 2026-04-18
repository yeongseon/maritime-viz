import { useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { Water, Ground, Quay } from './Environment'
import { TerminalBlock } from './Terminal'
import { BerthSlot } from './Berth'
import { YardArea } from './YardBlock'
import { GateEntry } from './Gate'
import { VesselModel } from './Vessel'
import { RelationLines } from './RelationLines'
import { EventMarkers } from './EventMarkers'

const DEFAULT_CAM_POS: [number, number, number] = [0, 30, 40]
const DEFAULT_TARGET: [number, number, number] = [5, 0, 0]
const TOP_CAM_POS: [number, number, number] = [5, 70, 0.01]
const SIDE_CAM_POS: [number, number, number] = [5, 8, 55]

function CameraController({ controlsRef }: { controlsRef: React.MutableRefObject<OrbitControlsImpl | null> }) {
  const { camera } = useThree()
  const cameraCommand = useStore((s) => s.cameraCommand)

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const { preset, target } = cameraCommand

    if (preset === 'reset') {
      camera.position.set(...DEFAULT_CAM_POS)
      controls.target.set(...DEFAULT_TARGET)
    } else if (preset === 'top') {
      camera.position.set(...TOP_CAM_POS)
      controls.target.set(5, 0, 0)
    } else if (preset === 'side') {
      camera.position.set(...SIDE_CAM_POS)
      controls.target.set(5, 0, 0)
    } else if (preset === 'focus' && target) {
      const [x, y, z] = target
      camera.position.set(x + 12, y + 14, z + 18)
      controls.target.set(x, y, z)
    }
    controls.update()
  }, [cameraCommand, camera, controlsRef])

  return null
}

function TimeTicker() {
  const lastRef = useRef<number | null>(null)
  useFrame(() => {
    const now = performance.now()
    const last = lastRef.current ?? now
    const dt = now - last
    lastRef.current = now
    if (dt > 0 && dt < 200) useStore.getState().tickTime(dt)
  })
  return null
}

export function PortScene() {
  const portData = useStore((s) => s.portData)
  const selectEntity = useStore((s) => s.selectEntity)
  const visibleEntityKinds = useStore((s) => s.visibleEntityKinds)
  const getVisibleVessels = useStore((s) => s.getVisibleVessels)
  const controlsRef = useRef<OrbitControlsImpl | null>(null)

  const visibleVessels = getVisibleVessels()
  const showTerminals = visibleEntityKinds.has('terminal')
  const showBerths = visibleEntityKinds.has('berth')
  const showYards = visibleEntityKinds.has('yard')
  const showGates = visibleEntityKinds.has('gate')

  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      onPointerMissed={() => selectEntity(null)}
      onCreated={({ scene }) => { scene.background = new THREE.Color('#0a0e1a') }}
    >
      <PerspectiveCamera makeDefault position={DEFAULT_CAM_POS} fov={50} />
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.1}
        minDistance={10}
        maxDistance={120}
        target={DEFAULT_TARGET}
      />
      <CameraController controlsRef={controlsRef} />
      <TimeTicker />

      <ambientLight intensity={0.4} />
      <directionalLight position={[30, 40, 20]} intensity={1.2} castShadow />
      <directionalLight position={[-20, 30, -10]} intensity={0.3} color="#6366f1" />
      <hemisphereLight args={['#1e3a5f', '#0a0e1a', 0.5]} />

      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0.5} fade speed={0.5} />
      <fog attach="fog" args={['#0a0e1a', 60, 160]} />

      <Water />
      <Ground />
      <Quay />

      {showTerminals && portData.terminals.map((t) => (
        <TerminalBlock key={t.id} terminal={t} />
      ))}
      {showBerths && portData.berths.map((b) => (
        <BerthSlot key={b.id} berth={b} />
      ))}
      {showYards && portData.yardBlocks.map((y) => (
        <YardArea key={y.id} yard={y} />
      ))}
      {showGates && portData.gates.map((g) => (
        <GateEntry key={g.id} gate={g} />
      ))}
      {visibleVessels.map((v) => (
        <VesselModel key={v.id} vessel={v} />
      ))}

      <RelationLines />
      <EventMarkers />
    </Canvas>
  )
}
