# 시각적 문법

본 페이지는 도메인 객체와 관계가 어떻게 3D 공간에 매핑되는지 정의합니다.

## 객체 시각 표현

### Vessel (선박)

| 속성 | 시각 표현 |
|---|---|
| 형상 | Extruded 5각형 hull (선수 + 직사각형 본체) |
| 길이 | 적재 용량에 비례 (3~7 unit) |
| 색상 | Status 색상 (berthed=파랑, waiting=주황, approaching=녹색) |
| 데크 위 컨테이너 | currentLoad/capacity 비율만큼 박스 배치 |
| 대기 애니메이션 | 수직 방향 미세 흔들림 |
| 접근 애니메이션 | Z축 방향 미세 이동 |

### Terminal (터미널)

| 속성 | 시각 표현 |
|---|---|
| 형상 | Flat box (size[0] × 0.5 × size[1]) |
| 색상 | congestionLevel 색상 (Congestion 모드 시) |
| 라벨 | 이름 + 야드 적치율% + 게이트 대기 |

### Berth (선석)

| 속성 | 시각 표현 |
|---|---|
| 형상 | 5×0.15×2 platform |
| 색상 | available=녹색, occupied=주황, maintenance=빨강 |

### YardBlock (야드)

| 속성 | 시각 표현 |
|---|---|
| 형상 | 4×height×3 box |
| **높이** | `0.2 + utilization × 1.5` (적치율 시각화) |
| 상단 색상 오버레이 | 적치율 색상 (>85% 빨강, >70% 주황) |

### Gate (게이트)

| 속성 | 시각 표현 |
|---|---|
| 형상 | 2×1.5×1 box |
| 색상 | open=녹색, congested=주황, closed=빨강 |
| **펄스** | 혼잡 시 상단 sphere가 0.8Hz로 scale 변화 |

### Event (이벤트)

| 속성 | 시각 표현 |
|---|---|
| 형상 | 대상 객체 위 sphere + glow halo |
| 색상 | severity (info=파랑, warning=주황, critical=빨강) |
| **펄스** | 4Hz로 scale 변화 |
| 라벨 | 아이콘(⏱🚧🌊⚙💨) + 설명 (60자 truncate) |

### EmissionRecord (배출 기록)

| 속성 | 시각 표현 |
|---|---|
| 형상 | 선박 위 반투명 빨간 sphere |
| 크기 | `co2EmissionRate × 0.4` |
| 표시 조건 | Carbon 모드 + co2EmissionRate > 2.5 |

## 관계 시각 표현

### 관계 라인 (Bezier Curve)

선택된 객체와 관련 객체 사이에 **Quadratic Bezier curve**를 그려 관계를 표현합니다.

```typescript
const mid = [
  (from.x + to.x) / 2,
  Math.max(from.y, to.y) + 3,  // 높이 3 만큼 위로 곡선
  (from.z + to.z) / 2,
]
const curve = new QuadraticBezierCurve3(from, mid, to)
```

- **색상**: `#60a5fa` (파란색)
- **투명도**: 0.5
- **세그먼트**: 30 points

### 관계 라인 표시 조건

- 객체가 **선택**되어야 함
- 컨트롤 패널의 **Relations 토글이 ON**

## 색상 팔레트

| 용도 | 색상 | Hex |
|---|---|---|
| Critical (위험) | 빨강 | `#ef4444` |
| Warning (경고) | 주황 | `#f59e0b` |
| Normal (정상) | 녹색 | `#10b981` |
| Selected (선택) | 파랑 | `#3b82f6` / `#60a5fa` |
| Highlight (보라) | 보라 | `#8b5cf6` |
| Background | 짙은 남색 | `#0a0e1a` |
| Water | 진청색 | `#0c3d6e` |

## 애니메이션 정책

| 대상 | 애니메이션 | 의도 |
|---|---|---|
| Water | 0.5Hz displacement scale | 자연스러움 |
| Vessel (waiting) | 0.8Hz vertical bob | 대기 상태 표현 |
| Vessel (approaching) | 0.5Hz Z drift | 접근 상태 표현 |
| Gate (congested) | 3Hz pulse sphere | 혼잡 강조 |
| Event marker | 4Hz pulse + glow | 즉각적 주의 환기 |

## 다음 단계

→ [인터랙션](interaction.md) 에서 사용자 상호작용 패턴을 확인하세요.
→ [오버레이 모드](overlays.md) 에서 4가지 모드의 차이를 확인하세요.
