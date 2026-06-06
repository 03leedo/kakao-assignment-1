import { useEffect, useState } from "react";
import { isValidDateKey } from "../utils/date";
import { loadJson, saveJson } from "../utils/storage";

const TODO_STORAGE_KEY = "react-todos";

function createTodoId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTodo(todo) {
  return {
    id: todo.id.trim(),
    text: todo.text.trim(),
    date: todo.date,
    isCompleted: todo.isCompleted,
  };
}

function loadInitialTodos() {
  return loadJson(TODO_STORAGE_KEY, [], Array.isArray)
    .filter(
      (todo) =>
        todo &&
        typeof todo.id === "string" &&
        todo.id.trim() !== "" &&
        typeof todo.text === "string" &&
        todo.text.trim() !== "" &&
        typeof todo.isCompleted === "boolean" &&
        isValidDateKey(todo.date),
    )
    .map(normalizeTodo);
}

export default function useTodos() {
  const [todos, setTodos] = useState(loadInitialTodos);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    saveJson(TODO_STORAGE_KEY, todos);
  }, [todos]);

  function addTodo(text, date) {
    setTodos((current) => [
      ...current,
      {
        id: createTodoId(),
        text,
        date,
        isCompleted: false,
      },
    ]);
  }

  function deleteTodo(todoId) {
    setTodos((current) => current.filter((todo) => todo.id !== todoId));
    setEditingId((currentEditingId) =>
      currentEditingId === todoId ? null : currentEditingId,
    );
  }

  function toggleTodo(todoId) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === todoId
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo,
      ),
    );
  }

  function updateTodo(todoId, text) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === todoId
          ? { ...todo, text }
          : todo,
      ),
    );
    setEditingId(null);
  }

  function startEditTodo(todoId) {
    setEditingId(todoId);
  }

  function cancelEditTodo() {
    setEditingId(null);
  }

  return {
    todos,
    editingId,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    startEditTodo,
    cancelEditTodo,
  };
}
