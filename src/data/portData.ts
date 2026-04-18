import type { PortData } from '../types'

export const busanPortData: PortData = {
  port: {
    id: 'port_busan',
    name: 'Busan Port',
    nameKo: '부산항',
    position: [0, 0, 0],
    terminals: ['terminal_1', 'terminal_2', 'terminal_3'],
  },

  terminals: [
    {
      id: 'terminal_1',
      name: 'Sinseondae Terminal',
      portId: 'port_busan',
      position: [-20, 0, 0],
      size: [18, 12],
      berths: ['berth_01', 'berth_02', 'berth_03'],
      yardUtilization: 0.82,
      gateQueueLength: 17,
      congestionLevel: 'high',
    },
    {
      id: 'terminal_2',
      name: 'Gamman Terminal',
      portId: 'port_busan',
      position: [5, 0, 0],
      size: [16, 12],
      berths: ['berth_04', 'berth_05'],
      yardUtilization: 0.54,
      gateQueueLength: 5,
      congestionLevel: 'low',
    },
    {
      id: 'terminal_3',
      name: 'New Port Terminal',
      portId: 'port_busan',
      position: [28, 0, 0],
      size: [20, 14],
      berths: ['berth_06', 'berth_07', 'berth_08'],
      yardUtilization: 0.71,
      gateQueueLength: 11,
      congestionLevel: 'medium',
    },
  ],

  berths: [
    { id: 'berth_01', name: 'B-1', terminalId: 'terminal_1', position: [-26, 0, -7], length: 5, status: 'occupied', assignedVessel: 'vessel_001' },
    { id: 'berth_02', name: 'B-2', terminalId: 'terminal_1', position: [-20, 0, -7], length: 5, status: 'occupied', assignedVessel: 'vessel_002' },
    { id: 'berth_03', name: 'B-3', terminalId: 'terminal_1', position: [-14, 0, -7], length: 5, status: 'available', assignedVessel: null },
    { id: 'berth_04', name: 'B-4', terminalId: 'terminal_2', position: [0, 0, -7], length: 5, status: 'occupied', assignedVessel: 'vessel_003' },
    { id: 'berth_05', name: 'B-5', terminalId: 'terminal_2', position: [7, 0, -7], length: 5, status: 'maintenance', assignedVessel: null },
    { id: 'berth_06', name: 'B-6', terminalId: 'terminal_3', position: [21, 0, -7], length: 5, status: 'occupied', assignedVessel: 'vessel_004' },
    { id: 'berth_07', name: 'B-7', terminalId: 'terminal_3', position: [28, 0, -7], length: 5, status: 'available', assignedVessel: null },
    { id: 'berth_08', name: 'B-8', terminalId: 'terminal_3', position: [35, 0, -7], length: 5, status: 'occupied', assignedVessel: 'vessel_005' },
  ],

  yardBlocks: [
    { id: 'yard_A1', terminalId: 'terminal_1', position: [-24, 0, 2], size: [4, 3], utilization: 0.91, containerCount: 182, maxCapacity: 200 },
    { id: 'yard_A2', terminalId: 'terminal_1', position: [-18, 0, 2], size: [4, 3], utilization: 0.76, containerCount: 152, maxCapacity: 200 },
    { id: 'yard_A3', terminalId: 'terminal_1', position: [-24, 0, 6], size: [4, 3], utilization: 0.85, containerCount: 170, maxCapacity: 200 },
    { id: 'yard_B1', terminalId: 'terminal_2', position: [1, 0, 2], size: [4, 3], utilization: 0.45, containerCount: 90, maxCapacity: 200 },
    { id: 'yard_B2', terminalId: 'terminal_2', position: [7, 0, 2], size: [4, 3], utilization: 0.62, containerCount: 124, maxCapacity: 200 },
    { id: 'yard_C1', terminalId: 'terminal_3', position: [23, 0, 2], size: [4, 3], utilization: 0.78, containerCount: 156, maxCapacity: 200 },
    { id: 'yard_C2', terminalId: 'terminal_3', position: [29, 0, 2], size: [4, 3], utilization: 0.65, containerCount: 130, maxCapacity: 200 },
    { id: 'yard_C3', terminalId: 'terminal_3', position: [35, 0, 2], size: [4, 3], utilization: 0.70, containerCount: 140, maxCapacity: 200 },
    { id: 'yard_C4', terminalId: 'terminal_3', position: [23, 0, 6], size: [4, 3], utilization: 0.55, containerCount: 110, maxCapacity: 200 },
  ],

  gates: [
    { id: 'gate_1', terminalId: 'terminal_1', position: [-20, 0, 10], queueLength: 17, avgWaitMinutes: 35, status: 'congested' },
    { id: 'gate_2', terminalId: 'terminal_2', position: [5, 0, 10], queueLength: 5, avgWaitMinutes: 12, status: 'open' },
    { id: 'gate_3', terminalId: 'terminal_3', position: [28, 0, 10], queueLength: 11, avgWaitMinutes: 22, status: 'congested' },
  ],

  vessels: [
    {
      id: 'vessel_001', name: 'MV Horizon', type: 'container',
      status: 'berthed', position: [-26, 0, -10], rotation: 0,
      eta: '2026-04-18T06:00:00', etd: '2026-04-18T18:00:00',
      assignedBerth: 'berth_01', capacity: 8000, currentLoad: 6200, co2EmissionRate: 2.4,
    },
    {
      id: 'vessel_002', name: 'Ever Forward', type: 'container',
      status: 'berthed', position: [-20, 0, -10], rotation: 0,
      eta: '2026-04-18T02:00:00', etd: '2026-04-19T04:00:00',
      assignedBerth: 'berth_02', capacity: 12000, currentLoad: 9800, co2EmissionRate: 3.1,
    },
    {
      id: 'vessel_003', name: 'Pacific Star', type: 'container',
      status: 'berthed', position: [0, 0, -10], rotation: 0,
      eta: '2026-04-17T22:00:00', etd: '2026-04-18T14:00:00',
      assignedBerth: 'berth_04', capacity: 5500, currentLoad: 3200, co2EmissionRate: 1.8,
    },
    {
      id: 'vessel_004', name: 'Maersk Emerald', type: 'container',
      status: 'berthed', position: [21, 0, -10], rotation: 0,
      eta: '2026-04-18T08:00:00', etd: '2026-04-19T12:00:00',
      assignedBerth: 'berth_06', capacity: 15000, currentLoad: 11200, co2EmissionRate: 4.2,
    },
    {
      id: 'vessel_005', name: 'CMA Explorer', type: 'container',
      status: 'berthed', position: [35, 0, -10], rotation: 0,
      eta: '2026-04-18T10:00:00', etd: '2026-04-19T08:00:00',
      assignedBerth: 'berth_08', capacity: 10000, currentLoad: 7500, co2EmissionRate: 2.8,
    },
    {
      id: 'vessel_006', name: 'Yang Ming Unity', type: 'container',
      status: 'approaching', position: [-10, 0, -25], rotation: 0.3,
      eta: '2026-04-18T16:00:00', etd: '2026-04-19T20:00:00',
      assignedBerth: 'berth_03', capacity: 9000, currentLoad: 7800, co2EmissionRate: 2.6,
    },
    {
      id: 'vessel_007', name: 'HMM Promise', type: 'container',
      status: 'waiting', position: [15, 0, -30], rotation: -0.2,
      eta: '2026-04-18T14:00:00', etd: '2026-04-20T02:00:00',
      assignedBerth: 'berth_07', capacity: 14000, currentLoad: 10500, co2EmissionRate: 3.8,
    },
    {
      id: 'vessel_008', name: 'Cosco Harmony', type: 'container',
      status: 'departing', position: [40, 0, -18], rotation: -0.4,
      eta: '2026-04-17T12:00:00', etd: '2026-04-18T12:00:00',
      assignedBerth: null, capacity: 11000, currentLoad: 4200, co2EmissionRate: 3.0,
    },
  ],

  containers: [
    { id: 'cnt_001', status: 'yard', vesselId: 'vessel_001', yardBlockId: 'yard_A1', position: [-24, 0.3, 2], dwellTimeHours: 48, destination: 'Seoul ICD' },
    { id: 'cnt_002', status: 'yard', vesselId: 'vessel_001', yardBlockId: 'yard_A1', position: [-23, 0.3, 2], dwellTimeHours: 72, destination: 'Daejeon Hub' },
    { id: 'cnt_003', status: 'yard', vesselId: 'vessel_002', yardBlockId: 'yard_A2', position: [-18, 0.3, 2], dwellTimeHours: 24, destination: 'Busan Warehouse' },
    { id: 'cnt_004', status: 'on_vessel', vesselId: 'vessel_006', yardBlockId: null, position: [-10, 1, -25], dwellTimeHours: 0, destination: 'Terminal 1' },
    { id: 'cnt_005', status: 'yard', vesselId: 'vessel_003', yardBlockId: 'yard_B1', position: [1, 0.3, 2], dwellTimeHours: 96, destination: 'Gwangyang' },
    { id: 'cnt_006', status: 'yard', vesselId: 'vessel_004', yardBlockId: 'yard_C1', position: [23, 0.3, 2], dwellTimeHours: 36, destination: 'Incheon Port' },
  ],

  events: [
    {
      id: 'evt_001', type: 'delay', severity: 'critical',
      targetId: 'vessel_007', targetType: 'vessel',
      cause: 'berth_congestion',
      description: 'HMM Promise waiting for berth assignment due to maintenance on B-5',
      timestamp: '2026-04-18T12:00:00',
      relatedEntities: ['berth_05', 'berth_07', 'terminal_3'],
    },
    {
      id: 'evt_002', type: 'congestion', severity: 'warning',
      targetId: 'terminal_1', targetType: 'terminal',
      cause: 'yard_overflow',
      description: 'Sinseondae Terminal yard utilization exceeds 80%, causing truck queue delays',
      timestamp: '2026-04-18T10:00:00',
      relatedEntities: ['yard_A1', 'yard_A3', 'gate_1'],
    },
    {
      id: 'evt_003', type: 'delay', severity: 'warning',
      targetId: 'gate_1', targetType: 'gate',
      cause: 'truck_congestion',
      description: 'Gate 1 average wait time exceeds 30 minutes',
      timestamp: '2026-04-18T11:00:00',
      relatedEntities: ['terminal_1', 'yard_A1'],
    },
    {
      id: 'evt_004', type: 'emission_alert', severity: 'warning',
      targetId: 'vessel_007', targetType: 'vessel',
      cause: 'idle_waiting',
      description: 'HMM Promise idle emissions accumulating during anchorage wait',
      timestamp: '2026-04-18T13:00:00',
      relatedEntities: ['vessel_007'],
    },
    {
      id: 'evt_005', type: 'weather', severity: 'info',
      targetId: 'port_busan', targetType: 'vessel',
      cause: 'fog',
      description: 'Light fog advisory - minor visibility impact on approach channels',
      timestamp: '2026-04-18T05:00:00',
      relatedEntities: ['vessel_006', 'vessel_007'],
    },
    {
      id: 'evt_006', type: 'equipment_failure', severity: 'critical',
      targetId: 'berth_05', targetType: 'berth',
      cause: 'crane_malfunction',
      description: 'Gantry crane #3 at B-5 offline for emergency repair',
      timestamp: '2026-04-18T08:00:00',
      relatedEntities: ['terminal_2', 'berth_05'],
    },
    {
      id: 'evt_007', type: 'congestion', severity: 'warning',
      targetId: 'gate_3', targetType: 'gate',
      cause: 'peak_hour_traffic',
      description: 'Gate 3 experiencing peak-hour truck congestion',
      timestamp: '2026-04-18T09:00:00',
      relatedEntities: ['terminal_3', 'yard_C1', 'yard_C2'],
    },
  ],

  emissions: [
    { id: 'em_001', sourceId: 'vessel_001', sourceType: 'vessel', co2Tons: 12.4, fuelConsumptionTons: 4.8, timestamp: '2026-04-18T12:00:00' },
    { id: 'em_002', sourceId: 'vessel_002', sourceType: 'vessel', co2Tons: 18.6, fuelConsumptionTons: 7.2, timestamp: '2026-04-18T12:00:00' },
    { id: 'em_003', sourceId: 'vessel_007', sourceType: 'vessel', co2Tons: 8.2, fuelConsumptionTons: 3.1, timestamp: '2026-04-18T12:00:00' },
    { id: 'em_004', sourceId: 'terminal_1', sourceType: 'terminal', co2Tons: 5.4, fuelConsumptionTons: 2.1, timestamp: '2026-04-18T12:00:00' },
    { id: 'em_005', sourceId: 'vessel_004', sourceType: 'vessel', co2Tons: 22.1, fuelConsumptionTons: 8.5, timestamp: '2026-04-18T12:00:00' },
  ],

  relations: [
    // Vessel → Port
    { id: 'rel_001', type: 'callsAt', sourceId: 'vessel_001', targetId: 'port_busan' },
    { id: 'rel_002', type: 'callsAt', sourceId: 'vessel_002', targetId: 'port_busan' },
    { id: 'rel_003', type: 'callsAt', sourceId: 'vessel_003', targetId: 'port_busan' },
    { id: 'rel_004', type: 'callsAt', sourceId: 'vessel_004', targetId: 'port_busan' },
    { id: 'rel_005', type: 'callsAt', sourceId: 'vessel_005', targetId: 'port_busan' },
    { id: 'rel_006', type: 'callsAt', sourceId: 'vessel_006', targetId: 'port_busan' },
    { id: 'rel_007', type: 'callsAt', sourceId: 'vessel_007', targetId: 'port_busan' },

    // Vessel → Berth
    { id: 'rel_010', type: 'assignedTo', sourceId: 'vessel_001', targetId: 'berth_01' },
    { id: 'rel_011', type: 'assignedTo', sourceId: 'vessel_002', targetId: 'berth_02' },
    { id: 'rel_012', type: 'assignedTo', sourceId: 'vessel_003', targetId: 'berth_04' },
    { id: 'rel_013', type: 'assignedTo', sourceId: 'vessel_004', targetId: 'berth_06' },
    { id: 'rel_014', type: 'assignedTo', sourceId: 'vessel_005', targetId: 'berth_08' },
    { id: 'rel_015', type: 'assignedTo', sourceId: 'vessel_006', targetId: 'berth_03' },
    { id: 'rel_016', type: 'assignedTo', sourceId: 'vessel_007', targetId: 'berth_07' },

    // Container → Yard
    { id: 'rel_020', type: 'storedIn', sourceId: 'cnt_001', targetId: 'yard_A1' },
    { id: 'rel_021', type: 'storedIn', sourceId: 'cnt_002', targetId: 'yard_A1' },
    { id: 'rel_022', type: 'storedIn', sourceId: 'cnt_003', targetId: 'yard_A2' },
    { id: 'rel_023', type: 'storedIn', sourceId: 'cnt_005', targetId: 'yard_B1' },
    { id: 'rel_024', type: 'storedIn', sourceId: 'cnt_006', targetId: 'yard_C1' },

    // Container → Terminal (handledBy)
    { id: 'rel_030', type: 'handledBy', sourceId: 'cnt_001', targetId: 'terminal_1' },
    { id: 'rel_031', type: 'handledBy', sourceId: 'cnt_002', targetId: 'terminal_1' },
    { id: 'rel_032', type: 'handledBy', sourceId: 'cnt_003', targetId: 'terminal_1' },
    { id: 'rel_033', type: 'handledBy', sourceId: 'cnt_005', targetId: 'terminal_2' },
    { id: 'rel_034', type: 'handledBy', sourceId: 'cnt_006', targetId: 'terminal_3' },

    // Event → causes
    { id: 'rel_040', type: 'causes', sourceId: 'evt_006', targetId: 'evt_001' },
    { id: 'rel_041', type: 'causes', sourceId: 'evt_002', targetId: 'evt_003' },
    { id: 'rel_042', type: 'causes', sourceId: 'evt_001', targetId: 'evt_004' },

    // Berth → Terminal (belongsTo)
    { id: 'rel_050', type: 'belongsTo', sourceId: 'berth_01', targetId: 'terminal_1' },
    { id: 'rel_051', type: 'belongsTo', sourceId: 'berth_02', targetId: 'terminal_1' },
    { id: 'rel_052', type: 'belongsTo', sourceId: 'berth_03', targetId: 'terminal_1' },
    { id: 'rel_053', type: 'belongsTo', sourceId: 'berth_04', targetId: 'terminal_2' },
    { id: 'rel_054', type: 'belongsTo', sourceId: 'berth_05', targetId: 'terminal_2' },
    { id: 'rel_055', type: 'belongsTo', sourceId: 'berth_06', targetId: 'terminal_3' },
    { id: 'rel_056', type: 'belongsTo', sourceId: 'berth_07', targetId: 'terminal_3' },
    { id: 'rel_057', type: 'belongsTo', sourceId: 'berth_08', targetId: 'terminal_3' },

    // Emission records
    { id: 'rel_060', type: 'produces', sourceId: 'vessel_001', targetId: 'em_001' },
    { id: 'rel_061', type: 'produces', sourceId: 'vessel_002', targetId: 'em_002' },
    { id: 'rel_062', type: 'produces', sourceId: 'vessel_007', targetId: 'em_003' },
    { id: 'rel_063', type: 'produces', sourceId: 'vessel_004', targetId: 'em_005' },
  ],
}
