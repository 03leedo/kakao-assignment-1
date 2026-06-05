const filters = [
  { label: "전체", value: "all" },
  { label: "진행 중", value: "active" },
  { label: "완료", value: "completed" },
];

function FilterTabs({ currentFilter, onFilterChange }) {
  return (
    <div
      className="grid grid-cols-3 gap-2 rounded-lg border border-[#ebe7f5] bg-[#f4f1fa] p-1"
      aria-label="Todo 상태 필터"
    >
      {filters.map((filter) => {
        const isSelected = currentFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            className={`h-10 rounded-md text-sm font-bold transition ${
              isSelected
                ? "bg-[#672be0] text-white shadow-[0_6px_14px_rgba(103,43,224,0.2)]"
                : "text-[#68636f] hover:text-[#672be0]"
            }`}
            aria-pressed={isSelected}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
