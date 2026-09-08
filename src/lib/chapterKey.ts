import type { ChapterRef } from '../types/bible'

export function chapterKey(ref: ChapterRef): string {
  return `${ref.bookId}:${ref.chapterId}`
}

export function parseChapterKey(key: string): ChapterRef {
  const [bookId, chapterId] = key.split(':').map(Number)
  return { bookId, chapterId }
}
