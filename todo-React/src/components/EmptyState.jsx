import { formatShortDateLabel } from "../utils/date";

const emptyMessages = {
  all: "등록된 Todo가 없어요.",
  active: "진행 중인 Todo가 없어요.",
  completed: "완료된 Todo가 없어요.",
};

function EmptyState({ currentFilter, selectedDate }) {
  return (
    <div className="rounded-lg border border-dashed border-[#d8d2e6] bg-[#faf9fd] px-4 py-8 text-center">
      <p className="font-bold text-[#4c4659]">{emptyMessages[currentFilter]}</p>
      <p className="mt-2 text-sm text-[#8a8495]">
        {formatShortDateLabel(selectedDate)}에 표시할 항목이 없습니다.
      </p>
    </div>
  );
}

export default EmptyState;
