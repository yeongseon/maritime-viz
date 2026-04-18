# 컴포넌트 구성

## 컴포넌트 트리

```
App
├── PortScene (Canvas)
│   ├── PerspectiveCamera + OrbitControls
│   ├── Lights (ambient + directional + hemisphere)
│   ├── Stars + Fog
│   ├── Environment (Water, Ground, Quay)
│   ├── TerminalBlock × N
│   ├── BerthSlot × N
│   ├── YardArea × N
│   ├── GateEntry × N
│   ├── VesselModel × N
│   │   ├── VesselHull
│   │   ├── ContainersOnDeck
│   │   └── CO2 Plume (Carbon mode)
│   ├── RelationLines
│   │   └── RelationLine × N (Bezier curves)
│   └── EventMarkers
│       └── EventMarker × N (pulsing spheres + Html label)
├── StatusBar (HUD)
├── InfoPanel (HUD)
├── ControlPanel (HUD)
└── KnowledgeGraph (Overlay, when toggled)
    └── Canvas
        ├── GraphNodeSphere × N
        └── GraphEdgeLine × N
```

## 주요 컴포넌트 인터페이스

### `PortScene`

```typescript
export function PortScene(): JSX.Element
```

- 모든 3D 객체의 컨테이너
- `useStore`에서 portData를 받아 array map
- `onPointerMissed` → 선택 해제

### `VesselModel`

```typescript
function VesselModel({ vessel }: { vessel: Vessel })
```

내부 구성:

- `<VesselHull>` — extruded shape (hexagonal)
- `<ContainersOnDeck>` — `currentLoad/capacity`만큼 박스
- `<Html>` — 호버/선택 시 라벨
- Carbon mode 활성 시 CO2 sphere

### `TerminalBlock`

```typescript
function TerminalBlock({ terminal }: { terminal: Terminal })
```

- Congestion 모드 시 색상 변화 (`congestionLevel`)
- 선택 시 외곽 glow box
- `<Html>` 라벨 (이름, 야드%, 게이트 큐)

### `RelationLines`

```typescript
export function RelationLines(): JSX.Element | null
```

- `selectedEntity` 변경 시 `useMemo`로 라인 재계산
- 모든 엔티티 위치를 통합 lookup
- 각 관계마다 `<RelationLine>` 렌더

```typescript
function RelationLine({
  from: [number, number, number],
  to: [number, number, number]
}): JSX.Element
```

- `QuadraticBezierCurve3` 30 segments

### `InfoPanel`

```typescript
export function InfoPanel(): JSX.Element
```

- 선택 없을 때 → 전체 통계 (StatCard × 4)
- 선택 있을 때 → EntityDetails + 이벤트 리스트 + 관련 객체 버튼
- 관련 객체 버튼 클릭 → `selectEntity()` 재호출 → 컨텍스트 이동

## 디자인 패턴

### 1. Single Source of Truth

모든 상태는 `useStore`에 집중. 컴포넌트는 `useStore`만 호출하고 props drilling 없음.

### 2. Compositional 3D

`<group>`을 활용한 트리 합성. 위치/회전이 부모에서 자식으로 전파.

### 3. Lerp 애니메이션

`useFrame` + `Color.lerp()`로 부드러운 색상 전환.

```typescript
useFrame(() => {
  mat.color.lerp(new THREE.Color(target), 0.1)
})
```

### 4. Conditional Rendering

오버레이 모드/선택 상태에 따라 추가 mesh 렌더 (예: glow sphere, CO2 plume).

## 다음 단계

→ [상태 관리](state.md) 에서 Zustand 스토어의 정의를 확인하세요.
