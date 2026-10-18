export const WORDS_PER_MINUTE = 200;

export function countWords(text: string): number {
  const words = text.trim().match(/[\p{L}\p{N}][\p{L}\p{N}'’.,-]*/gu);
  return words ? words.length : 0;
}

/** Whole minutes, rounded up, never less than one. */
export function readingTimeMinutes(text: string, wordsPerMinute = WORDS_PER_MINUTE): number {
  if (!(wordsPerMinute > 0)) throw new RangeError("wordsPerMinute must be positive");
  return Math.max(1, Math.ceil(countWords(text) / wordsPerMinute));
}
