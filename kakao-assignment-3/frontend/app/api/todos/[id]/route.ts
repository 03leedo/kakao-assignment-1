import { NextResponse } from "next/server";

import { deleteTodo, getTodo, updateTodo } from "@/lib/api";
import { createBadRequestResponse, createRouteErrorResponse } from "@/lib/route-error";

type TodoRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseTodoId(id: string): number | null {
  const todoId = Number(id);

  if (!Number.isInteger(todoId) || todoId <= 0) {
    return null;
  }

  return todoId;
}

export async function GET(_request: Request, context: TodoRouteContext) {
  try {
    const { id } = await context.params;
    const todoId = parseTodoId(id);

    if (todoId === null) {
      return createBadRequestResponse("Invalid todo id");
    }

    const todo = await getTodo(todoId);

    return NextResponse.json(todo);
  } catch (error) {
    return createRouteErrorResponse(error);
  }
}

export async function PUT(request: Request, context: TodoRouteContext) {
  try {
    const { id } = await context.params;
    const todoId = parseTodoId(id);

    if (todoId === null) {
      return createBadRequestResponse("Invalid todo id");
    }

    const payload = await request.json();
    const todo = await updateTodo(todoId, payload);

    return NextResponse.json(todo);
  } catch (error) {
    return createRouteErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: TodoRouteContext) {
  try {
    const { id } = await context.params;
    const todoId = parseTodoId(id);

    if (todoId === null) {
      return createBadRequestResponse("Invalid todo id");
    }

    await deleteTodo(todoId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return createRouteErrorResponse(error);
  }
}
