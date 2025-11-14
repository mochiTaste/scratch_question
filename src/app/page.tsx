'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 flex justify-center px-3 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 flex flex-col gap-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Scratch 動画4択クイズ</h1>
          <p className="text-sm text-slate-600">
            難易度をえらんでスタートしてください。
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <Link
            href="/quiz?difficulty=easy"
            className="block w-full rounded-xl bg-green-500 text-white py-3 text-center text-lg font-semibold hover:brightness-110 active:scale-[0.98] transition"
          >
            かんたん
          </Link>
          <Link
            href="/quiz?difficulty=normal"
            className="block w-full rounded-xl bg-blue-500 text-white py-3 text-center text-lg font-semibold hover:brightness-110 active:scale-[0.98] transition"
          >
            ふつう
          </Link>
          <Link
            href="/quiz?difficulty=hard"
            className="block w-full rounded-xl bg-red-600 text-white py-3 text-center text-lg font-semibold hover:brightness-110 active:scale-[0.98] transition"
          >
            むずかしい
          </Link>
        </section>

        <footer className="text-xs text-slate-500 text-center">
          ※ 現時点では「かんたん」の問題のみ登録されています。
        </footer>
      </div>
    </main>
  );
}
