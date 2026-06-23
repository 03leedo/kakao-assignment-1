import axios from "axios";

import type { Todo, TodoCreatePayload, TodoUpdatePayload } from "@/types/todo";

export async function createTodoViaRoute(payload: TodoCreatePayload): Promise<Todo> {
  const response = await axios.post<Todo>("/api/todos", payload);

  return response.data;
}

export async function updateTodoViaRoute(
  id: number,
  payload: TodoUpdatePayload,
): Promise<Todo> {
  const response = await axios.put<Todo>(`/api/todos/${id}`, payload);

  return response.data;
}

export async function deleteTodoViaRoute(id: number): Promise<void> {
  await axios.delete(`/api/todos/${id}`);
}
