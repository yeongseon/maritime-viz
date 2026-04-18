import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export function RelationLines() {
  const { portData, selectedEntity, showRelations, getRelatedEntities } = useStore()

  const lines = useMemo(() => {
    if (!selectedEntity || !showRelations) return []

    const relatedIds = getRelatedEntities(selectedEntity.id)
    const allEntities = [
      ...portData.vessels.map((v) => ({ id: v.id, pos: v.position })),
      ...portData.terminals.map((t) => ({ id: t.id, pos: t.position })),
      ...portData.berths.map((b) => ({ id: b.id, pos: b.position })),
      ...portData.yardBlocks.map((y) => ({ id: y.id, pos: y.position })),
      ...portData.gates.map((g) => ({ id: g.id, pos: g.position })),
    ]

    const sourceEntity = allEntities.find((e) => e.id === selectedEntity.id)
    if (!sourceEntity) return []

    return relatedIds
      .map((rid) => {
        const target = allEntities.find((e) => e.id === rid)
        if (!target) return null
        return {
          id: `${selectedEntity.id}-${rid}`,
          from: sourceEntity.pos,
          to: target.pos,
        }
      })
      .filter(Boolean) as Array<{ id: string; from: [number, number, number]; to: [number, number, number] }>
  }, [selectedEntity, showRelations, portData, getRelatedEntities])

  if (lines.length === 0) return null

  return (
    <group>
      {lines.map((line) => (
        <RelationLine key={line.id} from={line.from} to={line.to} />
      ))}
    </group>
  )
}

function RelationLine({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const lineRef = useRef<THREE.Line>(null)
  const progressRef = useRef(0)

  const geometry = useMemo(() => {
    const mid: [number, number, number] = [
      (from[0] + to[0]) / 2,
      Math.max(from[1], to[1]) + 3,
      (from[2] + to[2]) / 2,
    ]
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...to)
    )
    const points = curve.getPoints(30)
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [from, to])

  useFrame(() => {
    progressRef.current += 0.01
    if (progressRef.current > 1) progressRef.current = 0
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#60a5fa" transparent opacity={0.5} linewidth={1} />
    </line>
  )
}
