"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getTodayDateKey, isValidDateKey } from "@/lib/date";
import { createTodoViaRoute, updateTodoViaRoute } from "@/lib/client-api";
import type { Todo } from "@/types/todo";

type TodoStandaloneFormProps =
  | {
      mode: "create";
      initialDate?: string;
      initialTodo?: never;
    }
  | {
      mode: "edit";
      initialTodo: Todo;
      initialDate?: never;
    };

export default function TodoStandaloneForm({
  mode,
  initialTodo,
  initialDate,
}: TodoStandaloneFormProps) {
  const router = useRouter();
  const [text, setText] = useState(initialTodo?.text ?? "");
  const [date, setDate] = useState(getInitialDate(initialTodo, initialDate));
  const [isCompleted, setIsCompleted] = useState(initialTodo?.isCompleted ?? false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      setMessage("Todo 내용을 입력해주세요.");
      return;
    }

    if (!isValidDateKey(date)) {
      setMessage("날짜 형식이 올바르지 않아요.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      if (mode === "create") {
        await createTodoViaRoute({
          text: trimmedText,
          date,
          isCompleted,
        });
      } else {
        await updateTodoViaRoute(initialTodo.id, {
          text: trimmedText,
          date,
          isCompleted,
        });
      }

      router.push("/todos");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "알 수 없는 오류가 발생했어요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Todo</span>
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-md border border-slate-200 px-4 text-sm outline-none focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/15"
            placeholder="할 일을 입력하세요"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">날짜</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-md border border-slate-200 px-4 text-sm outline-none focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/15"
          />
        </label>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-700">완료 상태</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className={isCompleted ? "text-sm font-semibold text-[#672be0]" : "text-sm font-semibold text-slate-500"}>
              {isCompleted ? "완료된 Todo예요." : "아직 진행 중인 Todo예요."}
            </span>
            <button
              type="button"
              onClick={() => setIsCompleted((currentValue) => !currentValue)}
              className={
                isCompleted
                  ? "min-h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
                  : "min-h-10 rounded-md bg-[#672be0] px-4 text-sm font-bold text-white transition hover:bg-[#5421b8]"
              }
            >
              {isCompleted ? "진행 중으로 돌리기" : "완료"}
            </button>
          </div>
        </div>
      </div>

      {message ? <p className="mt-4 text-sm font-semibold text-[#672be0]">{message}</p> : null}

      <div className="mt-6 flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-11 rounded-md bg-[#672be0] px-5 text-sm font-bold text-white transition hover:bg-[#5421b8] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {mode === "create" ? "생성" : "수정"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/todos")}
          className="min-h-11 rounded-md border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:border-[#672be0] hover:text-[#672be0]"
        >
          취소
        </button>
      </div>
    </form>
  );
}

function getInitialDate(initialTodo?: Todo, initialDate?: string): string {
  if (initialTodo?.date) {
    return initialTodo.date;
  }

  if (initialDate && isValidDateKey(initialDate)) {
    return initialDate;
  }

  return getTodayDateKey();
}
