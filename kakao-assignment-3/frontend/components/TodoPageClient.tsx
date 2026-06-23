"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import axios from "axios";

import DayHeader from "@/components/DayHeader";
import FilterTabs from "@/components/FilterTabs";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import WeekCalendar from "@/components/WeekCalendar";
import {
  addDaysToDateKey,
  getMondayDateKey,
  getTodayDateKey,
  isValidDateKey,
} from "@/lib/date";
import type { Todo, TodoFilter } from "@/types/todo";

const SELECTED_DATE_KEY = "next-selected-date";
const WEEK_START_DATE_KEY = "next-week-start-date";
const TODO_DATE_STORAGE_EVENT = "todo-date-storage";

type TodoPageClientProps = {
  initialTodos: Todo[];
  currentFilter: TodoFilter;
  searchKeyword: string;
};

export default function TodoPageClient({
  initialTodos,
  currentFilter,
  searchKeyword,
}: TodoPageClientProps) {
  const router = useRouter();
  const todayDateKey = getTodayDateKey();
  const [selectedDate, setSelectedDate] = usePersistentDateKey(
    SELECTED_DATE_KEY,
    todayDateKey,
  );
  const [weekStartDate, setWeekStartDate] = usePersistentDateKey(
    WEEK_START_DATE_KEY,
    getMondayDateKey(selectedDate),
  );
  const [todos, setTodos] = useState(initialTodos);
  const [todoText, setTodoText] = useState("");
  const [searchText, setSearchText] = useState(searchKeyword);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      return todo.date === selectedDate;
    });
  }, [todos, selectedDate]);

  const syncSelectedDate = useCallback(function syncSelectedDate(nextDateKey: string) {
    setSelectedDate(nextDateKey);
    setWeekStartDate(getMondayDateKey(nextDateKey));
  }, [setSelectedDate, setWeekStartDate]);

  const handleMoveDate = useCallback(function handleMoveDate(dayAmount: number) {
    syncSelectedDate(addDaysToDateKey(selectedDate, dayAmount));
  }, [selectedDate, syncSelectedDate]);

  const handleMoveWeek = useCallback(function handleMoveWeek(dayAmount: number) {
    setWeekStartDate((currentWeekStartDate) => addDaysToDateKey(currentWeekStartDate, dayAmount));
    setSelectedDate((currentSelectedDate) => addDaysToDateKey(currentSelectedDate, dayAmount));
  }, [setSelectedDate, setWeekStartDate]);

  function handleChangeFilter(nextFilter: TodoFilter) {
    moveTodoQuery(nextFilter, searchText);
  }

  function handleSubmitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    moveTodoQuery(currentFilter, searchText);
  }

  function handleClearSearch() {
    setSearchText("");
    moveTodoQuery(currentFilter, "");
  }

  function moveTodoQuery(nextFilter: TodoFilter, nextSearchText: string) {
    const params = new URLSearchParams();
    const trimmedSearchText = nextSearchText.trim();

    if (nextFilter !== "all") {
      params.set("filter", nextFilter);
    }

    if (trimmedSearchText) {
      params.set("search", trimmedSearchText);
    }

    router.push(params.toString() ? `/todos?${params.toString()}` : "/todos");
  }

  async function handleCreateTodo() {
    const trimmedText = todoText.trim();

    if (!trimmedText) {
      setMessage("Todo 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await axios.post<Todo>("/api/todos", {
        text: trimmedText,
        date: selectedDate,
      });

      const createdTodo = response.data;
      if (matchesCurrentServerQuery(createdTodo, currentFilter, searchKeyword)) {
        setTodos((currentTodos) => [...currentTodos, createdTodo]);
      }

      setTodoText("");
      setMessage("Todo가 추가됐어요.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "알 수 없는 오류가 발생했어요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleToggleTodo = useCallback(async function handleToggleTodo(todo: Todo) {
    try {
      const updatedTodo = await requestTodoUpdate(todo.id, {
        isCompleted: !todo.isCompleted,
      });
      setTodos((currentTodos) => replaceTodoByQuery(currentTodos, updatedTodo, currentFilter, searchKeyword));
      setMessage(updatedTodo.isCompleted ? "Todo를 완료했어요." : "Todo를 진행 중으로 변경했어요.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Todo 상태 변경에 실패했어요.");
    }
  }, [currentFilter, searchKeyword]);

  const handleDeleteTodo = useCallback(async function handleDeleteTodo(id: number) {
    try {
      await axios.delete(`/api/todos/${id}`);

      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
      setMessage("Todo가 삭제됐어요.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Todo 삭제에 실패했어요.");
    }
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:py-10">
      <header className="space-y-1">
        <p className="text-sm font-bold text-[#672be0]">Next Todo</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-black tracking-normal text-slate-950">오늘의 할 일</h1>
          <Link
            href={`/todos/new?date=${selectedDate}`}
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#672be0] px-4 text-sm font-bold text-white transition hover:bg-[#5421b8]"
          >
            새 Todo 추가
          </Link>
        </div>
      </header>

      <DayHeader selectedDate={selectedDate} onMoveDate={handleMoveDate} />
      <WeekCalendar
        todos={todos}
        selectedDate={selectedDate}
        weekStartDate={weekStartDate}
        onSelectDate={syncSelectedDate}
        onMoveWeek={handleMoveWeek}
      />
      <TodoForm
        todoText={todoText}
        isSubmitting={isSubmitting}
        onChangeTodoText={setTodoText}
        onSubmitTodo={handleCreateTodo}
      />
      {message ? (
        <p className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-[#672be0] shadow-sm">
          {message}
        </p>
      ) : null}
      <section className="grid gap-3 sm:grid-cols-[1fr_2fr]">
        <FilterTabs currentFilter={currentFilter} onChangeFilter={handleChangeFilter} />
        <form onSubmit={handleSubmitSearch} className="flex gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Todo 검색"
            className="min-h-10 flex-1 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/15"
          />
          {searchKeyword ? (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-500 transition hover:text-slate-900"
            >
              초기화
            </button>
          ) : null}
          <button type="submit" className="rounded-md bg-[#672be0] px-4 text-sm font-bold text-white">
            검색
          </button>
        </form>
      </section>
      <TodoList
        todos={visibleTodos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </main>
  );
}

async function requestTodoUpdate(
  id: number,
  payload: Partial<Pick<Todo, "text" | "date" | "isCompleted">>,
): Promise<Todo> {
  const response = await axios.put<Todo>(`/api/todos/${id}`, payload);

  return response.data;
}

function getStoredDateKey(storageKey: string, fallbackDateKey: string): string {
  if (typeof window === "undefined") {
    return fallbackDateKey;
  }

  const storedDateKey = window.localStorage.getItem(storageKey);

  if (!storedDateKey || !isValidDateKey(storedDateKey)) {
    return fallbackDateKey;
  }

  return storedDateKey;
}

type PersistentDateAction = string | ((currentDateKey: string) => string);

function usePersistentDateKey(
  storageKey: string,
  fallbackDateKey: string,
): [string, (action: PersistentDateAction) => void] {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener(TODO_DATE_STORAGE_EVENT, onStoreChange);

    return () => {
      window.removeEventListener("storage", onStoreChange);
      window.removeEventListener(TODO_DATE_STORAGE_EVENT, onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    return getStoredDateKey(storageKey, fallbackDateKey);
  }, [fallbackDateKey, storageKey]);

  const getServerSnapshot = useCallback(() => {
    return fallbackDateKey;
  }, [fallbackDateKey]);

  const dateKey = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setDateKey = useCallback(
    (action: PersistentDateAction) => {
      const currentDateKey = getStoredDateKey(storageKey, fallbackDateKey);
      const nextDateKey = typeof action === "function" ? action(currentDateKey) : action;

      window.localStorage.setItem(storageKey, nextDateKey);
      window.dispatchEvent(new Event(TODO_DATE_STORAGE_EVENT));
    },
    [fallbackDateKey, storageKey],
  );

  return [dateKey, setDateKey];
}

function matchesCurrentServerQuery(todo: Todo, currentFilter: TodoFilter, searchKeyword: string): boolean {
  const trimmedSearchKeyword = searchKeyword.trim().toLowerCase();

  if (currentFilter === "active" && todo.isCompleted) {
    return false;
  }

  if (currentFilter === "completed" && !todo.isCompleted) {
    return false;
  }

  if (trimmedSearchKeyword && !todo.text.toLowerCase().includes(trimmedSearchKeyword)) {
    return false;
  }

  return true;
}

function replaceTodoByQuery(
  currentTodos: Todo[],
  updatedTodo: Todo,
  currentFilter: TodoFilter,
  searchKeyword: string,
): Todo[] {
  if (!matchesCurrentServerQuery(updatedTodo, currentFilter, searchKeyword)) {
    return currentTodos.filter((todo) => todo.id !== updatedTodo.id);
  }

  return currentTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo));
}
