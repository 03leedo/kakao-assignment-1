import { NextResponse } from "next/server";

import { createTodo, getTodos } from "@/lib/api";
import { createRouteErrorResponse } from "@/lib/route-error";
import { parseTodoFilter } from "@/lib/todo-query";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const todos = await getTodos({
      filter: parseTodoFilter(searchParams.get("filter")),
      search: searchParams.get("search") ?? "",
    });

    return NextResponse.json(todos);
  } catch (error) {
    return createRouteErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const todo = await createTodo(payload);

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return createRouteErrorResponse(error);
  }
}
