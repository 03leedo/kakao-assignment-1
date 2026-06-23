"use client";

import type { Todo } from "@/types/todo";
import EmptyState from "@/components/EmptyState";
import TodoItem from "@/components/TodoItem";

type TodoListProps = {
  todos: Todo[];
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (id: number) => void;
};

export default function TodoList({
  todos,
  onToggleTodo,
  onDeleteTodo,
}: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState message="선택한 조건에 맞는 Todo가 없어요." />;
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}
