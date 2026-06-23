import { getTodos } from "@/app/actions";
import TodoPageClient from "@/components/TodoPageClient";
import type { TodoFilter } from "@/types/todo";

export const dynamic = "force-dynamic";

type TodosPageProps = {
  searchParams: Promise<{
    filter?: string;
    search?: string;
  }>;
};

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentFilter = parseTodoFilter(resolvedSearchParams.filter);
  const searchKeyword = resolvedSearchParams.search ?? "";
  const todos = await getTodos({
    filter: currentFilter,
    search: searchKeyword,
  });

  return (
    <TodoPageClient
      key={`${currentFilter}-${searchKeyword}`}
      initialTodos={todos}
      currentFilter={currentFilter}
      searchKeyword={searchKeyword}
    />
  );
}

function parseTodoFilter(filter?: string): TodoFilter {
  if (filter === "active" || filter === "completed") {
    return filter;
  }

  return "all";
}
