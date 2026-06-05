import { useState } from "react";

function TodoEditForm({ todo, onCancelEdit, onSaveEdit }) {
  const [editText, setEditText] = useState(todo.text);

  return (
    <li className="rounded-lg border border-[#ebe7f5] bg-white p-3">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveEdit(todo.id, editText);
        }}
      >
        <label className="sr-only" htmlFor={`edit-${todo.id}`}>
          Todo 수정
        </label>
        <input
          id={`edit-${todo.id}`}
          className="h-10 min-w-0 flex-1 rounded-md border border-[#d8d2e6] px-3 outline-none transition focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/15"
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
        />
        <div className="flex gap-2 sm:justify-end">
          <button
            type="submit"
            className="h-10 flex-1 rounded-md bg-[#672be0] px-4 text-sm font-bold text-white transition hover:bg-[#5420bc] sm:flex-none"
          >
            저장
          </button>
          <button
            type="button"
            className="h-10 flex-1 rounded-md border border-[#ded7ec] bg-[#f4f1fa] px-4 text-sm font-bold text-[#4c4659] transition hover:border-[#672be0] hover:text-[#672be0] sm:flex-none"
            onClick={() => onCancelEdit(todo.id)}
          >
            취소
          </button>
        </div>
      </form>
    </li>
  );
}

function TodoItem({
  todo,
  onCancelEdit,
  onDeleteTodo,
  onSaveEdit,
  onStartEdit,
  onToggleTodo,
}) {
  if (todo.isEditing) {
    return (
      <TodoEditForm
        todo={todo}
        onCancelEdit={onCancelEdit}
        onSaveEdit={onSaveEdit}
      />
    );
  }

  return (
    <li
      className={`flex flex-col gap-3 rounded-lg border border-[#ebe7f5] bg-white p-3 sm:flex-row sm:items-center ${
        todo.isCompleted ? "bg-[#faf9fd]" : ""
      }`}
    >
      <span
        className={`min-w-0 flex-1 [overflow-wrap:anywhere] ${
          todo.isCompleted ? "text-[#8a8495] line-through" : "text-[#202124]"
        }`}
      >
        {todo.text}
      </span>

      <div className="grid grid-cols-3 gap-2 sm:flex">
        <button
          type="button"
          className="h-9 rounded-md border border-[#ded7ec] bg-[#f4f1fa] px-3 text-sm font-bold text-[#4c4659] transition hover:border-[#672be0] hover:text-[#672be0]"
          onClick={() => onStartEdit(todo.id)}
        >
          수정
        </button>
        <button
          type="button"
          className="h-9 rounded-md border border-[#ded7ec] bg-[#f4f1fa] px-3 text-sm font-bold text-[#4c4659] transition hover:border-[#178a55] hover:text-[#178a55]"
          onClick={() => onToggleTodo(todo.id)}
        >
          {todo.isCompleted ? "취소" : "완료"}
        </button>
        <button
          type="button"
          className="h-9 rounded-md border border-[#ded7ec] bg-[#f4f1fa] px-3 text-sm font-bold text-[#4c4659] transition hover:border-[#d83a3a] hover:text-[#d83a3a]"
          onClick={() => onDeleteTodo(todo.id)}
        >
          삭제
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
