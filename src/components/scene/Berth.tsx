import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { Berth as BerthType } from '../../types'

function getBerthStatusColor(status: string): string {
  switch (status) {
    case 'occupied': return '#f59e0b'
    case 'maintenance': return '#ef4444'
    default: return '#10b981'
  }
}

export function BerthSlot({ berth }: { berth: BerthType }) {
  const { selectedEntity, selectEntity, hoverEntity } = useStore()
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const isSelected = selectedEntity?.id === berth.id

  useFrame(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      const target = isSelected ? '#60a5fa' : hovered ? '#94a3b8' : getBerthStatusColor(berth.status)
      mat.color.lerp(new THREE.Color(target), 0.1)
    }
  })

  return (
    <group position={berth.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); selectEntity({ id: berth.id, type: 'berth' }) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); hoverEntity({ id: berth.id, type: 'berth' }) }}
        onPointerLeave={() => { setHovered(false); hoverEntity(null) }}
      >
        <boxGeometry args={[berth.length, 0.15, 2]} />
        <meshStandardMaterial color={getBerthStatusColor(berth.status)} roughness={0.5} />
      </mesh>

      {isSelected && (
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}
