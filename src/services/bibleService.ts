import type { BibleData, Book, Chapter, ChapterLocation, ChapterRef } from '../types/bible'
import { NT_FIRST_BOOK_ID, OT_LAST_BOOK_ID } from '../data/constants'

let cache: BibleData | null = null

function dataUrl(): string {
  const base = import.meta.env.BASE_URL
  return `${base}data/rst.json`
}

export async function loadBible(): Promise<BibleData> {
  if (cache) return cache
  const response = await fetch(dataUrl())
  if (!response.ok) throw new Error('Не удалось загрузить текст Библии')
  cache = (await response.json()) as BibleData
  return cache
}

export function getBook(data: BibleData, bookId: number): Book | undefined {
  return data.Books.find((book) => book.BookId === bookId)
}

export function getChapter(data: BibleData, bookId: number, chapterId: number): Chapter | undefined {
  return getBook(data, bookId)?.Chapters.find((chapter) => chapter.ChapterId === chapterId)
}

export function getChapterLocation(data: BibleData, ref: ChapterRef): ChapterLocation | undefined {
  const book = getBook(data, ref.bookId)
  if (!book) return undefined
  return { ...ref, bookName: book.BookName }
}

export function formatReference(location: ChapterLocation): string {
  return `${location.bookName} ${location.chapterId}`
}

export function getAllChapterRefs(data: BibleData, scope: 'all' | 'ot' | 'nt'): ChapterRef[] {
  const refs: ChapterRef[] = []
  for (const book of data.Books) {
    if (scope === 'ot' && book.BookId > OT_LAST_BOOK_ID) continue
    if (scope === 'nt' && book.BookId < NT_FIRST_BOOK_ID) continue
    for (const chapter of book.Chapters) {
      refs.push({ bookId: book.BookId, chapterId: chapter.ChapterId })
    }
  }
  return refs
}

export function getAdjacentChapter(
  data: BibleData,
  bookId: number,
  chapterId: number,
): { prev?: ChapterRef; next?: ChapterRef } {
  const book = getBook(data, bookId)
  if (!book) return {}

  const chapterIndex = book.Chapters.findIndex((chapter) => chapter.ChapterId === chapterId)
  if (chapterIndex === -1) return {}

  let prev: ChapterRef | undefined
  let next: ChapterRef | undefined

  if (chapterIndex > 0) {
    prev = { bookId, chapterId: book.Chapters[chapterIndex - 1].ChapterId }
  } else {
    const bookIndex = data.Books.findIndex((item) => item.BookId === bookId)
    if (bookIndex > 0) {
      const prevBook = data.Books[bookIndex - 1]
      prev = {
        bookId: prevBook.BookId,
        chapterId: prevBook.Chapters[prevBook.Chapters.length - 1].ChapterId,
      }
    }
  }

  if (chapterIndex < book.Chapters.length - 1) {
    next = { bookId, chapterId: book.Chapters[chapterIndex + 1].ChapterId }
  } else {
    const bookIndex = data.Books.findIndex((item) => item.BookId === bookId)
    if (bookIndex < data.Books.length - 1) {
      const nextBook = data.Books[bookIndex + 1]
      next = { bookId: nextBook.BookId, chapterId: nextBook.Chapters[0].ChapterId }
    }
  }

  return { prev, next }
}
