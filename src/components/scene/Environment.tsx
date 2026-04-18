import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Water() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.displacementScale = 0.1 + Math.sin(clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[5, -0.3, -20]}>
      <planeGeometry args={[120, 60, 64, 64]} />
      <meshStandardMaterial
        color="#0c3d6e"
        transparent
        opacity={0.85}
        roughness={0.3}
        metalness={0.6}
      />
    </mesh>
  )
}

export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, -0.05, 5]}>
      <planeGeometry args={[120, 40]} />
      <meshStandardMaterial color="#2d3748" roughness={0.9} />
    </mesh>
  )
}

export function Quay() {
  return (
    <mesh position={[5, 0.1, -5.5]}>
      <boxGeometry args={[80, 0.3, 1.5]} />
      <meshStandardMaterial color="#64748b" roughness={0.7} />
    </mesh>
  )
}
