"use server";

import { getTodo as fetchTodo, getTodos as fetchTodos } from "@/lib/api";
import type { TodoQuery } from "@/types/todo";

export async function getTodos(query?: TodoQuery) {
  return fetchTodos(query);
}

export async function getTodo(id: number) {
  return fetchTodo(id);
}
