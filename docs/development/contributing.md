# 기여 가이드

본 프로젝트에 기여하고 싶다면 아래 가이드를 따라주세요.

## 환경 설정

```bash
git clone https://github.com/yeongseon/maritime-viz.git
cd maritime-viz
npm install
```

## 브랜치 전략

- `main` — 배포 가능한 안정 상태
- `feature/<name>` — 신규 기능
- `fix/<name>` — 버그 수정
- `docs/<name>` — 문서만 수정

## 커밋 메시지

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 권장합니다.

```
feat(scene): add weather overlay mode
fix(store): correct related entity deduplication
docs(ontology): clarify causes relation semantics
chore(deps): bump three to 0.170
```

## Pull Request

1. 이슈를 먼저 등록 (또는 기존 이슈 참조)
2. feature 브랜치에서 작업
3. `npm run build` 통과 확인
4. PR 설명에 다음 포함:
    - 변경 요약 (what)
    - 변경 이유 (why)
    - 시각적 변경 시 스크린샷
    - 관련 이슈 번호

## 새 도메인 객체 추가하기

예: `Truck` 클래스를 추가한다고 가정.

### 1. 타입 정의 (`src/types/index.ts`)

```typescript
export interface Truck {
  id: string
  position: [number, number, number]
  status: 'idle' | 'loading' | 'transit'
  containerId: string | null
}
```

### 2. 데이터 추가 (`src/data/portData.ts`)

```typescript
trucks: [
  { id: 'truck_01', position: [...], status: 'idle', containerId: null },
],
```

### 3. 관계 추가

```typescript
{ type: 'transportedBy', sourceId: 'cnt_001', targetId: 'truck_01' }
```

### 4. 3D 컴포넌트 작성

```typescript
// src/components/scene/Truck.tsx
export function TruckModel({ truck }: { truck: Truck }) {
  // ... follow Vessel.tsx as reference
}
```

### 5. PortScene에 등록

```typescript
{portData.trucks.map((t) => <TruckModel key={t.id} truck={t} />)}
```

### 6. 문서 업데이트

- `docs/domain/ontology.md` — 클래스 추가
- `docs/domain/relations.md` — 관계 추가
- `docs/visualization/visual-grammar.md` — 시각 표현 정의

## 새 오버레이 모드 추가하기

1. `src/store/useStore.ts`의 `OverlayMode` 타입 확장
2. `src/components/ui/ControlPanel.tsx`의 `overlayOptions` 추가
3. 영향받는 컴포넌트에서 `overlayMode === 'new_mode'` 분기 추가
4. `docs/visualization/overlays.md` 업데이트

## 코드 리뷰 체크리스트

- [ ] TypeScript 타입 명시적
- [ ] `as any` / `@ts-ignore` 사용 안 함
- [ ] 새 의존성 추가 시 PR에 명시
- [ ] 시각적 변경 시 스크린샷 첨부
- [ ] 관련 문서 업데이트
- [ ] `npm run build` 통과

## 행동 강령

상호 존중, 건설적 피드백, 다양성 존중을 기본으로 합니다.
