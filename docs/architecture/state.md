# 상태 관리

## Zustand 선택 이유

- **간결함** — boilerplate 없는 단일 스토어
- **Reactivity** — selector 기반 부분 구독
- **R3F와의 호환성** — Canvas 외부에서도 동일하게 사용
- **타입 안전성** — TypeScript 친화적

## 스토어 구조

```typescript
interface AppState {
  // Data
  portData: PortData

  // Selection
  selectedEntity: SelectedEntity | null
  hoveredEntity: SelectedEntity | null
  selectEntity: (entity: SelectedEntity | null) => void
  hoverEntity: (entity: SelectedEntity | null) => void

  // Overlay
  overlayMode: 'none' | 'congestion' | 'carbon' | 'delay'
  setOverlayMode: (mode: OverlayMode) => void

  // View toggles
  showRelations: boolean
  toggleRelations: () => void
  showLabels: boolean
  toggleLabels: () => void
  showGraphView: boolean
  toggleGraphView: () => void

  // Helpers (derived)
  getEntityName: (id: string) => string
  getRelatedEntities: (id: string) => string[]
  getEventsForEntity: (id: string) => LogisticsEvent[]
}
```

## 헬퍼 함수

### `getRelatedEntities(id)`

특정 ID와 관련된 모든 엔티티 ID를 반환합니다.

추론 규칙:

1. `relations` 배열 순회 → `sourceId === id` 또는 `targetId === id`인 관계의 반대편 ID 수집
2. `events` 배열 순회 → `targetId === id` 또는 `relatedEntities`에 포함된 이벤트의 모든 관련 ID 수집
3. 자기 자신 제거

```typescript
getRelatedEntities: (id: string) => {
  const related = new Set<string>()
  d.relations.forEach((r) => {
    if (r.sourceId === id) related.add(r.targetId)
    if (r.targetId === id) related.add(r.sourceId)
  })
  d.events.forEach((e) => {
    if (e.targetId === id || e.relatedEntities.includes(id)) {
      related.add(e.id)
      e.relatedEntities.forEach((re) => related.add(re))
    }
  })
  related.delete(id)
  return Array.from(related)
}
```

### `getEntityName(id)`

ID를 사람이 읽을 수 있는 이름으로 변환. 모든 엔티티 타입을 한 번에 처리.

### `getEventsForEntity(id)`

특정 엔티티가 직접 또는 간접적으로 영향받는 이벤트를 반환.

## 사용 예시

### 컴포넌트에서 부분 구독

```typescript
const { selectedEntity, selectEntity } = useStore()
```

### 액션 트리거

```typescript
onClick={(e) => {
  e.stopPropagation()
  selectEntity({ id: vessel.id, type: 'vessel' })
}}
```

### 관계 라인 계산

```typescript
const relatedIds = useStore((s) => s.getRelatedEntities(selectedId))
```

## 향후 확장

| 기능 | 추가 상태 |
|---|---|
| 시간 시뮬레이션 | `currentTime`, `playbackSpeed`, `isPlaying` |
| 필터링 | `vesselFilter`, `terminalFilter` |
| 커스텀 뷰 | `cameraPresets`, `bookmarks` |
| 협업 | `userId`, `cursorPositions` |

이러한 확장은 모두 `useStore` 슬라이스 추가만으로 가능합니다.
