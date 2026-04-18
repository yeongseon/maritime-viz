# 설치 및 실행

## 사전 요구사항

| 도구 | 버전 |
|---|---|
| Node.js | 20.x 이상 |
| npm | 10.x 이상 |
| Git | 2.30 이상 |

## 저장소 클론

```bash
git clone https://github.com/yeongseon/maritime-viz.git
cd maritime-viz
```

## 의존성 설치

```bash
npm install
```

다음 핵심 패키지가 설치됩니다.

- `react`, `react-dom` — UI 프레임워크
- `three`, `@react-three/fiber`, `@react-three/drei` — 3D 렌더링
- `zustand` — 상태 관리
- `tailwindcss`, `@tailwindcss/vite` — 스타일링
- `vite`, `typescript` — 빌드/타입 시스템

## 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:5173/maritime-viz/](http://localhost:5173/maritime-viz/) 으로 접속합니다.

!!! tip "Base path"
    GitHub Pages 배포를 위해 `vite.config.ts`에 `base: '/maritime-viz/'`가 설정되어 있습니다. 로컬 개발 시에도 동일한 경로 prefix가 적용됩니다.

## 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 디렉토리에 생성됩니다.

## 빌드 미리보기

```bash
npm run preview
```

## 문서 로컬 빌드

MkDocs 문서를 로컬에서 미리 보려면:

```bash
python -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r docs-requirements.txt
mkdocs serve
```

브라우저에서 [http://127.0.0.1:8000/maritime-viz/docs/](http://127.0.0.1:8000/maritime-viz/docs/) 으로 접속합니다.
