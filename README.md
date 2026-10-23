# Yarok

Сайт производителя бетонных изделий: каталог с вариантами по цвету и цене, форма заявки и административная часть для создания и редактирования товаров.

Frontend: Nuxt 4, Vue 3, TypeScript, Nuxt UI, Tailwind CSS. Backend — отдельный репозиторий `yarok-be` на ASP.NET Core.

## Архитектура

```text
Браузер → Nuxt :3000 → /api/** → ASP.NET Core :5050 → PostgreSQL
                                                  → Supabase Storage
                                                  → SMTP
```

API и административная HttpOnly cookie доступны браузеру через origin Nuxt. PostgreSQL хранит каталог, Supabase Storage — изображения, SMTP отправляет заявки. Yandex Maps загружается в браузере. Старый Nuxt-сервер удалён; его реализация сохранена в истории Git.

## Требования

- Node.js 22.17.1 (`.nvmrc`) и npm 10.
- Репозиторий `yarok-be` рядом с frontend: `../yarok-be`.
- .NET SDK из `yarok-be/global.json` (сейчас 10.0.302).
- PostgreSQL и клиентские команды `createdb`, `psql`.
- Для изображений — Supabase с публичным bucket `products-images`.
- Для заявок — SMTP с авторизацией; для карты — браузерный ключ Yandex Maps.

## Локальный запуск

PowerShell, из корня frontend:

```powershell
npm ci
Copy-Item .env.example .env
Copy-Item ../yarok-be/.env.example ../yarok-be/.env
```

Заполните backend `.env` и подготовьте новую локальную базу по [инструкции окружения](docs/development.md). Backend требует настройки БД, администратора, Storage и SMTP при старте. Серверные секреты должны находиться в backend `.env`, а не в `NUXT_PUBLIC_*`.

Первый терминал:

```powershell
& ../yarok-be/scripts/Start-Dev.ps1 -EnvFile ../yarok-be/.env
```

Второй терминал:

```powershell
npm run dev
```

Откройте [сайт](http://localhost:3000), [каталог](http://localhost:3000/catalog) или [вход администратора](http://localhost:3000/admin/login). Учётные данные задаются в backend `.env`.

## Проверки

```powershell
npm run lint
npm run typecheck
npm run build
```

Изолированные проверки backend без внешних сервисов:

```powershell
& ../yarok-be/scripts/Test-Isolated.ps1
```

Frontend-тесты и CI пока не настроены.

## Production

```powershell
npm run build
npm run preview
```

`preview` используется для локальной проверки. Запуск собранного Node-сервера:

```powershell
node .output/server/index.mjs
```

`YAROK_BACKEND_URL` задаётся **до сборки**: адрес встраивается в правило proxy. В production передавайте `NUXT_PUBLIC_SITE_URL` и `NUXT_PUBLIC_YANDEX_MAPS_API_KEY` через окружение процесса: Node-сервер не загружает `.env` автоматически. API требует работающего backend; статическая генерация не заменяет серверный proxy.

Настройки, тестовые данные и ручная проверка: [локальное окружение](docs/development.md).
