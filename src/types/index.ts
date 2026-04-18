// Maritime Logistics Ontology Types

// === Core Entity Types ===

export interface Port {
  id: string
  name: string
  nameKo: string
  position: [number, number, number]
  terminals: string[]
}

export interface Terminal {
  id: string
  name: string
  portId: string
  position: [number, number, number]
  size: [number, number]
  berths: string[]
  yardUtilization: number
  gateQueueLength: number
  congestionLevel: 'low' | 'medium' | 'high' | 'critical'
}

export interface Berth {
  id: string
  name: string
  terminalId: string
  position: [number, number, number]
  length: number
  status: 'available' | 'occupied' | 'maintenance'
  assignedVessel: string | null
}

export interface YardBlock {
  id: string
  terminalId: string
  position: [number, number, number]
  size: [number, number]
  utilization: number
  containerCount: number
  maxCapacity: number
}

export interface Gate {
  id: string
  terminalId: string
  position: [number, number, number]
  queueLength: number
  avgWaitMinutes: number
  status: 'open' | 'congested' | 'closed'
}

export interface Vessel {
  id: string
  name: string
  type: 'container' | 'bulk' | 'tanker'
  status: 'approaching' | 'waiting' | 'berthed' | 'departing'
  position: [number, number, number]
  rotation: number
  eta: string
  etd: string
  assignedBerth: string | null
  capacity: number
  currentLoad: number
  co2EmissionRate: number
}

export interface Container {
  id: string
  status: 'on_vessel' | 'yard' | 'on_truck' | 'warehouse'
  vesselId: string | null
  yardBlockId: string | null
  position: [number, number, number]
  dwellTimeHours: number
  destination: string
}

export interface LogisticsEvent {
  id: string
  type: 'delay' | 'congestion' | 'weather' | 'equipment_failure' | 'emission_alert'
  severity: 'info' | 'warning' | 'critical'
  targetId: string
  targetType: 'vessel' | 'terminal' | 'berth' | 'yard' | 'gate'
  cause: string
  description: string
  timestamp: string
  relatedEntities: string[]
}

export interface EmissionRecord {
  id: string
  sourceId: string
  sourceType: 'vessel' | 'truck' | 'terminal'
  co2Tons: number
  fuelConsumptionTons: number
  timestamp: string
}

// === Ontology Relationship Types ===

export interface OntologyRelation {
  id: string
  type: RelationType
  sourceId: string
  targetId: string
  label?: string
}

export type RelationType =
  | 'callsAt'
  | 'assignedTo'
  | 'handledBy'
  | 'storedIn'
  | 'transportedBy'
  | 'deliveredTo'
  | 'causes'
  | 'affectedBy'
  | 'produces'
  | 'belongsTo'
  | 'containedIn'

// === Store Types ===

export type EntityType = 'port' | 'terminal' | 'berth' | 'yard' | 'gate' | 'vessel' | 'container' | 'event'

export interface SelectedEntity {
  id: string
  type: EntityType
}

// === Aggregated Data ===

export interface PortData {
  port: Port
  terminals: Terminal[]
  berths: Berth[]
  yardBlocks: YardBlock[]
  gates: Gate[]
  vessels: Vessel[]
  containers: Container[]
  events: LogisticsEvent[]
  emissions: EmissionRecord[]
  relations: OntologyRelation[]
}
