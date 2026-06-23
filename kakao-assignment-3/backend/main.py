import os
from pathlib import Path
from typing import Generator, Literal

from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import Boolean, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker


def load_local_env() -> None:
    env_path = Path(".env.local")

    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


load_local_env()

DATABASE_URL = os.environ["DATABASE_URL"]
FRONTEND_ORIGIN = os.environ["FRONTEND_ORIGIN"]

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    text: Mapped[str] = mapped_column(String, nullable=False)
    date: Mapped[str] = mapped_column(String, index=True, nullable=False)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class TodoCreate(BaseModel):
    text: str = Field(..., min_length=1)
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    is_completed: bool = False

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, value: str) -> str:
        trimmed_text = value.strip()

        if not trimmed_text:
            raise ValueError("Todo text must not be blank")

        return trimmed_text


class TodoUpdate(BaseModel):
    text: str | None = Field(default=None, min_length=1)
    date: str | None = Field(default=None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    is_completed: bool | None = None

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, value: str | None) -> str | None:
        if value is None:
            return value

        trimmed_text = value.strip()

        if not trimmed_text:
            raise ValueError("Todo text must not be blank")

        return trimmed_text


class TodoRead(BaseModel):
    id: int
    text: str
    date: str
    isCompleted: bool


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def serialize_todo(todo: Todo) -> TodoRead:
    return TodoRead(
        id=todo.id,
        text=todo.text,
        date=todo.date,
        isCompleted=todo.is_completed,
    )


def get_todo_or_404(todo_id: int, db: Session) -> Todo:
    todo = db.get(Todo, todo_id)

    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")

    return todo


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Todo API is running"}


@app.get("/todos", response_model=list[TodoRead])
def get_todos(
    todo_filter: Literal["all", "active", "completed"] = Query("all", alias="filter"),
    search: str = "",
    db: Session = Depends(get_db),
) -> list[TodoRead]:
    query = db.query(Todo)
    trimmed_search = search.strip()

    if todo_filter == "active":
        query = query.filter(Todo.is_completed.is_(False))

    if todo_filter == "completed":
        query = query.filter(Todo.is_completed.is_(True))

    if trimmed_search:
        query = query.filter(Todo.text.ilike(f"%{trimmed_search}%"))

    todos = query.order_by(Todo.date.asc(), Todo.id.asc()).all()
    return [serialize_todo(todo) for todo in todos]


@app.get("/todos/{todo_id}", response_model=TodoRead)
def get_todo(todo_id: int, db: Session = Depends(get_db)) -> TodoRead:
    return serialize_todo(get_todo_or_404(todo_id, db))


@app.post("/todos", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)) -> TodoRead:
    todo = Todo(
        text=payload.text,
        date=payload.date,
        is_completed=payload.is_completed,
    )

    db.add(todo)
    db.commit()
    db.refresh(todo)

    return serialize_todo(todo)


@app.put("/todos/{todo_id}", response_model=TodoRead)
def update_todo(
    todo_id: int,
    payload: TodoUpdate,
    db: Session = Depends(get_db),
) -> TodoRead:
    todo = get_todo_or_404(todo_id, db)
    update_data = payload.model_dump(exclude_unset=True)

    if "text" in update_data and update_data["text"] is not None:
        todo.text = update_data["text"]

    if "date" in update_data and update_data["date"] is not None:
        todo.date = update_data["date"]

    if "is_completed" in update_data:
        todo.is_completed = update_data["is_completed"]

    db.commit()
    db.refresh(todo)

    return serialize_todo(todo)


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)) -> Response:
    todo = get_todo_or_404(todo_id, db)

    db.delete(todo)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
