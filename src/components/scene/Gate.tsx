import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { Gate as GateType } from '../../types'

function getGateColor(status: string): string {
  switch (status) {
    case 'congested': return '#f59e0b'
    case 'closed': return '#ef4444'
    default: return '#10b981'
  }
}

export function GateEntry({ gate }: { gate: GateType }) {
  const { selectedEntity, selectEntity, hoverEntity, showLabels } = useStore()
  const [hovered, setHovered] = useState(false)
  const pulseRef = useRef<THREE.Mesh>(null)
  const isSelected = selectedEntity?.id === gate.id

  useFrame(({ clock }) => {
    if (pulseRef.current && gate.status === 'congested') {
      const scale = 1 + Math.sin(clock.elapsedTime * 3) * 0.2
      pulseRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group position={gate.position}>
      <mesh
        onClick={(e) => { e.stopPropagation(); selectEntity({ id: gate.id, type: 'gate' }) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); hoverEntity({ id: gate.id, type: 'gate' }) }}
        onPointerLeave={() => { setHovered(false); hoverEntity(null) }}
      >
        <boxGeometry args={[2, 1.5, 1]} />
        <meshStandardMaterial
          color={isSelected ? '#60a5fa' : hovered ? '#64748b' : getGateColor(gate.status)}
          roughness={0.5}
        />
      </mesh>

      {gate.status === 'congested' && (
        <mesh ref={pulseRef} position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
        </mesh>
      )}

      {showLabels && (
        <Html position={[0, 2.5, 0]} center distanceFactor={30}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: `1px solid ${getGateColor(gate.status)}`,
            borderRadius: 6,
            padding: '3px 8px',
            color: '#e2e8f0',
            fontSize: 10,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            <div style={{ fontWeight: 600 }}>Gate {gate.id.split('_')[1]}</div>
            <div>Queue: {gate.queueLength} | Wait: {gate.avgWaitMinutes}m</div>
          </div>
        </Html>
      )}
    </group>
  )
}
