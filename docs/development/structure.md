# 프로젝트 구조

```
maritime-viz/
├── .github/
│   └── workflows/
│       └── deploy.yml             # CI/CD: 앱 + 문서 GitHub Pages 배포
├── docs/                          # MkDocs 문서 소스
│   ├── index.md
│   ├── getting-started/
│   ├── domain/
│   ├── visualization/
│   ├── architecture/
│   ├── scenarios/
│   ├── development/
│   └── roadmap.md
├── src/
│   ├── types/
│   │   └── index.ts               # 온톨로지 TypeScript 타입
│   ├── data/
│   │   └── portData.ts            # 부산항 mock 데이터
│   ├── store/
│   │   └── useStore.ts            # Zustand 단일 스토어
│   ├── components/
│   │   ├── scene/                 # 3D 컴포넌트
│   │   │   ├── PortScene.tsx
│   │   │   ├── Environment.tsx
│   │   │   ├── Terminal.tsx
│   │   │   ├── Berth.tsx
│   │   │   ├── YardBlock.tsx
│   │   │   ├── Gate.tsx
│   │   │   ├── Vessel.tsx
│   │   │   ├── RelationLines.tsx
│   │   │   └── EventMarkers.tsx
│   │   └── ui/                    # HUD 패널
│   │       ├── StatusBar.tsx
│   │       ├── InfoPanel.tsx
│   │       ├── ControlPanel.tsx
│   │       └── KnowledgeGraph.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                  # Tailwind v4 + 글로벌 CSS
├── public/                        # 정적 자산
├── index.html
├── package.json
├── vite.config.ts                 # base: '/maritime-viz/'
├── tsconfig.json
├── mkdocs.yml                     # MkDocs Material 설정
├── docs-requirements.txt          # MkDocs Python 의존성
├── .gitignore
└── README.md
```

## 주요 파일 책임

| 파일 | 책임 |
|---|---|
| `vite.config.ts` | Vite + Tailwind v4 + GitHub Pages base path |
| `mkdocs.yml` | MkDocs Material 테마, 한국어, 네비게이션 |
| `.github/workflows/deploy.yml` | 앱 + 문서 자동 빌드 → gh-pages 배포 |
| `src/types/index.ts` | 모든 온톨로지 타입 (한 파일에 집중) |
| `src/data/portData.ts` | mock 데이터 (실 API 교체 시 이 파일만 수정) |
| `src/store/useStore.ts` | 모든 클라이언트 상태 + 관계 추론 헬퍼 |

## 코딩 컨벤션

### TypeScript

- `strict: true`
- `as any`, `@ts-ignore` 금지
- 모든 컴포넌트 props에 명시적 타입

### React

- 함수형 컴포넌트만 사용
- 부수 효과는 `useEffect`/`useFrame` 명확히 구분
- props drilling 대신 `useStore` 직접 호출

### Three.js (R3F)

- 인스턴스 재사용을 위해 `useMemo`로 geometry/shape 메모이제이션
- `useFrame` 내에서 `Color.lerp`로 부드러운 전환
- 큰 mesh 수가 예상되면 `instancedMesh` 사용 (현재 MVP는 미사용)

### 스타일링

- Tailwind utility 우선
- 복잡한 조건부 스타일은 `style={{}}` inline (3D HUD에 한함)
- 색상 팔레트는 [시각적 문법](../visualization/visual-grammar.md) 참조
