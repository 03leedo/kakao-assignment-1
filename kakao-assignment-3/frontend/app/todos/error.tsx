"use client";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4">
      <section className="w-full max-w-md rounded-lg border border-red-100 bg-white p-6 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Todo를 불러오지 못했어요</h2>
        <p className="mt-2 text-sm text-slate-500">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-md bg-[#672be0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5421b8]"
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}
