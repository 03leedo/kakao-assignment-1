import { formatFullDateLabel } from "../utils/date";

function DayHeader({ selectedDate, todoCount, onMoveDate }) {
  return (
    <section className="rounded-lg border border-[#ebe7f5] bg-[#faf9fd] p-4">
      <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
        <button
          type="button"
          className="h-11 rounded-md border border-[#ded7ec] bg-white text-xl font-bold text-[#672be0] transition hover:border-[#672be0] hover:bg-[#672be0] hover:text-white"
          aria-label="이전 날짜"
          onClick={() => onMoveDate(-1)}
        >
          &#8249;
        </button>

        <div className="min-w-0 text-center">
          <p className="truncate text-lg font-bold text-[#202124]">
            {formatFullDateLabel(selectedDate)}
          </p>
          <p className="mt-1 text-sm text-[#68636f]">오늘의 Todo {todoCount}개</p>
        </div>

        <button
          type="button"
          className="h-11 rounded-md border border-[#ded7ec] bg-white text-xl font-bold text-[#672be0] transition hover:border-[#672be0] hover:bg-[#672be0] hover:text-white"
          aria-label="다음 날짜"
          onClick={() => onMoveDate(1)}
        >
          &#8250;
        </button>
      </div>
    </section>
  );
}

export default DayHeader;
