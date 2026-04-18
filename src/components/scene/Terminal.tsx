import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { Terminal as TerminalType } from '../../types'

function getCongestionColor(level: string): string {
  switch (level) {
    case 'critical': return '#ef4444'
    case 'high': return '#f59e0b'
    case 'medium': return '#3b82f6'
    default: return '#10b981'
  }
}

export function TerminalBlock({ terminal }: { terminal: TerminalType }) {
  const { selectedEntity, selectEntity, hoverEntity, showLabels, overlayMode } = useStore()
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const isSelected = selectedEntity?.id === terminal.id

  const baseColor = overlayMode === 'congestion'
    ? getCongestionColor(terminal.congestionLevel)
    : '#334155'

  useFrame(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      const target = isSelected ? '#60a5fa' : hovered ? '#475569' : baseColor
      mat.color.lerp(new THREE.Color(target), 0.1)
    }
  })

  return (
    <group position={terminal.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); selectEntity({ id: terminal.id, type: 'terminal' }) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); hoverEntity({ id: terminal.id, type: 'terminal' }) }}
        onPointerLeave={() => { setHovered(false); hoverEntity(null) }}
      >
        <boxGeometry args={[terminal.size[0], 0.5, terminal.size[1]]} />
        <meshStandardMaterial color={baseColor} roughness={0.6} transparent opacity={0.9} />
      </mesh>

      {isSelected && (
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[terminal.size[0] + 0.3, 0.52, terminal.size[1] + 0.3]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
        </mesh>
      )}

      {showLabels && (
        <Html position={[0, 2, 0]} center distanceFactor={40}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: `1px solid ${getCongestionColor(terminal.congestionLevel)}`,
            borderRadius: 6,
            padding: '4px 10px',
            color: '#e2e8f0',
            fontSize: 11,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            <div style={{ fontWeight: 600 }}>{terminal.name}</div>
            <div style={{ fontSize: 10, color: getCongestionColor(terminal.congestionLevel) }}>
              Yard: {Math.round(terminal.yardUtilization * 100)}% | Queue: {terminal.gateQueueLength}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
