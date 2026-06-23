import { NextResponse } from "next/server";

import { deleteTodo, getTodo, updateTodo } from "@/lib/api";

type TodoRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseTodoId(id: string): number {
  const todoId = Number(id);

  if (!Number.isInteger(todoId)) {
    throw new Error("Invalid todo id");
  }

  return todoId;
}

export async function GET(_request: Request, context: TodoRouteContext) {
  const { id } = await context.params;
  const todo = await getTodo(parseTodoId(id));

  return NextResponse.json(todo);
}

export async function PUT(request: Request, context: TodoRouteContext) {
  const { id } = await context.params;
  const payload = await request.json();
  const todo = await updateTodo(parseTodoId(id), payload);

  return NextResponse.json(todo);
}

export async function DELETE(_request: Request, context: TodoRouteContext) {
  const { id } = await context.params;
  await deleteTodo(parseTodoId(id));

  return new Response(null, { status: 204 });
}
