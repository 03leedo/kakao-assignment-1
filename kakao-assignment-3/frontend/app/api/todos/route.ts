import { NextResponse } from "next/server";

import { createTodo, getTodos } from "@/lib/api";
import type { TodoFilter } from "@/types/todo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const todos = await getTodos({
    filter: parseTodoFilter(searchParams.get("filter")),
    search: searchParams.get("search") ?? "",
  });

  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const todo = await createTodo(payload);

  return NextResponse.json(todo, { status: 201 });
}

function parseTodoFilter(filter: string | null): TodoFilter {
  if (filter === "active" || filter === "completed") {
    return filter;
  }

  return "all";
}
