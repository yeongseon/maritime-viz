# 해운물류 온톨로지 기반 3D 시각화 플랫폼

> **선박, 항만, 터미널, 야드, 컨테이너, 내륙운송 간의 관계를 온톨로지로 구조화하고, 이를 3D로 시각화하여 해운물류의 흐름·병목·지연·혼잡·탄소 이슈를 직관적으로 탐색할 수 있도록 하는 플랫폼**

[:material-rocket-launch: 라이브 데모 열기](https://yeongseon.github.io/maritime-viz/){ .md-button .md-button--primary }
[:material-github: GitHub 저장소](https://github.com/yeongseon/maritime-viz){ .md-button }

---

## 한 줄 소개

기존 해운물류 정보는 표·지도·2D 대시보드 중심으로 제공되어 **객체 간 관계와 병목 원인**을 직관적으로 파악하기 어렵습니다.
본 프로젝트는 해운물류 도메인을 **온톨로지로 구조화**하고, 그 의미 관계를 **3D 공간에 시각적으로 배치**하여 복잡한 물류 흐름을 한눈에 이해할 수 있게 합니다.

## 핵심 가치

<div class="grid cards" markdown>

-   :material-graph-outline: **온톨로지 기반**

    Vessel · Port · Terminal · Berth · Yard · Gate · Container · Event · Emission 9개 핵심 클래스와 11개 관계 타입으로 도메인을 구조화

-   :material-cube-outline: **의미가 있는 3D**

    단순 모델링이 아니라 계층 구조 · 상태 · 이벤트 · 운영 이슈를 모두 반영한 디지털트윈

-   :material-cursor-default-click: **관계 탐색**

    객체 클릭 시 온톨로지 관계가 실시간으로 시각화되어 병목 원인을 직관적으로 추적

-   :material-leaf: **운영 이슈 통합 뷰**

    Congestion · Delay · Carbon 오버레이를 전환하며 다층적 관점에서 항만 운영을 분석

</div>

## 빠른 시작

```bash
git clone https://github.com/yeongseon/maritime-viz.git
cd maritime-viz
npm install
npm run dev
```

브라우저에서 [http://localhost:5173/maritime-viz/](http://localhost:5173/maritime-viz/) 으로 접속하세요.

자세한 설치 및 실행 방법은 [설치 및 실행](getting-started/installation.md) 문서를 참고하세요.

## 문서 구성

| 섹션 | 내용 |
|---|---|
| [시작하기](getting-started/overview.md) | 프로젝트 개요, 설치, 라이브 데모 |
| [도메인 & 온톨로지](domain/problem.md) | 문제 정의, 온톨로지 스키마, 데이터 모델 |
| [3D 시각화](visualization/principles.md) | 시각화 원칙, 시각적 문법, 인터랙션 |
| [아키텍처](architecture/system.md) | 시스템 구조, 컴포넌트, 상태 관리 |
| [사용 시나리오](scenarios/congestion.md) | 혼잡·지연·탄소 분석 시나리오 |
| [개발](development/structure.md) | 프로젝트 구조, 기여 가이드, 배포 |
| [로드맵](roadmap.md) | 향후 확장 계획 |
