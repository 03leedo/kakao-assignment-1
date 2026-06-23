import axios from "axios";

import type { Todo, TodoCreatePayload, TodoQuery, TodoUpdatePayload } from "@/types/todo";

const API_BASE_URL = process.env.BACKEND_URL;

type FastApiTodo = {
  id: number;
  text: string;
  date: string;
  isCompleted: boolean;
};

type FastApiTodoUpdatePayload = Partial<{
  text: string;
  date: string;
  is_completed: boolean;
}>;

type FastApiTodoCreatePayload = {
  text: string;
  date: string;
  is_completed?: boolean;
};

function createApiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error("BACKEND_URL 환경변수가 설정되지 않았어요.");
  }

  return `${API_BASE_URL}${path}`;
}

const todoApi = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

function createTodoQueryString(query?: TodoQuery): string {
  const searchParams = new URLSearchParams();

  if (query?.filter && query.filter !== "all") {
    searchParams.set("filter", query.filter);
  }

  if (query?.search?.trim()) {
    searchParams.set("search", query.search.trim());
  }

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

function toFastApiUpdatePayload(payload: TodoUpdatePayload): FastApiTodoUpdatePayload {
  return {
    text: payload.text,
    date: payload.date,
    is_completed: payload.isCompleted,
  };
}

function toFastApiCreatePayload(payload: TodoCreatePayload): FastApiTodoCreatePayload {
  return {
    text: payload.text,
    date: payload.date,
    is_completed: payload.isCompleted,
  };
}

async function requestTodo<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await todoApi.request<T>({
    url: createApiUrl(path),
    method: init?.method ?? "GET",
    data: init?.body ? JSON.parse(init.body.toString()) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  return response.data;
}

export async function getTodos(query?: TodoQuery): Promise<Todo[]> {
  return requestTodo<FastApiTodo[]>(`/todos${createTodoQueryString(query)}`);
}

export async function getTodo(id: number): Promise<Todo> {
  return requestTodo<FastApiTodo>(`/todos/${id}`);
}

export async function createTodo(payload: TodoCreatePayload): Promise<Todo> {
  return requestTodo<FastApiTodo>("/todos", {
    method: "POST",
    body: JSON.stringify(toFastApiCreatePayload(payload)),
  });
}

export async function updateTodo(id: number, payload: TodoUpdatePayload): Promise<Todo> {
  return requestTodo<FastApiTodo>(`/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify(toFastApiUpdatePayload(payload)),
  });
}

export async function deleteTodo(id: number): Promise<void> {
  await requestTodo<void>(`/todos/${id}`, {
    method: "DELETE",
  });
}
