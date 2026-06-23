# Kakao Assignment 3 - Next Todo

React(Vite)로 만들었던 Todo 앱을 Next.js App Router와 FastAPI, SQLite 구조로 마이그레이션한 프로젝트입니다.

## 폴더 구조

```text
kakao-assignment-3/
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    └── types/
```

## 실행 방법

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
Copy-Item .env.local.example .env.local
uvicorn main:app --reload
```

FastAPI 서버는 기본적으로 `http://127.0.0.1:8000`에서 실행됩니다.

### Frontend

```powershell
cd frontend
Copy-Item .env.local.example .env.local
npm.cmd run dev
```

Next.js 앱은 기본적으로 `http://localhost:3000/todos`에서 확인할 수 있습니다.

## 구현 기능

- Todo 생성, 조회, 수정, 삭제
- Todo 완료 / 진행 중 상태 변경
- `/todos/new` Todo 생성 페이지
- `/todos/[todoId]` Todo 수정 페이지
- 전체 / 진행 중 / 완료 필터
- URL 파라미터 기반 서버 필터링
- URL 파라미터 기반 서버 검색
- 일간 뷰와 날짜 이동
- 주간 뷰와 주차 이동
- 날짜별 Todo 개수 표시
- 오늘 날짜와 선택 날짜 시각적 구분
- FastAPI CRUD API
- SQLite 데이터 저장
- Next.js Route Handler를 통한 FastAPI 프록시
- 환경변수를 통한 백엔드 URL과 DB URL 분리

## 검증 방법

```powershell
cd backend
.venv\Scripts\python.exe -m py_compile main.py
```

```powershell
cd frontend
npm.cmd run lint
npm.cmd run build
```
