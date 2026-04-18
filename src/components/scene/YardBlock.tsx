import { useState, useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { YardBlock as YardBlockType } from '../../types'

function getUtilizationColor(utilization: number): string {
  if (utilization > 0.85) return '#ef4444'
  if (utilization > 0.7) return '#f59e0b'
  if (utilization > 0.5) return '#3b82f6'
  return '#10b981'
}

const STACK_PALETTE = [
  new THREE.Color('#ef4444'), new THREE.Color('#3b82f6'), new THREE.Color('#10b981'),
  new THREE.Color('#f59e0b'), new THREE.Color('#8b5cf6'), new THREE.Color('#06b6d4'),
  new THREE.Color('#e879f9'), new THREE.Color('#fbbf24'),
]

function ContainerStacks({ size, utilization }: { size: [number, number]; utilization: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const [w, d] = size
  const cellW = 0.7
  const cellD = 1.2
  const cellH = 0.35
  const maxStack = 4
  const cols = Math.max(1, Math.floor(w / cellW))
  const rows = Math.max(1, Math.floor(d / cellD))
  const totalCells = cols * rows
  const filledCells = Math.floor(totalCells * utilization)

  const positions = useMemo(() => {
    const result: Array<[number, number, number]> = []
    for (let i = 0; i < filledCells; i++) {
      const c = i % cols
      const r = Math.floor(i / cols)
      const x = -w / 2 + cellW / 2 + c * cellW
      const z = -d / 2 + cellD / 2 + r * cellD
      const stackHeight = 1 + Math.floor(((i * 13) % 100) / 100 * maxStack)
      for (let s = 0; s < stackHeight; s++) {
        result.push([x, cellH / 2 + s * cellH, z])
      }
    }
    return result
  }, [cols, w, d, filledCells])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    positions.forEach((p, i) => {
      m.makeTranslation(p[0], p[1], p[2])
      mesh.setMatrixAt(i, m)
      mesh.setColorAt(i, STACK_PALETTE[i % STACK_PALETTE.length])
    })
    mesh.count = positions.length
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [positions])

  if (positions.length === 0) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, Math.max(1, positions.length)]}>
      <boxGeometry args={[cellW * 0.85, cellH * 0.9, cellD * 0.55]} />
      <meshStandardMaterial roughness={0.6} metalness={0.05} />
    </instancedMesh>
  )
}

export function YardArea({ yard }: { yard: YardBlockType }) {
  const { selectedEntity, selectEntity, hoverEntity, showLabels, overlayMode } = useStore()
  const [hovered, setHovered] = useState(false)
  const padRef = useRef<THREE.Mesh>(null)
  const isSelected = selectedEntity?.id === yard.id

  useFrame(() => {
    if (padRef.current) {
      const mat = padRef.current.material as THREE.MeshStandardMaterial
      const color = overlayMode === 'congestion'
        ? getUtilizationColor(yard.utilization)
        : isSelected ? '#60a5fa' : hovered ? '#475569' : '#1e293b'
      mat.color.lerp(new THREE.Color(color), 0.1)
    }
  })

  return (
    <group position={yard.position}>
      <mesh
        ref={padRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => { e.stopPropagation(); selectEntity({ id: yard.id, type: 'yard' }) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); hoverEntity({ id: yard.id, type: 'yard' }) }}
        onPointerLeave={() => { setHovered(false); hoverEntity(null) }}
      >
        <planeGeometry args={[yard.size[0], yard.size[1]]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} transparent opacity={0.85} />
      </mesh>

      <ContainerStacks size={yard.size} utilization={yard.utilization} />

      {(overlayMode === 'congestion' || isSelected) && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[yard.size[0] + 0.2, yard.size[1] + 0.2]} />
          <meshBasicMaterial
            color={getUtilizationColor(yard.utilization)}
            transparent
            opacity={0.25}
          />
        </mesh>
      )}

      {showLabels && (hovered || isSelected) && (
        <Html position={[0, 2.5, 0]} center distanceFactor={30}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: `1px solid ${getUtilizationColor(yard.utilization)}`,
            borderRadius: 6,
            padding: '3px 8px',
            color: '#e2e8f0',
            fontSize: 10,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            <div style={{ fontWeight: 600 }}>{yard.id}</div>
            <div>{yard.containerCount}/{yard.maxCapacity} ({Math.round(yard.utilization * 100)}%)</div>
          </div>
        </Html>
      )}
    </group>
  )
}
