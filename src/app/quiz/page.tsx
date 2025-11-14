/* eslint-disable react-hooks/set-state-in-effect */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { QUESTIONS, type Difficulty, type Question } from '../_data/questions';

// 配列シャッフル
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const difficultyLabel: Record<Difficulty, string> = {
  easy: 'かんたん',
  normal: 'ふつう',
  hard: 'むずかしい',
};

export default function QuizPage() {
  // URLのクエリから難易度を読む（デフォルト easy）
  const [difficultyParam, setDifficultyParam] = useState<Difficulty>('easy');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sp = new URLSearchParams(window.location.search);
    const raw = sp.get('difficulty');

    const diff: Difficulty =
      raw === 'normal' || raw === 'hard' ? (raw as Difficulty) : 'easy';

    setDifficultyParam(diff);
  }, []);

  // Hooks
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [optionOrder, setOptionOrder] = useState<number[]>(() =>
    shuffleArray([0, 1, 2, 3]),
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // 難易度が決まったら、出題順を初期化
  useEffect(() => {
    const filtered = QUESTIONS.filter((q) => q.difficulty === difficultyParam);

    if (filtered.length === 0) {
      setQuestionOrder([]);
      setCurrentIndex(0);
      setScore(0);
      setFinished(false);
      return;
    }

    const total = Math.min(10, filtered.length);
    const order = shuffleArray(filtered.map((q) => q.id)).slice(0, total);

    setQuestionOrder(order);
    setCurrentIndex(0);
    setOptionOrder(shuffleArray([0, 1, 2, 3]));
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(null);
    setScore(0);
    setFinished(false);
  }, [difficultyParam]);

  // 現在の難易度の問題リスト
  const filteredQuestions: Question[] = QUESTIONS.filter(
    (q) => q.difficulty === difficultyParam,
  );
  const hasQuestions = filteredQuestions.length > 0;
  const totalQuestions = hasQuestions
    ? Math.min(10, filteredQuestions.length)
    : 0;

  // 現在の問題を決定
  const hasCurrentQuestion =
    hasQuestions && questionOrder.length > 0 && currentIndex < questionOrder.length;

  const currentQuestion: Question | null = hasCurrentQuestion
    ? filteredQuestions.find((q) => q.id === questionOrder[currentIndex]) ?? null
    : null;

  // 問題が1つもない場合
  if (!hasQuestions) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 px-3">
        <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold">問題がありません</h1>
          <p className="text-sm text-slate-700">
            選択した難易度（{difficultyLabel[difficultyParam]}）に登録されている問題がありません。
          </p>
          <Link
            href="/"
            className="inline-block mt-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold"
          >
            難易度をえらびなおす
          </Link>
        </div>
      </main>
    );
  }

  // currentQuestion がまだ決まっていない場合（初期化中）
  if (!currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 px-3">
        <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md text-center space-y-4">
          <p className="text-sm text-slate-700">問題を準備中です…</p>
        </div>
      </main>
    );
  }

  // 回答処理
  const handleCheckAnswer = () => {
    if (selectedOption === null) return;

    const actualIndex = optionOrder[selectedOption];
    const correct = actualIndex === currentQuestion.correctIndex;

    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  // 次の問題へ
  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setOptionOrder(shuffleArray([0, 1, 2, 3]));
      setSelectedOption(null);
      setShowResult(false);
      setIsCorrect(null);
    }
  };

  // 同じ難易度でもう一度
  const handleRestart = () => {
    const filtered = QUESTIONS.filter((q) => q.difficulty === difficultyParam);
    if (filtered.length === 0) return;

    const total = Math.min(10, filtered.length);
    const order = shuffleArray(filtered.map((q) => q.id)).slice(0, total);

    setQuestionOrder(order);
    setCurrentIndex(0);
    setOptionOrder(shuffleArray([0, 1, 2, 3]));
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(null);
    setScore(0);
    setFinished(false);
  };

  // 全問終了画面
  if (finished) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 px-3">
        <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold">結果</h1>
          <p className="text-sm text-slate-600">
            難易度：{difficultyLabel[difficultyParam]}
          </p>
          <p className="text-lg">
            {totalQuestions}問中 <span className="font-bold">{score}</span> 問正解でした！
          </p>
          <div className="flex flex-col gap-2 items-center">
            <button
              type="button"
              onClick={handleRestart}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold"
            >
              同じ難易度でもう一度
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-slate-300 text-slate-800 text-sm font-semibold"
            >
              難易度をえらびなおす
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const progressPercent =
    totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // 通常の出題画面
  return (
    <main className="min-h-screen bg-slate-100 flex justify-center px-3 py-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col gap-4">
        {/* ヘッダー */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-lg md:text-xl font-semibold">Scratch 動画4択クイズ</h1>
              <p className="text-xs text-slate-500">
                難易度：{difficultyLabel[difficultyParam]}
              </p>
            </div>
            <div className="text-sm text-slate-600">
              {currentIndex + 1} / {totalQuestions} 問
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        {/* メイン：動画＋4択 */}
        <section className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* YouTube 動画 */}
          <div className="md:w-1/2">
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-sm">
              <iframe
                src={`https://www.youtube.com/embed/${currentQuestion.videoId}?autoplay=1&loop=1&playlist=${currentQuestion.videoId}&mute=1`}
                title="quiz-video"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
              />
            </div>
          </div>

          {/* 4択画像 */}
          <div className="md:w-1/2 flex flex-col gap-3">
            <p className="text-sm text-slate-700">
              当てはまる画像を1つ選んで、「回答」ボタンを押してね。
            </p>
            <div className="grid grid-cols-2 gap-3">
              {optionOrder.map((imageIndex, idx) => {
                const src = currentQuestion.images[imageIndex];
                const isSelected = selectedOption === idx;

                let borderStyle = 'border-slate-300';

                if (showResult) {
                  if (imageIndex === currentQuestion.correctIndex) {
                    borderStyle = 'border-green-500';
                  } else if (isSelected && !isCorrect) {
                    borderStyle = 'border-red-500';
                  }
                } else if (isSelected) {
                  borderStyle = 'border-blue-500';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (showResult) return;
                      setSelectedOption(idx);
                    }}
                    className={`bg-slate-50 border-4 ${borderStyle} rounded-xl overflow-hidden shadow-sm active:scale-[0.98] transition`}
                  >
                    <img src={src} alt={`option-${idx + 1}`} className="w-full h-auto" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="flex flex-col items-center gap-2 mt-2">
          {!showResult ? (
            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="px-6 py-2 rounded-full bg-blue-600 text-white text-sm md:text-base font-semibold disabled:bg-slate-400"
            >
              回答
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 rounded-full bg-green-600 text-white text-sm md:text-base font-semibold"
            >
              次の問題へ
            </button>
          )}

          {showResult && isCorrect !== null && (
            <p
              className={`text-sm md:text-base font-semibold ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isCorrect ? '正解！' : '残念！'}
            </p>
          )}
        </footer>
      </div>
    </main>
  );
}
