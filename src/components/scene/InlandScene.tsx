import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { inlandNodes, inlandLinks, type InlandNode } from '../../data/inlandData'

function nodeColor(kind: InlandNode['kind']): string {
  switch (kind) {
    case 'port': return '#f59e0b'
    case 'icd': return '#3b82f6'
    case 'rail': return '#a78bfa'
    case 'cy': return '#10b981'
  }
}

function nodeIcon(kind: InlandNode['kind']): string {
  switch (kind) {
    case 'port': return '⚓'
    case 'icd': return '📦'
    case 'rail': return '🚆'
    case 'cy': return '🏬'
  }
}

function NodeMarker({ node }: { node: InlandNode }) {
  const [hovered, setHovered] = useState(false)
  const setViewMode = useStore((s) => s.setViewMode)
  const color = nodeColor(node.kind)
  const isPort = node.kind === 'port' && node.id === 'in_busan'

  return (
    <group position={node.position}>
      <mesh
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          if (isPort) setViewMode('port')
        }}
      >
        <cylinderGeometry args={[0.6, 0.6, 0.8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.3} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html position={[0, 1.4, 0]} center distanceFactor={28}>
        <div style={{
          background: 'rgba(15,23,42,0.92)',
          border: `1px solid ${color}`,
          borderRadius: 6,
          padding: '3px 7px',
          color: '#e2e8f0',
          fontSize: 10,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          <span style={{ marginRight: 4 }}>{nodeIcon(node.kind)}</span>
          <span style={{ fontWeight: 600 }}>{node.name}</span>
          {isPort && <div style={{ color: '#f59e0b', fontSize: 9 }}>→ Port View</div>}
        </div>
      </Html>
    </group>
  )
}

function LinkLine({ from, to, mode, flowTph }: { from: [number, number, number]; to: [number, number, number]; mode: 'truck' | 'rail'; flowTph: number }) {
  const color = mode === 'rail' ? '#a78bfa' : '#10b981'

  const lineObject = useMemo(() => {
    const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)]
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })
    return new THREE.Line(geom, mat)
  }, [from, to, color])

  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = Math.max(2, Math.floor(flowTph / 15))
  const offsets = useMemo(() => Array.from({ length: count }, (_, i) => i / count), [count])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    const speed = mode === 'rail' ? 0.06 : 0.04
    const dx = to[0] - from[0]
    const dy = to[1] - from[1]
    const dz = to[2] - from[2]
    offsets.forEach((off, i) => {
      const tt = (clock.elapsedTime * speed + off) % 1
      m.makeTranslation(from[0] + dx * tt, from[1] + dy * tt + 0.3, from[2] + dz * tt)
      mesh.setMatrixAt(i, m)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <primitive object={lineObject} />
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.35, 0.18, 0.18]} />
        <meshBasicMaterial color={color} />
      </instancedMesh>
    </>
  )
}

export function InlandScene() {
  const selectEntity = useStore((s) => s.selectEntity)

  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      onPointerMissed={() => selectEntity(null)}
      onCreated={({ scene }) => { scene.background = new THREE.Color('#08120a') }}
    >
      <PerspectiveCamera makeDefault position={[10, 35, 30]} fov={50} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.05}
        minDistance={10}
        maxDistance={100}
        target={[-12, 0, -12]}
      />

      <ambientLight intensity={0.6} />
      <directionalLight position={[20, 40, 10]} intensity={1.0} />
      <hemisphereLight args={['#16341e', '#020617', 0.5]} />
      <Stars radius={150} depth={60} count={1500} factor={3} saturation={0.3} fade speed={0.3} />
      <fog attach="fog" args={['#08120a', 60, 180]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, -0.05, -12]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0d1f12" roughness={0.95} />
      </mesh>
      <gridHelper args={[80, 32, '#1f3826', '#142b18']} position={[-12, 0, -12]} />

      {inlandLinks.map((l) => {
        const f = inlandNodes.find((n) => n.id === l.fromId)
        const t = inlandNodes.find((n) => n.id === l.toId)
        if (!f || !t) return null
        return <LinkLine key={l.id} from={f.position} to={t.position} mode={l.mode} flowTph={l.flowTph} />
      })}

      {inlandNodes.map((n) => <NodeMarker key={n.id} node={n} />)}
    </Canvas>
  )
}
