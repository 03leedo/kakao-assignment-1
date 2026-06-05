function TodoForm({ message, todoText, onChangeTodoText, onSubmit }) {
  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="todoInput">
          할 일 입력
        </label>
        <input
          id="todoInput"
          className="h-12 min-w-0 flex-1 rounded-md border border-[#d8d2e6] px-4 outline-none transition focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/15"
          type="text"
          placeholder="할 일을 입력하세요"
          value={todoText}
          onChange={(event) => onChangeTodoText(event.target.value)}
        />
        <button
          type="submit"
          className="h-12 rounded-md bg-[#672be0] px-6 font-bold text-white transition hover:bg-[#5420bc]"
        >
          추가
        </button>
      </div>

      <p className="min-h-5 text-sm text-[#d83a3a]" aria-live="polite">
        {message}
      </p>
    </form>
  );
}

export default TodoForm;
