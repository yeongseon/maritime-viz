# 데이터 모델

## TypeScript 타입 정의

전체 타입은 [`src/types/index.ts`](https://github.com/yeongseon/maritime-viz/blob/main/src/types/index.ts) 에서 확인할 수 있습니다.

```typescript
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

export interface OntologyRelation {
  id: string
  type: RelationType
  sourceId: string
  targetId: string
  label?: string
}
```

## 데이터 예시 (JSON)

```json
{
  "port": {
    "id": "port_busan",
    "name": "Ulsan Port",
    "nameKo": "울산항",
    "terminals": ["terminal_1", "terminal_2", "terminal_3"]
  },
  "vessels": [
    {
      "id": "vessel_001",
      "name": "MV Horizon",
      "type": "container",
      "status": "berthed",
      "eta": "2026-04-18T06:00:00",
      "etd": "2026-04-18T18:00:00",
      "assignedBerth": "berth_01",
      "capacity": 8000,
      "currentLoad": 6200,
      "co2EmissionRate": 2.4
    },
    {
      "id": "vessel_007",
      "name": "HMM Promise",
      "status": "waiting",
      "assignedBerth": "berth_07"
    }
  ],
  "terminals": [
    {
      "id": "terminal_1",
      "name": "Sinseondae Terminal",
      "yardUtilization": 0.82,
      "gateQueueLength": 17,
      "congestionLevel": "high"
    }
  ],
  "events": [
    {
      "id": "evt_001",
      "type": "delay",
      "severity": "critical",
      "targetId": "vessel_007",
      "cause": "berth_congestion",
      "description": "HMM Promise waiting for berth assignment due to maintenance on B-5",
      "relatedEntities": ["berth_05", "berth_07", "terminal_3"]
    }
  ],
  "relations": [
    { "type": "callsAt",     "sourceId": "vessel_001", "targetId": "port_busan" },
    { "type": "assignedTo",  "sourceId": "vessel_001", "targetId": "berth_01" },
    { "type": "belongsTo",   "sourceId": "berth_01",   "targetId": "terminal_1" },
    { "type": "produces",    "sourceId": "vessel_001", "targetId": "em_001" },
    { "type": "causes",      "sourceId": "evt_006",    "targetId": "evt_001" }
  ]
}
```

## MVP 데이터 규모

| 클래스 | 개수 |
|---|---|
| Port | 1 (Ulsan) |
| Terminal | 3 |
| Berth | 8 |
| YardBlock | 9 |
| Gate | 3 |
| Vessel | 8 |
| Container | 6 |
| LogisticsEvent | 7 |
| EmissionRecord | 5 |
| **OntologyRelation** | **40+** |

## 데이터 확장 방법

새 객체 추가는 [`src/data/portData.ts`](https://github.com/yeongseon/maritime-viz/blob/main/src/data/portData.ts) 의 해당 배열에 항목을 추가하면 됩니다.
관계도 동일하게 `relations` 배열에 추가하면 자동으로 3D 관계 라인이 생성됩니다.
