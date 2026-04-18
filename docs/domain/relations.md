# 관계 정의

본 프로젝트는 11개의 핵심 관계 타입을 정의합니다.

## 관계 분류

### 1. 물리적 위치 관계

| 관계 | Source → Target | 의미 |
|---|---|---|
| `callsAt` | Vessel → Port | 선박이 항만에 기항 |
| `assignedTo` | Vessel → Berth | 선박이 선석에 배정됨 |
| `storedIn` | Container → Yard | 컨테이너가 야드에 적치됨 |
| `belongsTo` | Berth/Yard/Gate → Terminal | 시설이 터미널에 소속됨 |
| `containedIn` | Terminal → Port | 터미널이 항만에 포함됨 |

### 2. 운영 관계

| 관계 | Source → Target | 의미 |
|---|---|---|
| `handledBy` | Container → Terminal | 컨테이너가 터미널에서 처리됨 |
| `transportedBy` | Container → Truck/Train | 컨테이너가 운송 수단으로 이동 |
| `deliveredTo` | Container → Warehouse | 컨테이너가 창고로 배송됨 |

### 3. 인과/영향 관계

| 관계 | Source → Target | 의미 |
|---|---|---|
| `causes` | Event → Event | 한 이벤트가 다른 이벤트를 유발 |
| `affectedBy` | Vessel → WeatherCondition | 선박이 기상 조건의 영향을 받음 |
| `produces` | Vessel/Voyage → EmissionRecord | 선박/항해가 배출 기록을 생성 |

## 관계 시각화 문법

3D 화면에서 각 관계는 다음과 같은 시각적 표현을 가집니다.

| 관계 유형 | 시각 표현 | 색상 |
|---|---|---|
| 물리적 이동 | **실선** (Bezier curve) | 파랑 (#60a5fa) |
| 정보 흐름 | **점선** | 회색 |
| 영향 관계 | **파동** (animated waves) | 주황/빨강 |
| 계층 소속 | **수직 연결선** | 보라 |
| 시간 흐름 | **trail animation** | 녹색 |

## 관계 추론 예시

### 사례 1: 선박 지연의 원인 추적

```
HMM Promise (Vessel, status=waiting)
  └─ assignedTo → Berth_07 (Terminal_3)
  └─ targetOf ← evt_001 (DelayEvent, cause=berth_congestion)
                  └─ relatedEntities: [berth_05, berth_07, terminal_3]
                  └─ causedBy ← evt_006 (EquipmentFailure on Berth_05)
```

→ 사용자가 `HMM Promise`를 클릭하면 위 체인 전체가 3D 관계 라인으로 시각화됩니다.

### 사례 2: 야드 포화의 게이트 영향

```
Sinseondae Terminal (yardUtilization=0.82)
  └─ contains → Yard_A1 (utilization=0.91)
  └─ contains → Gate_1 (queueLength=17, status=congested)
  └─ targetOf ← evt_002 (Congestion, cause=yard_overflow)
                  └─ causes → evt_003 (Gate_1 congestion)
```

→ Congestion 오버레이 모드에서 야드 적치율과 게이트 상태가 동시에 강조됩니다.

## 다음 단계

→ [데이터 모델](data-model.md) 에서 실제 JSON 예시를 확인하세요.
