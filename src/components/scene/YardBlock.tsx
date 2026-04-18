import { useState, useRef } from 'react'
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

export function YardArea({ yard }: { yard: YardBlockType }) {
  const { selectedEntity, selectEntity, hoverEntity, showLabels, overlayMode } = useStore()
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const isSelected = selectedEntity?.id === yard.id

  const height = 0.2 + yard.utilization * 1.5

  useFrame(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      const color = overlayMode === 'congestion'
        ? getUtilizationColor(yard.utilization)
        : isSelected ? '#60a5fa' : hovered ? '#4a5568' : '#374151'
      mat.color.lerp(new THREE.Color(color), 0.1)
    }
  })

  return (
    <group position={yard.position}>
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={(e) => { e.stopPropagation(); selectEntity({ id: yard.id, type: 'yard' }) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); hoverEntity({ id: yard.id, type: 'yard' }) }}
        onPointerLeave={() => { setHovered(false); hoverEntity(null) }}
      >
        <boxGeometry args={[yard.size[0], height, yard.size[1]]} />
        <meshStandardMaterial
          color="#374151"
          roughness={0.7}
          transparent
          opacity={0.85}
        />
      </mesh>

      {(overlayMode === 'congestion' || isSelected) && (
        <mesh position={[0, height + 0.05, 0]}>
          <boxGeometry args={[yard.size[0], 0.05, yard.size[1]]} />
          <meshBasicMaterial
            color={getUtilizationColor(yard.utilization)}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {showLabels && (hovered || isSelected) && (
        <Html position={[0, height + 1, 0]} center distanceFactor={30}>
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
