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
    <>
      <div className="reading-toolbar">
        <button
          type="button"
          className="selector-chip"
          onClick={openPicker}
          aria-label="Выбрать книгу и главу"
        >
          <span className="selector-chip__label">Синодальный перевод</span>
          <span className="selector-chip__value">
            {location ? formatReference(location) : 'Выберите главу'}
          </span>
        </button>
      </div>

      <article className="passage-card">
        {chapter ? (
          <>
            <span className="passage-card__reference">
              {location ? formatReference(location) : ''}
            </span>
            <p className="passage-card__text">
              {chapter.Verses.map((verse) => (
                <span key={verse.VerseId}>
                  <span className="verse-num">{verse.VerseId}</span>
                  {verse.Text}{' '}
                </span>
              ))}
            </p>
          </>
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
        title={pickerStep === 'book' ? 'Книга' : draftBook?.BookName ?? 'Глава'}
        onClose={() => setPickerOpen(false)}
      >
        {pickerStep === 'book' ? (
          <div className="picker-sections">
            <section>
              <h3 className="picker-section-title">Ветхий Завет</h3>
              <div className="book-grid">
                {otBooks.map((item) => (
                  <button
                    key={item.BookId}
                    type="button"
                    className={`book-chip${item.BookId === bookId ? ' book-chip--active' : ''}`}
                    onClick={() => selectBook(item.BookId)}
                  >
                    {item.BookName}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h3 className="picker-section-title">Новый Завет</h3>
              <div className="book-grid">
                {ntBooks.map((item) => (
                  <button
                    key={item.BookId}
                    type="button"
                    className={`book-chip${item.BookId === bookId ? ' book-chip--active' : ''}`}
                    onClick={() => selectBook(item.BookId)}
                  >
                    {item.BookName}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
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
        )}

        {pickerStep === 'chapter' && (
          <button
            type="button"
            className="text-button"
            onClick={() => setPickerStep('book')}
          >
            ← Выбрать другую книгу
          </button>
        )}
      </BottomSheet>
    </>
  )
}
