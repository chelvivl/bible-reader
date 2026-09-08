import { useState } from 'react'

type Tab = 'read' | 'search' | 'bookmarks'

const SAMPLE_PASSAGE = {
  reference: 'Ин. 3:16',
  verses: [
    { num: 16, text: 'Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий, верующий в Него, не погиб, но имел жизнь вечную.' },
  ],
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('read')

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Bible Reader</h1>
          <p className="app-header__subtitle">Чтение · Поиск · Закладки</p>
        </div>
        <button type="button" className="icon-button" aria-label="Меню">
          <MenuIcon />
        </button>
      </header>

      <main className="reader">
        {activeTab === 'read' && (
          <article className="passage-card">
            <span className="passage-card__reference">{SAMPLE_PASSAGE.reference}</span>
            <p className="passage-card__text">
              {SAMPLE_PASSAGE.verses.map((verse) => (
                <span key={verse.num}>
                  <span className="verse-num">{verse.num}</span>
                  {verse.text}{' '}
                </span>
              ))}
            </p>

            <div className="placeholder-note">
              <p className="placeholder-note__title">Заготовка готова</p>
              <p className="placeholder-note__text">
                Здесь будет выбор книги, главы и перевода. Текст Библии подключим на следующем этапе по вашему ТЗ.
              </p>
            </div>
          </article>
        )}

        {activeTab === 'search' && (
          <div className="placeholder-note">
            <p className="placeholder-note__title">Поиск</p>
            <p className="placeholder-note__text">
              Раздел поиска по Писанию появится после описания требований.
            </p>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="placeholder-note">
            <p className="placeholder-note__title">Закладки</p>
            <p className="placeholder-note__text">
              Сохранённые места для чтения будут здесь.
            </p>
          </div>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Основная навигация">
        <button
          type="button"
          className={`nav-item${activeTab === 'read' ? ' nav-item--active' : ''}`}
          onClick={() => setActiveTab('read')}
        >
          <BookIcon />
          <span>Чтение</span>
        </button>
        <button
          type="button"
          className={`nav-item${activeTab === 'search' ? ' nav-item--active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <SearchIcon />
          <span>Поиск</span>
        </button>
        <button
          type="button"
          className={`nav-item${activeTab === 'bookmarks' ? ' nav-item--active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          <BookmarkIcon />
          <span>Закладки</span>
        </button>
      </nav>
    </div>
  )
}

export default App
