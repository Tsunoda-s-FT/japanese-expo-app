import { Lesson } from '../types/contentTypes';

const learnedSet: Set<string> = new Set();

export function markPhraseAsLearned(phraseId: string) {
  learnedSet.add(phraseId);
}

export function getLessonProgressRatio(lesson: Lesson): number {
  const total = lesson.phrases.length;
  let learned = 0;
  for (const p of lesson.phrases) {
    if (learnedSet.has(p.id)) {
      learned++;
    }
  }
  return total > 0 ? learned / total : 0;
}
