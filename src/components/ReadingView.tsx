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
import { useHorizontalSwipe } from '../hooks/useHorizontalSwipe'
import { FullScreen } from './FullScreen'

interface ReadingViewProps {
  data: BibleData
  bookId: number
  chapterId: number
  onNavigate: (bookId: number, chapterId: number) => void
}

export function ReadingView({ data, bookId, chapterId, onNavigate }: ReadingViewProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerStep, setPickerStep] = useState<'book' | 'chapter'>('book')
  const [draftBookId, setDraftBookId] = useState(bookId)

  const chapter = getChapter(data, bookId, chapterId)
  const location = getChapterLocation(data, { bookId, chapterId })
  const { prev, next } = getAdjacentChapter(data, bookId, chapterId)
  const otBooks = useMemo(() => data.Books.filter((item) => item.BookId < NT_FIRST_BOOK_ID), [data])
  const ntBooks = useMemo(() => data.Books.filter((item) => item.BookId >= NT_FIRST_BOOK_ID), [data])
  const draftBook = getBook(data, draftBookId)

  const goPrev = () => prev && onNavigate(prev.bookId, prev.chapterId)
  const goNext = () => next && onNavigate(next.bookId, next.chapterId)

  const swipe = useHorizontalSwipe({
    onPrev: goPrev,
    onNext: goNext,
    enabledPrev: Boolean(prev),
    enabledNext: Boolean(next),
  })

  const openPicker = () => {
    setDraftBookId(bookId)
    setPickerStep('book')
    setPickerOpen(true)
  }

  const selectBook = (nextBookId: number) => {
    setDraftBookId(nextBookId)
    setPickerStep('chapter')
  }

  const selectChapter = (nextChapterId: number) => {
    onNavigate(draftBookId, nextChapterId)
    setPickerOpen(false)
  }

  return (
    <div className="reading-screen">
      <header className="reader-nav">
        <button type="button" className="header-picker" onClick={openPicker}>
          <span className="header-picker__label">Синодальный перевод</span>
          <span className="header-picker__value">
            {location ? formatReference(location) : 'Выберите главу'}
          </span>
        </button>
      </header>

      <div className="reading-body" {...swipe}>
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
      </div>

      <FullScreen
        open={pickerOpen}
        title={pickerStep === 'book' ? 'Книга' : draftBook?.BookName ?? 'Глава'}
        onClose={() => setPickerOpen(false)}
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
            <button type="button" className="text-button" onClick={() => setPickerStep('book')}>
              Все книги
            </button>
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
          </>
        )}
      </FullScreen>
    </div>
  )
}
