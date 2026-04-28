# 해운물류 온톨로지 기반 3D 시각화 플랫폼

> 선박, 항만, 터미널, 야드, 컨테이너, 내륙운송 간의 관계를 온톨로지로 구조화하고, 이를 3D로 시각화하여 해운물류의 흐름·병목·지연·혼잡·탄소 이슈를 직관적으로 탐색할 수 있는 플랫폼.

[![Deploy](https://github.com/yeongseon/maritime-viz/actions/workflows/deploy.yml/badge.svg)](https://github.com/yeongseon/maritime-viz/actions/workflows/deploy.yml)

- 🌐 **Live Demo**: https://yeongseon.github.io/maritime-viz/
- 📖 **Documentation**: https://yeongseon.github.io/maritime-viz/docs/

## 핵심 특징

- **온톨로지 기반 데이터 모델** — Vessel · Port · Terminal · Berth · Yard · Gate · Container · Event · Emission
- **3D 디지털트윈** — 울산항 기반 미니어처 시각화 (선석 점유 / 야드 적치율 / 게이트 대기열)
- **관계 탐색** — 객체 클릭 시 온톨로지 관계가 실시간으로 시각화
- **운영 오버레이** — Congestion · Delay · Carbon 모드 전환
- **Knowledge Graph 뷰** — 노드-엣지 그래프로 의미 관계 탐색

## 기술 스택

| Layer | Stack |
|---|---|
| Framework | React 19 · TypeScript · Vite |
| 3D | Three.js · @react-three/fiber · @react-three/drei |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| Docs | MkDocs Material |
| CI/CD | GitHub Actions · GitHub Pages |

## 로컬 개발

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 문서

전체 설계, 온톨로지 스키마, 아키텍처, 사용법은 [공식 문서](https://yeongseon.github.io/maritime-viz/docs/)를 참고하세요.

## License

MIT
