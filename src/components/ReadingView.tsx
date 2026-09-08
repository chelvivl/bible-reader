import { useMemo, useState } from 'react'
import type { BibleData } from '../types/bible'
import {
  getAdjacentChapter,
  getBook,
  getBookTitle,
  getChapter,
  getChapterLocation,
} from '../services/bibleService'
import { NT_FIRST_BOOK_ID } from '../data/constants'
import { useCondensedHeader } from '../hooks/useCondensedHeader'
import { useHorizontalSwipe } from '../hooks/useHorizontalSwipe'
import { FullScreen } from './FullScreen'
import { CheckIcon } from './icons'

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
  const { condensed, onScroll } = useCondensedHeader()

  const swipe = useHorizontalSwipe({
    onPrev: () => prev && onNavigate(prev.bookId, prev.chapterId),
    onNext: () => next && onNavigate(next.bookId, next.chapterId),
    enabledPrev: Boolean(prev),
    enabledNext: Boolean(next),
  })

  const openPicker = () => {
    setDraftBookId(bookId)
    setPickerStep('book')
    setPickerOpen(true)
  }

  const selectChapter = (nextChapterId: number) => {
    onNavigate(draftBookId, nextChapterId)
    setPickerOpen(false)
  }

  const renderBookList = (books: typeof data.Books, title: string) => (
    <section className="picker-group">
      <h3 className="picker-section-title">{title}</h3>
      <div className="inset-list">
        {books.map((item) => {
          const active = item.BookId === bookId
          return (
            <button
              key={item.BookId}
              type="button"
              className={`inset-row${active ? ' inset-row--active' : ''}`}
              onClick={() => {
                setDraftBookId(item.BookId)
                setPickerStep('chapter')
              }}
            >
              <span className="inset-row__label">{getBookTitle(item)}</span>
              <span className="inset-row__trailing">
                {active && (
                  <span className="inset-row__check">
                    <CheckIcon />
                  </span>
                )}
                {item.Chapters.length} гл.
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )

  return (
    <div className="reading-screen">
      <header className={`nav-bar nav-bar--reader${condensed ? ' is-condensed' : ''}`}>
        <span className="nav-bar__slot" />
        <button type="button" className="nav-bar__picker" onClick={openPicker}>
          <span className="nav-bar__picker-title">
            {location ? `${location.bookName} ${location.chapterId}` : 'Выберите главу'}
          </span>
          <span className="nav-bar__picker-caption">Синодальный перевод</span>
        </button>
        <span className="nav-bar__slot" />
      </header>

      <div className="reading-body" onScroll={onScroll} {...swipe}>
        {chapter && location ? (
          <article className="passage">
            <div className="passage__heading">
              <span className="passage__book">{location.bookName}</span>
              <span className="passage__chapter">Глава {location.chapterId}</span>
            </div>
            <p className="passage__text">
              {chapter.Verses.map((verse) => (
                <span key={verse.VerseId}>
                  <span className="verse-num">{verse.VerseId}</span>
                  {verse.Text}{' '}
                </span>
              ))}
            </p>
            <p className="passage__hint">Смахните влево или вправо, чтобы сменить главу</p>
          </article>
        ) : (
          <p className="empty-state">Глава не найдена</p>
        )}
      </div>

      <FullScreen
        open={pickerOpen}
        title={pickerStep === 'book' ? 'Книги' : draftBook ? getBookTitle(draftBook) : 'Главы'}
        onClose={() => setPickerOpen(false)}
        backLabel={pickerStep === 'chapter' ? 'Книги' : undefined}
        onBack={pickerStep === 'chapter' ? () => setPickerStep('book') : undefined}
      >
        {pickerStep === 'book' ? (
          <div className="picker-sections">
            {renderBookList(otBooks, 'Ветхий Завет')}
            {renderBookList(ntBooks, 'Новый Завет')}
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
      </FullScreen>
    </div>
  )
}
