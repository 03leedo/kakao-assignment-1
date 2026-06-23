"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import DayHeader from "@/components/DayHeader";
import FilterTabs from "@/components/FilterTabs";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import WeekCalendar from "@/components/WeekCalendar";
import {
  createTodoViaRoute,
  deleteTodoViaRoute,
  updateTodoViaRoute,
} from "@/lib/client-api";
import { usePersistentDateKey } from "@/hooks/usePersistentDateKey";
import { addDaysToDateKey, getMondayDateKey, getTodayDateKey } from "@/lib/date";
import {
  createTodoQueryPath,
  matchesCurrentServerQuery,
  replaceTodoByQuery,
} from "@/lib/todo-query";
import type { Todo, TodoFilter } from "@/types/todo";

const SELECTED_DATE_KEY = "next-selected-date";

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
  const weekStartDate = useMemo(() => {
    return getMondayDateKey(selectedDate);
  }, [selectedDate]);

  const syncSelectedDate = useCallback(function syncSelectedDate(nextDateKey: string) {
    setSelectedDate(nextDateKey);
  }, [setSelectedDate]);

  const handleMoveDate = useCallback(function handleMoveDate(dayAmount: number) {
    syncSelectedDate(addDaysToDateKey(selectedDate, dayAmount));
  }, [selectedDate, syncSelectedDate]);

  const handleMoveWeek = useCallback(function handleMoveWeek(dayAmount: number) {
    setSelectedDate((currentSelectedDate) => addDaysToDateKey(currentSelectedDate, dayAmount));
  }, [setSelectedDate]);

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
    router.push(createTodoQueryPath(nextFilter, nextSearchText));
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
      const createdTodo = await createTodoViaRoute({
        text: trimmedText,
        date: selectedDate,
      });

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
      const updatedTodo = await updateTodoViaRoute(todo.id, {
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
      await deleteTodoViaRoute(id);

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
