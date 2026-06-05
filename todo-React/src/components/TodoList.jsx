import EmptyState from "./EmptyState";
import TodoItem from "./TodoItem";

function TodoList({
  currentFilter,
  selectedDate,
  todos,
  onCancelEdit,
  onDeleteTodo,
  onSaveEdit,
  onStartEdit,
  onToggleTodo,
}) {
  if (todos.length === 0) {
    return <EmptyState currentFilter={currentFilter} selectedDate={selectedDate} />;
  }

  return (
    <ul className="grid gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onCancelEdit={onCancelEdit}
          onDeleteTodo={onDeleteTodo}
          onSaveEdit={onSaveEdit}
          onStartEdit={onStartEdit}
          onToggleTodo={onToggleTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
