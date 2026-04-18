# 시나리오 3. 탄소 영향 파악

## 페르소나

**ESG 담당자 (박과장, 40세)**
> "어느 선박이 가장 많은 탄소를 발생시키고, 그 원인이 무엇인지 알고 싶다."

## 단계별 흐름

### Step 1. Carbon 오버레이 켜기

컨트롤 패널 → **🌿 Carbon** 클릭

```
변화:
  - co2EmissionRate > 2.5인 선박 위에 빨간 반투명 sphere
  - sphere 크기 = 배출률에 비례
  - StatusBar의 CO2 Total이 빨간 테두리로 강조
  - emission_alert 이벤트 마커 표시
```

### Step 2. CO2 plume이 가장 큰 선박 식별

3D 뷰에서 sphere 크기 비교:

```
Maersk Emerald  4.2 t/hr  ← 가장 큼
HMM Promise     3.8 t/hr
Ever Forward    3.1 t/hr
CMA Explorer    2.8 t/hr
Yang Ming Unity 2.6 t/hr
```

### Step 3. Maersk Emerald 선택

```
VESSEL: Maersk Emerald
  Status: BERTHED          (파랑)
  Capacity: 11,200 / 15,000 TEU (75%)
  CO2 Rate: 4.2 t/hr       (빨강)
  ETD: 12:00 (다음날)

Related:
  [berth_06] [terminal_3]
  [em_005] (22.1 tons CO2 누적)
```

→ 정상 접안 중인 대형 선박이지만 시간당 배출량이 가장 높음.

### Step 4. HMM Promise 비교 분석 (Idle Emission)

`HMM Promise` 클릭:

```
VESSEL: HMM Promise
  Status: WAITING          (주황)
  CO2 Rate: 3.8 t/hr       (빨강)

Events:
  ⚠ emission_alert (warning)
    "HMM Promise idle emissions accumulating during
     anchorage wait"
```

→ **대기 중에도 3.8 t/hr 배출** = 운영 비효율로 인한 직접적 탄소 손실.

### Step 5. 인사이트 도출

| 선박 | Status | CO2 t/hr | 의미 |
|---|---|---|---|
| Maersk Emerald | berthed | 4.2 | 정상 (대형선) |
| HMM Promise | **waiting** | **3.8** | **idle emission - 개선 가능** |
| Ever Forward | berthed | 3.1 | 정상 |

### Step 6. 액션 도출

- **단기**: HMM Promise 대기 단축 → B-5 수리 가속
- **중기**: 대형선 도착 시간 분산 → 동시 접안 줄이기
- **장기**: cold ironing (육상 전원) 인프라 확충

## 결과

Carbon 모드의 가치:

- ✅ 가장 배출량 높은 선박 한눈에 식별
- ✅ idle emission (대기 중 배출) 별도 식별
- ✅ 운영 지연 → 탄소 발생 인과 체인 가시화
- ✅ ESG 보고서 근거 확보

## 다른 모드와의 시너지

탄소 분석은 단독으로는 의미가 제한적. **Delay 모드와 결합**할 때 가장 강력합니다.

> Delay 모드 → idle emission 발생 위치 식별
> Carbon 모드 → 그 위치의 CO2 정량화

→ 두 모드의 정보가 **온톨로지 관계**로 연결되어 있어 한 객체에서 양방향 탐색 가능.
