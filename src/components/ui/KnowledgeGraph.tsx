import { useMemo, useRef, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { EntityType } from '../../types'

const TYPE_COLORS: Record<string, string> = {
  port: '#8b5cf6',
  vessel: '#3b82f6',
  terminal: '#10b981',
  berth: '#f59e0b',
  yard: '#06b6d4',
  gate: '#ec4899',
  event: '#ef4444',
  container: '#a78bfa',
  emission: '#f97316',
}

interface GraphNode {
  id: string
  type: string
  label: string
  position: [number, number, number]
}

interface GraphEdge {
  sourcePos: [number, number, number]
  targetPos: [number, number, number]
  type: string
}

export function KnowledgeGraph() {
  const { showGraphView, toggleGraphView, portData, selectedEntity, getEntityName } = useStore()

  const { nodes, edges } = useMemo(() => {
    const nodeList: GraphNode[] = []
    const edgeList: GraphEdge[] = []
    const nodeMap = new Map<string, GraphNode>()

    const centerEntity = selectedEntity?.id || 'port_busan'

    const addNode = (id: string, type: string) => {
      if (nodeMap.has(id)) return nodeMap.get(id)!
      const angle = nodeMap.size * (2.4 + Math.random() * 0.5)
      const radius = type === 'port' ? 0 : 4 + Math.random() * 4
      const node: GraphNode = {
        id,
        type,
        label: getEntityName(id),
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 3,
          Math.sin(angle) * radius,
        ],
      }
      nodeMap.set(id, node)
      nodeList.push(node)
      return node
    }

    addNode('port_busan', 'port')
    portData.terminals.forEach((t) => addNode(t.id, 'terminal'))
    portData.vessels.forEach((v) => addNode(v.id, 'vessel'))

    if (selectedEntity) {
      portData.berths.forEach((b) => addNode(b.id, 'berth'))
      portData.gates.forEach((g) => addNode(g.id, 'gate'))
      const relEvents = portData.events.filter(
        (e) => e.targetId === centerEntity || e.relatedEntities.includes(centerEntity)
      )
      relEvents.forEach((e) => addNode(e.id, 'event'))
    }

    portData.relations.forEach((rel) => {
      const src = nodeMap.get(rel.sourceId)
      const tgt = nodeMap.get(rel.targetId)
      if (src && tgt) {
        edgeList.push({ sourcePos: src.position, targetPos: tgt.position, type: rel.type })
      }
    })

    return { nodes: nodeList, edges: edgeList }
  }, [portData, selectedEntity, getEntityName])

  if (!showGraphView) return null

  return (
    <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm">
      <button
        onClick={toggleGraphView}
        className="absolute top-4 right-4 z-30 bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
      >
        ← Back to 3D Port
      </button>
      <div className="absolute top-4 left-4 z-30 bg-slate-900/90 border border-slate-700/50 rounded-xl p-4">
        <h3 className="text-sm font-bold text-white mb-2">Knowledge Graph</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              {type}
            </div>
          ))}
        </div>
      </div>
      <Canvas>
        <OrbitControls enablePan enableZoom enableRotate />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {edges.map((edge, i) => (
          <GraphEdgeLine key={i} from={edge.sourcePos} to={edge.targetPos} />
        ))}
        {nodes.map((node) => (
          <GraphNodeSphere key={node.id} node={node} />
        ))}
      </Canvas>
    </div>
  )
}

function GraphNodeSphere({ node }: { node: GraphNode }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { selectEntity } = useStore()
  const color = TYPE_COLORS[node.type] || '#64748b'
  const size = node.type === 'port' ? 0.6 : node.type === 'event' ? 0.25 : 0.35

  const handleClick = useCallback(() => {
    const typeMap: Record<string, EntityType> = {
      port: 'port',
      vessel: 'vessel',
      terminal: 'terminal',
      berth: 'berth',
      yard: 'yard',
      gate: 'gate',
      event: 'event',
      container: 'container',
    }
    const entityType = typeMap[node.type]
    if (entityType) selectEntity({ id: node.id, type: entityType })
  }, [node, selectEntity])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = node.position[1] + Math.sin(clock.elapsedTime + node.position[0]) * 0.1
    }
  })

  return (
    <group position={node.position}>
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <Html center distanceFactor={15}>
        <div style={{
          color: '#e2e8f0',
          fontSize: 9,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          textShadow: '0 0 4px rgba(0,0,0,0.8)',
        }}>
          {node.label}
        </div>
      </Html>
    </group>
  )
}

function GraphEdgeLine({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [from, to])

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#334155" transparent opacity={0.4} />
    </line>
  )
}
