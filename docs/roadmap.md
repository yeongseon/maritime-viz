# 로드맵

## 단기 (v0.2) — ✅ 완료

- [x] 키보드 단축키 (Esc, G, L, E, R, T, Y, F, Space, 1~4, /)
- [x] 카메라 프리셋 버튼 (Reset / Top / Side / Focus on entity)
- [x] 검색 기능 (선박/터미널/선석명으로 즉시 이동 + 자동 focus)
- [x] URL 파라미터로 선택 상태 공유 (`?selected=vessel_001`)
- [x] 번들 코드 분할 (three / react / r3f 청크 분리)
- [x] **타임라인 슬라이더** — 재생/일시정지, 속도 1×/4×/16×/64×
- [x] **온톨로지 필터 패널** — 엔티티 종류 + 관계 타입 토글
- [x] **데이터 임포트** — JSON 업로드 + 스키마 검증 + 리셋
- [x] **모바일 반응형 레이아웃** — 패널 접기/펼치기, 터치 제스처
- [ ] 다국어 (영어 UI 토글)

## 중기 (v0.5)

- [ ] **글로벌 항로 뷰** — Layer 1 (해상 네트워크)
- [ ] **내륙 운송 뷰** — Layer 3 (트럭/철도 ICD 연결)
- [ ] WebSocket 기반 실시간 데이터 모드
- [ ] 컨테이너 개별 추적 뷰 (B/L 단위)
- [ ] 시간 슬라이더와 연동된 vessel 위치 보간 (status 자동 전환)

## 장기 (v1.0)

- [ ] **다중 항만 비교 모드** (부산 vs 광양 vs 인천)
- [ ] **시뮬레이션 엔진** — what-if 분석 (선석 추가/크레인 증설)
- [ ] **AI 기반 병목 예측** — 향후 6시간 혼잡도 예측
- [ ] **OWL 기반 추론 엔진** — Apache Jena/Stardog 연동
- [ ] **AR/VR 뷰** — Quest/Vision Pro 지원

## 데이터 통합

| 데이터 소스 | 연동 우선순위 |
|---|---|
| AIS (선박 위치) | High |
| 항만 운영 시스템 (PORT-MIS) | High |
| 컨테이너 추적 (TOS) | Medium |
| 기상 데이터 (KMA API) | Medium |
| 탄소 배출 인벤토리 | Low |

## 기술 부채 정리

- [ ] Three.js bundle 크기 최적화 (현재 1.1MB → 동적 import)
- [ ] InstancedMesh로 컨테이너/야드 박스 렌더링 최적화
- [ ] E2E 테스트 (Playwright)
- [ ] Visual regression 테스트 (Percy/Chromatic)
- [ ] Storybook으로 컴포넌트 카탈로그

## 디자인 개선

- [ ] 야간/주간 모드 (시간대 반영 조명)
- [ ] 선박 hull 디테일 향상 (브리지/굴뚝 추가)
- [ ] 컨테이너 색상에 운송사 매핑 (Maersk=파랑, MSC=노랑 등)
- [ ] 미니맵 (전체 위치 인디케이터)

## 커뮤니티

- [ ] 디스코드/슬랙 채널
- [ ] 월간 데모 라이브
- [ ] 학회 발표 (한국항해항만학회 등)

---

기여 아이디어가 있다면 [GitHub Issues](https://github.com/yeongseon/maritime-viz/issues)에 남겨주세요.
