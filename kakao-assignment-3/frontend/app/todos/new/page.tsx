import Link from "next/link";

import TodoStandaloneForm from "@/components/TodoStandaloneForm";

type NewTodoPageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

export default async function NewTodoPage({ searchParams }: NewTodoPageProps) {
  const { date } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-6 sm:py-10">
      <header className="space-y-2">
        <Link href="/todos" className="text-sm font-bold text-[#672be0]">
          Todo 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-black text-slate-950">새 Todo 만들기</h1>
      </header>
      <TodoStandaloneForm mode="create" initialDate={date} />
    </main>
  );
}
