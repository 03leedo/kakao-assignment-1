import Link from "next/link";
import { notFound } from "next/navigation";

import { getTodo } from "@/app/actions";
import TodoStandaloneForm from "@/components/TodoStandaloneForm";

type EditTodoPageProps = {
  params: Promise<{
    todoId: string;
  }>;
};

export default async function EditTodoPage({ params }: EditTodoPageProps) {
  const { todoId } = await params;
  const parsedTodoId = Number(todoId);

  if (!Number.isInteger(parsedTodoId)) {
    notFound();
  }

  const todo = await getTodo(parsedTodoId);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-6 sm:py-10">
      <header className="space-y-2">
        <Link href="/todos" className="text-sm font-bold text-[#672be0]">
          Todo 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-black text-slate-950">Todo 수정하기</h1>
      </header>
      <TodoStandaloneForm mode="edit" initialTodo={todo} />
    </main>
  );
}
