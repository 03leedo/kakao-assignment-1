"use client";

import { formatFullDateLabel } from "@/lib/date";
import ArrowButton from "@/components/ArrowButton";

type DayHeaderProps = {
  selectedDate: string;
  onMoveDate: (dayAmount: number) => void;
};

export default function DayHeader({ selectedDate, onMoveDate }: DayHeaderProps) {
  return (
    <section className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <ArrowButton label="이전 날짜" direction="previous" onClick={() => onMoveDate(-1)} />
      <div className="text-center">
        <p className="text-xs font-semibold uppercase text-[#672be0]">Selected day</p>
        <h1 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
          {formatFullDateLabel(selectedDate)}
        </h1>
      </div>
      <ArrowButton label="다음 날짜" direction="next" onClick={() => onMoveDate(1)} />
    </section>
  );
}
