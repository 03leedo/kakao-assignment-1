"use client";

type ArrowButtonProps = {
  label: string;
  direction: "previous" | "next";
  onClick: () => void;
};

export default function ArrowButton({ label, direction, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-lg font-bold text-slate-700 transition hover:border-[#672be0] hover:text-[#672be0]"
    >
      {direction === "previous" ? "<" : ">"}
    </button>
  );
}
