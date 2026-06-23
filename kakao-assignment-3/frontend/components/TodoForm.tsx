"use client";

type TodoFormProps = {
  todoText: string;
  isSubmitting: boolean;
  onChangeTodoText: (text: string) => void;
  onSubmitTodo: () => void;
};

export default function TodoForm({
  todoText,
  isSubmitting,
  onChangeTodoText,
  onSubmitTodo,
}: TodoFormProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmitTodo();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
      <input
        type="text"
        value={todoText}
        onChange={(event) => onChangeTodoText(event.target.value)}
        placeholder="오늘 할 일을 입력하세요"
        className="min-h-11 flex-1 rounded-md border border-slate-200 px-4 text-sm outline-none transition focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/15"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 rounded-md bg-[#672be0] px-5 text-sm font-bold text-white transition hover:bg-[#5421b8] disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        추가
      </button>
    </form>
  );
}
