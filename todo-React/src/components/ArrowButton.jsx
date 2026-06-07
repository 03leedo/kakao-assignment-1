export default function ArrowButton({ direction, onClick }) {
  const baseStyle = "h-10 rounded-md border border-[#ded7ec] bg-[#f4f1fa] text-xl font-bold text-[#672be0] transition hover:border-[#672be0] hover:bg-[#672be0] hover:text-white";
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      className={baseStyle}
      aria-label={isPrev ? "이전 주차" : "다음 주차"}
      onClick={onClick}
    >
      {isPrev ? "\u2039" : "\u203A"} {/* ‹ 또는 › */}
    </button>
  );
}