# Todo Frontend

Next.js App Router 기반 Todo 프론트엔드입니다.

## 실행

```powershell
Copy-Item .env.local.example .env.local
npm.cmd run dev
```

FastAPI 백엔드가 `http://127.0.0.1:8000`에서 먼저 실행되어 있어야 Todo 데이터를 불러올 수 있습니다.

## 검증

```powershell
npm.cmd run lint
npm.cmd run build
```

## 주요 구조

- `app/todos/page.tsx`: Todo 페이지 서버 컴포넌트
- `app/todos/new/page.tsx`: Todo 생성 페이지
- `app/todos/[todoId]/page.tsx`: Todo 수정 페이지
- `app/api/todos`: FastAPI 프록시 Route Handler
- `components`: Todo UI 컴포넌트
- `lib/api.ts`: FastAPI 요청 함수
- `lib/date.ts`: 날짜 계산 유틸
- `types/todo.ts`: Todo 타입 정의
