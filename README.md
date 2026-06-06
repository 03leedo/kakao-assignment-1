# React Todo

Vanilla JS로 만든 Todo 앱을 React Function Component 구조로 마이그레이션한 과제입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속해 확인합니다.

## 구현 기능

- Todo 추가, 조회, 인라인 수정, 완료 처리, 삭제
- 빈 입력값과 빈 수정값 안내 메시지
- 전체 / 진행 중 / 완료 상태별 필터링
- 선택된 날짜 기준 일간 뷰
- 월요일부터 일요일까지 표시하는 주간 뷰
- 이전 주차 / 다음 주차 이동
- 날짜별 Todo 개수 표시
- 오늘 날짜와 선택 날짜 시각적 구분
- `localStorage`를 통한 Todo, 선택 날짜, 주간 뷰 상태 저장
- 깨진 localStorage 데이터에 대한 예외 처리

## 1차 과제와 달라진 점

- Vanilla JS의 직접 DOM 조작을 React의 `useState` 기반 렌더링으로 변경했습니다.
- Todo 목록 렌더링을 컴포넌트 단위로 분리하여 UI를 구성했다.
- `prompt()`로 처리하던 수정 기능을 `isEditing` 상태 기반 인라인 입력 UI로 변경했습니다.
- 추가, 수정, 삭제 함수마다 직접 저장하던 localStorage 로직을 `useEffect`로 분리했습니다.
- 날짜 계산과 저장 로직은 `src/utils/`로 분리해 컴포넌트가 UI 역할에 집중하도록 구성했습니다.

## 폴더 구조

```text
todo-React/
├── src/
│   ├── components/
│   ├── utils/
│   ├── hooks/
│   │   └── useTodos.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 검증 체크리스트

- [ ] 빈 입력 제출 시 안내 메시지가 표시된다
- [ ] Todo 추가 → 수정 → 완료 → 삭제 흐름이 동작한다
- [ ] 필터 탭을 바꿔도 선택된 필터 상태가 유지된다
- [ ] 날짜를 이동하면 날짜별 Todo가 분리되어 표시된다
- [ ] 새로고침 후 Todo, 선택 날짜, 주간 뷰 상태가 유지된다
- [ ] Chrome Console에 에러가 없다
