"use client";

import { memo, useMemo } from "react";

import {
  formatShortDateLabel,
  formatWeekRangeLabel,
  getTodayDateKey,
  getWeekDateKeys,
} from "@/lib/date";
import type { Todo } from "@/types/todo";
import ArrowButton from "@/components/ArrowButton";

type WeekCalendarProps = {
  todos: Todo[];
  selectedDate: string;
  weekStartDate: string;
  onSelectDate: (dateKey: string) => void;
  onMoveWeek: (dayAmount: number) => void;
};

export default function WeekCalendar({
  todos,
  selectedDate,
  weekStartDate,
  onSelectDate,
  onMoveWeek,
}: WeekCalendarProps) {
  const todayDateKey = getTodayDateKey();
  const weekDateKeys = useMemo(() => getWeekDateKeys(weekStartDate), [weekStartDate]);
  const todoCountMap = useMemo(() => {
    return todos.reduce<Record<string, number>>((countMap, todo) => {
      countMap[todo.date] = (countMap[todo.date] ?? 0) + 1;
      return countMap;
    }, {});
  }, [todos]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <ArrowButton label="이전 주" direction="previous" onClick={() => onMoveWeek(-7)} />
        <h2 className="text-center text-sm font-bold text-slate-800 sm:text-base">
          {formatWeekRangeLabel(weekStartDate)}
        </h2>
        <ArrowButton label="다음 주" direction="next" onClick={() => onMoveWeek(7)} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-7">
        {weekDateKeys.map((dateKey) => (
          <WeekDayButton
            key={dateKey}
            dateKey={dateKey}
            count={todoCountMap[dateKey] ?? 0}
            isToday={dateKey === todayDateKey}
            isSelected={dateKey === selectedDate}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>
    </section>
  );
}

type WeekDayButtonProps = {
  dateKey: string;
  count: number;
  isToday: boolean;
  isSelected: boolean;
  onSelectDate: (dateKey: string) => void;
};

const WeekDayButton = memo(function WeekDayButton({
  dateKey,
  count,
  isToday,
  isSelected,
  onSelectDate,
}: WeekDayButtonProps) {
  const buttonClassName = [
    "min-h-24 rounded-md border px-3 py-3 text-left transition",
    isSelected
      ? "border-[#672be0] bg-[#672be0] text-white shadow-sm"
      : "border-slate-200 bg-slate-50 text-slate-800 hover:border-[#672be0]",
    isToday && !isSelected ? "ring-2 ring-[#672be0]/25" : "",
  ].join(" ");

  return (
    <button type="button" onClick={() => onSelectDate(dateKey)} className={buttonClassName}>
      <span className="block text-sm font-bold">{formatShortDateLabel(dateKey)}</span>
      <span className={isSelected ? "mt-3 block text-xs text-white/80" : "mt-3 block text-xs text-slate-500"}>
        Todo {count}개
      </span>
      {isToday ? (
        <span className={isSelected ? "mt-2 block text-xs font-semibold text-white" : "mt-2 block text-xs font-semibold text-[#672be0]"}>
          오늘
        </span>
      ) : null}
    </button>
  );
});
