import { useState, useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { Vessel as VesselType } from '../../types'

function getVesselStatusColor(status: string): string {
  switch (status) {
    case 'berthed': return '#3b82f6'
    case 'approaching': return '#10b981'
    case 'waiting': return '#f59e0b'
    case 'departing': return '#8b5cf6'
    default: return '#64748b'
  }
}

function VesselHull({ length, color }: { length: number; color: string }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const w = length
    const h = w * 0.25
    s.moveTo(-w / 2, -h / 2)
    s.lineTo(w / 2 - h, -h / 2)
    s.lineTo(w / 2, 0)
    s.lineTo(w / 2 - h, h / 2)
    s.lineTo(-w / 2, h / 2)
    s.closePath()
    return s
  }, [length])

  const extrudeSettings = useMemo(() => ({
    depth: 0.6,
    bevelEnabled: false,
  }), [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
    </mesh>
  )
}

function ContainersOnDeck({ vesselLength, loadRatio }: { vesselLength: number; loadRatio: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const palette = useMemo(() => [
    new THREE.Color('#ef4444'), new THREE.Color('#3b82f6'), new THREE.Color('#10b981'),
    new THREE.Color('#f59e0b'), new THREE.Color('#8b5cf6'), new THREE.Color('#06b6d4'),
  ], [])
  const positions = useMemo(() => {
    const result: Array<[number, number, number]> = []
    const cols = Math.floor(vesselLength * 0.6)
    const rows = 2
    const filled = Math.floor(cols * rows * loadRatio)
    let count = 0
    for (let r = 0; r < rows && count < filled; r++) {
      for (let c = 0; c < cols && count < filled; c++) {
        result.push([
          -vesselLength * 0.25 + c * 0.8,
          0.6 + r * 0.35,
          -0.3 + (r % 2) * 0.15,
        ])
        count++
      }
    }
    return result
  }, [vesselLength, loadRatio])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    positions.forEach((p, i) => {
      m.makeTranslation(p[0], p[1], p[2])
      mesh.setMatrixAt(i, m)
      mesh.setColorAt(i, palette[i % palette.length])
    })
    mesh.count = positions.length
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [positions, palette])

  if (positions.length === 0) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, Math.max(1, positions.length)]}>
      <boxGeometry args={[0.7, 0.3, 0.5]} />
      <meshStandardMaterial roughness={0.6} />
    </instancedMesh>
  )
}

export function VesselModel({ vessel }: { vessel: VesselType }) {
  const { selectedEntity, selectEntity, hoverEntity, showLabels, overlayMode } = useStore()
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const isSelected = selectedEntity?.id === vessel.id

  const vesselLength = Math.min(3 + vessel.capacity / 3000, 7)
  const statusColor = getVesselStatusColor(vessel.status)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      if (vessel.status === 'approaching') {
        groupRef.current.position.z += Math.sin(clock.elapsedTime * 0.5) * 0.002
      }
      if (vessel.status === 'waiting') {
        groupRef.current.position.y = vessel.position[1] + Math.sin(clock.elapsedTime * 0.8) * 0.05
      }
    }
  })

  const showCarbon = overlayMode === 'carbon' && vessel.co2EmissionRate > 2.5

  return (
    <group
      ref={groupRef}
      position={vessel.position}
      rotation={[0, vessel.rotation, 0]}
    >
      <group
        onClick={(e) => { e.stopPropagation(); selectEntity({ id: vessel.id, type: 'vessel' }) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); hoverEntity({ id: vessel.id, type: 'vessel' }) }}
        onPointerLeave={() => { setHovered(false); hoverEntity(null) }}
      >
        <VesselHull length={vesselLength} color={isSelected ? '#60a5fa' : hovered ? '#94a3b8' : statusColor} />
        <ContainersOnDeck vesselLength={vesselLength} loadRatio={vessel.currentLoad / vessel.capacity} />
      </group>

      {isSelected && (
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[vesselLength * 0.6, 16, 16]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} />
        </mesh>
      )}

      {showCarbon && (
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[vessel.co2EmissionRate * 0.4, 16, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.15} />
        </mesh>
      )}

      {showLabels && (hovered || isSelected) && (
        <Html position={[0, 2.5, 0]} center distanceFactor={30}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: `1px solid ${statusColor}`,
            borderRadius: 6,
            padding: '6px 10px',
            color: '#e2e8f0',
            fontSize: 11,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            minWidth: 120,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{vessel.name}</div>
            <div style={{ color: statusColor, fontSize: 10 }}>{vessel.status.toUpperCase()}</div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
              {vessel.currentLoad.toLocaleString()}/{vessel.capacity.toLocaleString()} TEU
            </div>
            {overlayMode === 'carbon' && (
              <div style={{ fontSize: 10, color: '#ef4444', marginTop: 2 }}>
                CO2: {vessel.co2EmissionRate} t/hr
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}
