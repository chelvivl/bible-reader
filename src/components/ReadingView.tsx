import { useMemo, useState } from 'react'
import type { BibleData } from '../types/bible'
import {
  formatReference,
  getAdjacentChapter,
  getBook,
  getChapter,
  getChapterLocation,
} from '../services/bibleService'
import { NT_FIRST_BOOK_ID } from '../data/constants'
import { BottomSheet } from './BottomSheet'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface ReadingViewProps {
  data: BibleData
  bookId: number
  chapterId: number
  pickerOpen: boolean
  onPickerOpenChange: (open: boolean) => void
  onNavigate: (bookId: number, chapterId: number) => void
}

export function ReadingView({
  data,
  bookId,
  chapterId,
  pickerOpen,
  onPickerOpenChange,
  onNavigate,
}: ReadingViewProps) {
  const [pickerStep, setPickerStep] = useState<'book' | 'chapter'>('book')
  const [draftBookId, setDraftBookId] = useState(bookId)

  const chapter = getChapter(data, bookId, chapterId)
  const location = getChapterLocation(data, { bookId, chapterId })
  const { prev, next } = getAdjacentChapter(data, bookId, chapterId)
  const otBooks = useMemo(() => data.Books.filter((item) => item.BookId < NT_FIRST_BOOK_ID), [data])
  const ntBooks = useMemo(() => data.Books.filter((item) => item.BookId >= NT_FIRST_BOOK_ID), [data])
  const draftBook = getBook(data, draftBookId)

  const openPicker = () => {
    setDraftBookId(bookId)
    setPickerStep('book')
    onPickerOpenChange(true)
  }

  const closePicker = () => {
    onPickerOpenChange(false)
  }

  const selectBook = (nextBookId: number) => {
    setDraftBookId(nextBookId)
    setPickerStep('chapter')
  }

  const selectChapter = (nextChapterId: number) => {
    onNavigate(draftBookId, nextChapterId)
    closePicker()
  }

  return (
    <>
      <article className="passage-card">
        {chapter ? (
          <p className="passage-card__text">
            {chapter.Verses.map((verse) => (
              <span key={verse.VerseId}>
                <span className="verse-num">{verse.VerseId}</span>
                {verse.Text}{' '}
              </span>
            ))}
          </p>
        ) : (
          <p className="empty-state">Глава не найдена</p>
        )}
      </article>

      <div className="chapter-nav">
        <button
          type="button"
          className="nav-pill"
          disabled={!prev}
          onClick={() => prev && onNavigate(prev.bookId, prev.chapterId)}
        >
          <ChevronLeftIcon />
          <span>Назад</span>
        </button>
        <button
          type="button"
          className="nav-pill nav-pill--accent"
          onClick={openPicker}
        >
          {location ? formatReference(location) : 'Глава'}
        </button>
        <button
          type="button"
          className="nav-pill"
          disabled={!next}
          onClick={() => next && onNavigate(next.bookId, next.chapterId)}
        >
          <span>Далее</span>
          <ChevronRightIcon />
        </button>
      </div>

      <BottomSheet
        open={pickerOpen}
        title={pickerStep === 'book' ? 'Выбор книги' : draftBook?.BookName ?? 'Глава'}
        onClose={closePicker}
      >
        {pickerStep === 'book' ? (
          <div className="picker-sections">
            <section className="picker-group">
              <h3 className="picker-section-title">Ветхий Завет</h3>
              <div className="book-list">
                {otBooks.map((item) => (
                  <button
                    key={item.BookId}
                    type="button"
                    className={`book-row${item.BookId === bookId ? ' book-row--active' : ''}`}
                    onClick={() => selectBook(item.BookId)}
                  >
                    <span>{item.BookName}</span>
                    <span className="book-row__meta">{item.Chapters.length} гл.</span>
                  </button>
                ))}
              </div>
            </section>
            <section className="picker-group">
              <h3 className="picker-section-title">Новый Завет</h3>
              <div className="book-list">
                {ntBooks.map((item) => (
                  <button
                    key={item.BookId}
                    type="button"
                    className={`book-row${item.BookId === bookId ? ' book-row--active' : ''}`}
                    onClick={() => selectBook(item.BookId)}
                  >
                    <span>{item.BookName}</span>
                    <span className="book-row__meta">{item.Chapters.length} гл.</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <>
            <div className="chapter-grid">
              {draftBook?.Chapters.map((item) => (
                <button
                  key={item.ChapterId}
                  type="button"
                  className={`chapter-chip${
                    draftBookId === bookId && item.ChapterId === chapterId ? ' chapter-chip--active' : ''
                  }`}
                  onClick={() => selectChapter(item.ChapterId)}
                >
                  {item.ChapterId}
                </button>
              ))}
            </div>
            <button type="button" className="text-button" onClick={() => setPickerStep('book')}>
              ← Другая книга
            </button>
          </>
        )}
      </BottomSheet>
    </>
  )
}
