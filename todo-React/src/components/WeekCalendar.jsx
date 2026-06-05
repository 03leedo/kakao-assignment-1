import {
  createDateFromKey,
  formatWeekRangeLabel,
  getTodayDateKey,
  getWeekDateKeys,
} from "../utils/date";

function getTodoCountByDate(todos, dateKey) {
  return todos.filter((todo) => todo.date === dateKey).length;
}

function WeekCalendar({
  todos,
  selectedDate,
  weekStartDate,
  onMoveWeek,
  onSelectDate,
}) {
  const todayDateKey = getTodayDateKey();
  const weekDateKeys = getWeekDateKeys(weekStartDate);

  return (
    <section className="rounded-lg border border-[#ebe7f5] bg-white p-3">
      <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
        <button
          type="button"
          className="h-10 rounded-md border border-[#ded7ec] bg-[#f4f1fa] text-xl font-bold text-[#672be0] transition hover:border-[#672be0] hover:bg-[#672be0] hover:text-white"
          aria-label="이전 주차"
          onClick={() => onMoveWeek(-7)}
        >
          &#8249;
        </button>
        <p className="text-center text-sm font-bold text-[#4c4659]">
          {formatWeekRangeLabel(weekStartDate)}
        </p>
        <button
          type="button"
          className="h-10 rounded-md border border-[#ded7ec] bg-[#f4f1fa] text-xl font-bold text-[#672be0] transition hover:border-[#672be0] hover:bg-[#672be0] hover:text-white"
          aria-label="다음 주차"
          onClick={() => onMoveWeek(7)}
        >
          &#8250;
        </button>
      </div>

      <div
        className="mt-3 grid grid-cols-7 gap-1 overflow-x-auto pb-1"
        aria-label="주간 날짜 목록"
      >
        {weekDateKeys.map((dateKey) => {
          const date = createDateFromKey(dateKey);
          const isSelected = dateKey === selectedDate;
          const isToday = dateKey === todayDateKey;
          const todoCount = getTodoCountByDate(todos, dateKey);

          return (
            <button
              key={dateKey}
              type="button"
              className={`min-h-[76px] min-w-[56px] rounded-md border px-1 py-2 text-center transition ${
                isSelected
                  ? "border-[#672be0] bg-[#672be0] text-white shadow-[0_8px_18px_rgba(103,43,224,0.22)]"
                  : "border-[#ebe7f5] bg-white text-[#4c4659] hover:border-[#672be0] hover:text-[#672be0]"
              } ${isToday && !isSelected ? "ring-4 ring-[#672be0]/15" : ""}`}
              aria-pressed={isSelected}
              onClick={() => onSelectDate(dateKey)}
            >
              <span className="block text-xs font-bold">
                {date.toLocaleDateString("ko-KR", { weekday: "short" })}
              </span>
              <span className="mt-1 block text-xl font-bold">{date.getDate()}</span>
              <span
                className={`mt-1 block text-xs ${
                  isSelected ? "text-white" : "text-[#8a8495]"
                }`}
              >
                {todoCount}개
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default WeekCalendar;
