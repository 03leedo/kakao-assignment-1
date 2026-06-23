import type { Todo, TodoFilter } from "@/types/todo";

export function parseTodoFilter(filter?: string | null): TodoFilter {
  if (filter === "active" || filter === "completed") {
    return filter;
  }

  return "all";
}

export function createTodoQueryPath(filter: TodoFilter, searchText: string): string {
  const params = new URLSearchParams();
  const trimmedSearchText = searchText.trim();

  if (filter !== "all") {
    params.set("filter", filter);
  }

  if (trimmedSearchText) {
    params.set("search", trimmedSearchText);
  }

  return params.toString() ? `/todos?${params.toString()}` : "/todos";
}

export function matchesCurrentServerQuery(
  todo: Todo,
  currentFilter: TodoFilter,
  searchKeyword: string,
): boolean {
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

export function replaceTodoByQuery(
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
