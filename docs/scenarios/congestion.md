# 시나리오 1. 항만 혼잡 파악

## 페르소나

**울산항 운영 담당자 (김매니저, 35세)**
> "지금 어느 터미널이 가장 혼잡한지 빨리 보고 싶다."

## 단계별 흐름

### Step 1. 메인 화면 진입

라이브 데모 접속 → 울산항 전체 3D 뷰가 표시됨.

```
StatusBar 즉시 확인:
  Berth Occupancy: 75%   ← 주황 (높음)
  Yard Avg: 71%          ← 주황 (높음)
  CO2 Total: 66.7t       ← 빨강 (고배출)
  Alerts: 2              ← 빨강 (Critical 2건)
```

### Step 2. Congestion 오버레이 켜기

컨트롤 패널 → **🚧 Congestion** 클릭

```
변화:
  - Sinseondae Terminal → 주황색 (high)
  - Gamman Terminal     → 녹색 (low)
  - New Port Terminal   → 파랑 (medium)
  - 야드 블록 상단 색상 오버레이 표시
  - 적치율 91%인 yard_A1이 빨갛게 강조
```

→ **즉각적으로 Sinseondae가 가장 혼잡함**을 인지.

### Step 3. Sinseondae Terminal 선택

터미널 박스 클릭 → InfoPanel 우측에 상세 정보 표시.

```
TERMINAL: Sinseondae Terminal
  Congestion: HIGH        (빨강)
  Yard Usage: 82%         (빨강)
  Gate Queue: 17          (주황)

Events (2):
  ⚠ congestion (warning)
    "Sinseondae Terminal yard utilization exceeds 80%,
     causing truck queue delays"

Related (8):
  [berth_01] [berth_02] [berth_03]
  [yard_A1]  [yard_A2]  [yard_A3]
  [gate_1]   [evt_002]
```

### Step 4. 관계 라인으로 영향 범위 확인

3D 뷰에서 Sinseondae로부터 관련 객체 8개로 **파란 Bezier curve**가 그려짐.

→ 야드 3개, 선석 3개, 게이트 1개가 모두 영향권임을 시각적으로 확인.

### Step 5. Gate 1 선택 (관련 객체 버튼)

InfoPanel의 `[gate_1]` 버튼 클릭 → 컨텍스트 이동.

```
GATE: Gate 1
  Status: CONGESTED       (주황)
  Queue: 17
  Avg Wait: 35 min        (높음)

Events (1):
  ⚠ delay (warning)
    "Gate 1 average wait time exceeds 30 minutes"
```

→ 게이트 혼잡의 원인이 야드 적치율 때문임을 추론 가능.

## 결과

5단계, 총 1분 이내에 다음을 모두 파악:

- ✅ 가장 혼잡한 터미널 (Sinseondae)
- ✅ 혼잡의 구체적 위치 (yard_A1, gate_1)
- ✅ 영향 받는 객체 8개 (시각적 라인)
- ✅ 원인-결과 체인 (야드 포화 → 게이트 대기 증가)

## 기존 방식과의 비교

| 항목 | 기존 대시보드 | 본 플랫폼 |
|---|---|---|
| 가장 혼잡한 터미널 식별 | 표 정렬 + 비교 | 색상 즉시 인지 |
| 영향 객체 파악 | 별도 탭 검색 | 클릭 한 번 |
| 인과관계 추론 | 사람의 추측 | 관계 라인 + 이벤트 체인 |
| 소요 시간 | 5~10분 | **1분 이내** |
