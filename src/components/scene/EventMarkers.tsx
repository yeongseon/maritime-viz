import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#ef4444'
    case 'warning': return '#f59e0b'
    default: return '#3b82f6'
  }
}

function getEventIcon(type: string): string {
  switch (type) {
    case 'delay': return '⏱'
    case 'congestion': return '🚧'
    case 'weather': return '🌊'
    case 'equipment_failure': return '⚙'
    case 'emission_alert': return '💨'
    default: return '⚠'
  }
}

export function EventMarkers() {
  const { portData, overlayMode, getVisibleEvents } = useStore()
  const allVisible = getVisibleEvents()

  const visibleEvents = overlayMode === 'delay'
    ? allVisible.filter((e) => e.type === 'delay' || e.type === 'congestion')
    : overlayMode === 'carbon'
    ? allVisible.filter((e) => e.type === 'emission_alert')
    : allVisible.filter((e) => e.severity === 'critical')

  return (
    <group>
      {visibleEvents.map((event) => {
        const target = [
          ...portData.vessels,
          ...portData.terminals,
          ...portData.berths,
          ...portData.gates,
        ].find((e) => e.id === event.targetId)

        if (!target) return null

        return (
          <EventMarker
            key={event.id}
            position={target.position as [number, number, number]}
            severity={event.severity}
            type={event.type}
            description={event.description}
          />
        )
      })}
    </group>
  )
}

function EventMarker({
  position,
  severity,
  type,
  description,
}: {
  position: [number, number, number]
  severity: string
  type: string
  description: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const color = getSeverityColor(severity)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 4) * 0.3
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group position={[position[0], position[1] + 3, position[2]]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <Html center distanceFactor={25}>
        <div style={{
          background: `rgba(15, 23, 42, 0.95)`,
          border: `1px solid ${color}`,
          borderRadius: 6,
          padding: '4px 8px',
          color: '#e2e8f0',
          fontSize: 10,
          maxWidth: 180,
          pointerEvents: 'none',
          textAlign: 'center',
        }}>
          <div>{getEventIcon(type)} {type.replace('_', ' ').toUpperCase()}</div>
          <div style={{ color: '#94a3b8', marginTop: 2, lineHeight: 1.3 }}>{description.slice(0, 60)}...</div>
        </div>
      </Html>
    </group>
  )
}
