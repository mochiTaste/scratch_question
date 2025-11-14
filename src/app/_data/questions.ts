// src/app/_data/questions.ts

export type Difficulty = 'easy' | 'normal' | 'hard';

export type Question = {
  id: string;
  videoId: string;
  images: string[];
  correctIndex: number;
  difficulty: Difficulty;
};

export const QUESTIONS: Question[] = [
  {
    id: 'q01',
    videoId: 'hFaoFwoEamI', // Scratch問題のYouTube動画
    images: [
      '/questions/q01/option1.png', // 正解
      '/questions/q01/option2.png',
      '/questions/q01/option3.png',
      '/questions/q01/option4.png',
    ],
    correctIndex: 0,
    difficulty: 'easy', // ★ q01 は easy
  },
  // ここに q02, q03... を追加していく
];
