"use client";

import type { TodoFilter } from "@/types/todo";

const FILTER_OPTIONS: { label: string; value: TodoFilter }[] = [
  { label: "전체", value: "all" },
  { label: "진행 중", value: "active" },
  { label: "완료", value: "completed" },
];

type FilterTabsProps = {
  currentFilter: TodoFilter;
  onChangeFilter: (filter: TodoFilter) => void;
};

export default function FilterTabs({ currentFilter, onChangeFilter }: FilterTabsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
      {FILTER_OPTIONS.map((filter) => {
        const isSelected = currentFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChangeFilter(filter.value)}
            className={
              isSelected
                ? "rounded-md bg-[#672be0] px-3 py-2 text-sm font-bold text-white"
                : "rounded-md px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            }
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
