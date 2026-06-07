import { formatFullDateLabel } from "../utils/date";
import ArrowButton from "./ArrowButton";
function DayHeader({ selectedDate, todoCount, onMoveDate }) {
  
  return (
    <section className="rounded-lg border border-[#ebe7f5] bg-[#faf9fd] p-4">
      <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
        <ArrowButton
          direction="prev"
          onClick={() => onMoveDate(-1)}
        />

        <div className="min-w-0 text-center">
          <p className="truncate text-lg font-bold text-[#202124]">
            {formatFullDateLabel(selectedDate)}
          </p>
          <p className="mt-1 text-sm text-[#68636f]">오늘의 Todo {todoCount}개</p>
        </div>

        <ArrowButton
          direction="next"
          onClick={() => onMoveDate(1)}
        />
      </div>
    </section>
  );
}

export default DayHeader;
