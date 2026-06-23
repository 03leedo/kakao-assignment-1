"use client";

import Link from "next/link";
import { memo } from "react";

import type { Todo } from "@/types/todo";

type TodoItemProps = {
  todo: Todo;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (id: number) => void;
};

function TodoItem({ todo, onToggleTodo, onDeleteTodo }: TodoItemProps) {
  return (
    <li className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => onToggleTodo(todo)}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <span
            className={
              todo.isCompleted
                ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#672be0] text-xs font-bold text-white"
                : "h-6 w-6 shrink-0 rounded-full border-2 border-slate-300"
            }
          >
            {todo.isCompleted ? "✓" : ""}
          </span>
          <span
            className={
              todo.isCompleted
                ? "break-words text-sm text-slate-400 line-through"
                : "break-words text-sm font-semibold text-slate-900"
            }
          >
            {todo.text}
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Link
            href={`/todos/${todo.id}`}
            prefetch={false}
            className="rounded-md border border-slate-200 px-3 py-2 text-center text-sm font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
          >
            수정
          </Link>
          <button
            type="button"
            onClick={() => onDeleteTodo(todo.id)}
            className="rounded-md border border-red-100 px-3 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>
    </li>
  );
}

export default memo(TodoItem);
