# Bible Reader

PWA-приложение для чтения Библии. Сейчас это заготовка: базовый экран чтения, навигация и offline-ready shell.

## Стек

- Vite + React + TypeScript
- vite-plugin-pwa (manifest + service worker)

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте адрес из терминала (обычно `http://localhost:5173`).

## Сборка

```bash
npm run build
npm run preview
```

## Публикация на GitHub Pages

1. Создайте репозиторий на GitHub и запушьте проект.
2. В настройках репозитория: **Settings → Pages → Build and deployment → GitHub Actions**.
3. После push в `main` workflow `.github/workflows/deploy.yml` соберёт и опубликует приложение.
4. На телефоне откройте URL вида `https://<username>.github.io/bible-reader/` и добавьте на домашний экран («Установить приложение» / «Add to Home Screen»).

Если репозиторий будет называться иначе — поменяйте `base` в `vite.config.ts` и переменную `GITHUB_PAGES` в workflow.

## Что дальше

- Подключение текста Библии и переводов
- Выбор книги / главы
- Поиск, закладки, настройки чтения

Требования к функциональности — в следующем ТЗ.
