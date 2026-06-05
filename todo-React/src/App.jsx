import { useEffect, useMemo, useState } from "react";
import DayHeader from "./components/DayHeader";
import FilterTabs from "./components/FilterTabs";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import WeekCalendar from "./components/WeekCalendar";
import {
  addDaysToDateKey,
  getMondayDateKey,
  getTodayDateKey,
  isValidDateKey,
} from "./utils/date";
import { loadDateKey, loadJson, saveDateKey, saveJson } from "./utils/storage";

const TODO_STORAGE_KEY = "react-todos";
const SELECTED_DATE_STORAGE_KEY = "react-selected-date";
const WEEK_START_DATE_STORAGE_KEY = "react-week-start-date";

function createTodoId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTodo(todo) {
  return {
    id: String(todo.id),
    text: String(todo.text ?? ""),
    date: todo.date,
    isCompleted: Boolean(todo.isCompleted),
    isEditing: false,
  };
}

function loadInitialTodos() {
  return loadJson(TODO_STORAGE_KEY, [], Array.isArray)
    .filter((todo) => todo && todo.id && todo.text && isValidDateKey(todo.date))
    .map(normalizeTodo);
}

function loadInitialSelectedDate() {
  return loadDateKey(SELECTED_DATE_STORAGE_KEY, getTodayDateKey());
}

function loadInitialWeekStartDate(selectedDate) {
  return loadDateKey(WEEK_START_DATE_STORAGE_KEY, getMondayDateKey(selectedDate));
}

function App() {
  const [todos, setTodos] = useState(loadInitialTodos);
  const [todoText, setTodoText] = useState("");
  const [message, setMessage] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(loadInitialSelectedDate);
  const [weekStartDate, setWeekStartDate] = useState(() =>
    loadInitialWeekStartDate(loadInitialSelectedDate()),
  );

  useEffect(() => {
    saveJson(TODO_STORAGE_KEY, todos);
  }, [todos]);

  useEffect(() => {
    saveDateKey(SELECTED_DATE_STORAGE_KEY, selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    saveDateKey(WEEK_START_DATE_STORAGE_KEY, weekStartDate);
  }, [weekStartDate]);

  const selectedDateTodos = useMemo(
    () => todos.filter((todo) => todo.date === selectedDate),
    [todos, selectedDate],
  );

  const filteredTodos = useMemo(() => {
    if (currentFilter === "active") {
      return selectedDateTodos.filter((todo) => !todo.isCompleted);
    }

    if (currentFilter === "completed") {
      return selectedDateTodos.filter((todo) => todo.isCompleted);
    }

    return selectedDateTodos;
  }, [currentFilter, selectedDateTodos]);

  function syncSelectedDate(nextDateKey) {
    setSelectedDate(nextDateKey);
    setWeekStartDate(getMondayDateKey(nextDateKey));
  }

  function handleAddTodo(event) {
    event.preventDefault();

    const trimmedText = todoText.trim();

    if (trimmedText === "") {
      setMessage("할 일을 입력한 뒤 추가해 주세요.");
      return;
    }

    const newTodo = {
      id: createTodoId(),
      text: trimmedText,
      date: selectedDate,
      isCompleted: false,
      isEditing: false,
    };

    setTodos((currentTodos) => [...currentTodos, newTodo]);
    setTodoText("");
    setMessage("");
  }

  function handleMoveDate(dayAmount) {
    const nextDateKey = addDaysToDateKey(selectedDate, dayAmount);
    syncSelectedDate(nextDateKey);
    setMessage("");
  }

  function handleMoveWeek(dayAmount) {
    const nextSelectedDate = addDaysToDateKey(selectedDate, dayAmount);
    syncSelectedDate(nextSelectedDate);
    setMessage("");
  }

  function handleSelectDate(dateKey) {
    syncSelectedDate(dateKey);
    setMessage("");
  }

  function handleFilterChange(nextFilter) {
    setCurrentFilter(nextFilter);
    setMessage("");
  }

  function handleStartEdit(todoId) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => ({
        ...todo,
        isEditing: todo.id === todoId,
      })),
    );
    setMessage("");
  }

  function handleCancelEdit(todoId) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, isEditing: false } : todo,
      ),
    );
    setMessage("");
  }

  function handleSaveEdit(todoId, nextText) {
    const trimmedText = nextText.trim();

    if (trimmedText === "") {
      setMessage("수정할 내용은 비워둘 수 없어요.");
      return;
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, text: trimmedText, isEditing: false }
          : todo,
      ),
    );
    setMessage("");
  }

  function handleToggleTodo(todoId) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo,
      ),
    );
    setMessage("");
  }

  function handleDeleteTodo(todoId) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    setMessage("");
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-[#ebe7f5] bg-white p-5 shadow-[0_16px_40px_rgba(40,30,70,0.08)] sm:p-8">
        <header className="space-y-5">
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#672be0]">React Migration</p>
            <h1 className="text-3xl font-bold text-[#202124]">Todo List</h1>
          </div>

          <WeekCalendar
            todos={todos}
            selectedDate={selectedDate}
            weekStartDate={weekStartDate}
            onMoveWeek={handleMoveWeek}
            onSelectDate={handleSelectDate}
          />

          <DayHeader
            selectedDate={selectedDate}
            todoCount={selectedDateTodos.length}
            onMoveDate={handleMoveDate}
          />
        </header>

        <div className="mt-6 space-y-4">
          <TodoForm
            message={message}
            todoText={todoText}
            onChangeTodoText={setTodoText}
            onSubmit={handleAddTodo}
          />

          <FilterTabs
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
          />

          <TodoList
            currentFilter={currentFilter}
            selectedDate={selectedDate}
            todos={filteredTodos}
            onCancelEdit={handleCancelEdit}
            onDeleteTodo={handleDeleteTodo}
            onSaveEdit={handleSaveEdit}
            onStartEdit={handleStartEdit}
            onToggleTodo={handleToggleTodo}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
