import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { worldPorts, worldRoutes, lonLatToScene, WORLD_BOUNDS } from '../../data/worldData'
import { t } from '../../i18n'

function GlobeBase() {
  const { minX, maxX, minZ, maxZ } = WORLD_BOUNDS
  const w = maxX - minX
  const d = maxZ - minZ
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(minX + maxX) / 2, -0.05, (minZ + maxZ) / 2]} receiveShadow>
        <planeGeometry args={[w * 1.05, d * 1.2]} />
        <meshStandardMaterial color="#0c1424" roughness={0.95} />
      </mesh>
      <gridHelper args={[Math.max(w, d) * 1.1, 36, '#1e293b', '#16213a']} position={[(minX + maxX) / 2, 0, (minZ + maxZ) / 2]} />
    </>
  )
}

function PortNode({ port }: { port: typeof worldPorts[number] }) {
  const [hovered, setHovered] = useState(false)
  const language = useStore((s) => s.language)
  const pos = lonLatToScene(port.lon, port.lat)
  const color = port.isHome ? '#f59e0b' : '#3b82f6'
  const setViewMode = useStore((s) => s.setViewMode)
  const triggerCamera = useStore((s) => s.triggerCamera)

  return (
    <group position={pos}>
      <mesh
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          if (port.isHome) {
            setViewMode('port')
            triggerCamera('reset')
          }
        }}
      >
        <sphereGeometry args={[port.isHome ? 0.7 : 0.45, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1.2 : 0.6} />
      </mesh>
      <mesh>
        <sphereGeometry args={[port.isHome ? 1.4 : 0.9, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      {(hovered || port.isHome) && (
        <Html position={[0, 1.2, 0]} center distanceFactor={40}>
          <div style={{
            background: 'rgba(15,23,42,0.95)',
            border: `1px solid ${color}`,
            borderRadius: 6,
            padding: '4px 8px',
            color: '#e2e8f0',
            fontSize: 10,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            <div style={{ fontWeight: 700 }}>{port.name}</div>
            <div style={{ color: '#94a3b8', fontSize: 9 }}>{port.country}</div>
            {port.isHome && <div style={{ color: '#f59e0b', fontSize: 9, marginTop: 2 }}>{t('view_port', language)} →</div>}
          </div>
        </Html>
      )}
    </group>
  )
}

function curveFor(from: [number, number, number], to: [number, number, number]): THREE.QuadraticBezierCurve3 {
  const start = new THREE.Vector3(...from)
  const end = new THREE.Vector3(...to)
  const mid = start.clone().add(end).multiplyScalar(0.5)
  const dist = start.distanceTo(end)
  mid.y += Math.min(dist * 0.18, 6)
  return new THREE.QuadraticBezierCurve3(start, mid, end)
}

function RouteLine({ route }: { route: typeof worldRoutes[number] }) {
  const from = worldPorts.find((p) => p.id === route.fromId)
  const to = worldPorts.find((p) => p.id === route.toId)
  const curve = useMemo(() => {
    if (!from || !to) return null
    return curveFor(lonLatToScene(from.lon, from.lat), lonLatToScene(to.lon, to.lat))
  }, [from, to])

  const lineObject = useMemo(() => {
    if (!curve) return null
    const points = curve.getPoints(48)
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({ color: '#3b82f6', transparent: true, opacity: 0.35 })
    return new THREE.Line(geom, mat)
  }, [curve])

  if (!lineObject || !curve) return null

  return (
    <>
      <primitive object={lineObject} />
      <RouteVessels curve={curve} count={route.vesselCount} />
    </>
  )
}

function RouteVessels({ curve, count }: { curve: THREE.QuadraticBezierCurve3; count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const offsets = useMemo(() => Array.from({ length: count }, (_, i) => i / count), [count])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    const speed = 0.04
    offsets.forEach((off, i) => {
      const t = (clock.elapsedTime * speed + off) % 1
      const p = curve.getPoint(t)
      m.makeTranslation(p.x, p.y, p.z)
      mesh.setMatrixAt(i, m)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.18, 8, 8]} />
      <meshBasicMaterial color="#fbbf24" />
    </instancedMesh>
  )
}

export function WorldScene() {
  const selectEntity = useStore((s) => s.selectEntity)
  const center: [number, number, number] = [0, 0, 0]

  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      onPointerMissed={() => selectEntity(null)}
      onCreated={({ scene }) => { scene.background = new THREE.Color('#050810') }}
    >
      <PerspectiveCamera makeDefault position={[0, 60, 70]} fov={45} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.05}
        minDistance={20}
        maxDistance={250}
        target={center}
      />

      <ambientLight intensity={0.6} />
      <directionalLight position={[40, 60, 20]} intensity={1.0} />
      <hemisphereLight args={['#1e3a8a', '#020617', 0.6]} />
      <Stars radius={200} depth={80} count={3000} factor={4} saturation={0.4} fade speed={0.3} />
      <fog attach="fog" args={['#050810', 120, 320]} />

      <GlobeBase />

      {worldRoutes.map((r) => <RouteLine key={r.id} route={r} />)}
      {worldPorts.map((p) => <PortNode key={p.id} port={p} />)}
    </Canvas>
  )
}
