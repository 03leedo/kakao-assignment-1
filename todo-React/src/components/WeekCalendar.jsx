import { useMemo } from "react";
import ArrowButton from "./ArrowButton";
import {
  createDateFromKey,
  formatWeekRangeLabel,
  getTodayDateKey,
  getWeekDateKeys,
} from "../utils/date";

function WeekDayButton({
  dateKey,
  isSelected,
  isToday,
  todoCount,
  onSelectDate,
}) {
  const date = createDateFromKey(dateKey);

  return (
    <button
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
  const todoCountMap = useMemo(() => {
    return todos.reduce((countMap, todo) => {
      countMap[todo.date] = (countMap[todo.date] || 0) + 1;
      return countMap;
    }, {});
  }, [todos]);

  return (
    <section className="rounded-lg border border-[#ebe7f5] bg-white p-3">
      <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
        {/* 이전 버튼 */}
        <ArrowButton direction="prev" onClick={() => onMoveWeek(-7)} />

        <p className="text-center text-sm font-bold text-[#4c4659]">
          {formatWeekRangeLabel(weekStartDate)}
        </p>

        {/* 다음 버튼 */}
        <ArrowButton direction="next" onClick={() => onMoveWeek(7)} />
      </div>

      <div
        className="mt-3 grid grid-cols-7 gap-1 overflow-x-auto pb-1"
        aria-label="주간 날짜 목록"
      >
        {weekDateKeys.map((dateKey) => {
          const isSelected = dateKey === selectedDate;
          const isToday = dateKey === todayDateKey;
          const todoCount = todoCountMap[dateKey] || 0;

          return (
            <WeekDayButton
              key={dateKey}
              dateKey={dateKey}
              isSelected={isSelected}
              isToday={isToday}
              todoCount={todoCount}
              onSelectDate={onSelectDate}
            />
          );
        })}
      </div>
    </section>
  );
}

export default WeekCalendar;
