export interface Verse {
  VerseId: number
  Text: string
}

export interface Chapter {
  ChapterId: number
  Verses: Verse[]
}

export interface Book {
  BookId: number
  BookName: string
  Chapters: Chapter[]
}

export interface BibleData {
  Translation: string
  Books: Book[]
}

export interface ChapterRef {
  bookId: number
  chapterId: number
}

export interface ChapterLocation extends ChapterRef {
  bookName: string
}
