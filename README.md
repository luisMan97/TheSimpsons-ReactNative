# Simpsons Notes (Expo RN)

Aplicacion movil para consumir The Simpsons API, autenticar usuarios localmente y gestionar notas/favoritos por personaje.

## Setup

Requisitos:

- Node 20+
- Expo CLI (`npm install -g expo-cli`) o `npx expo`
- iOS Simulator / Android Emulator (opcional)

Instalacion:

```bash
npm install
```

Ejecutar:

```bash
npm run ios
npm run android
npm run web
```

Tests:

```bash
npm run test
```

Lint/format:

```bash
npm run lint
npm run format
```

## Decisiones tecnicas

- Expo managed + Expo Router: velocidad de entrega en 8h y rutas por archivos claras.
- SQLite (`expo-sqlite`): persistencia offline con modelo relacional sencillo (usuarios/notas).
- SecureStore: token de sesion persistido de forma segura.
- TanStack Query: cache, paginacion y estados de red con `useInfiniteQuery`.
- React Hook Form + Zod: formularios tipados con validacion consistente.
- Hash de password en JS: PBKDF2 (CryptoJS) + salt. Trade-off: menos robusto que bcrypt nativo, pero funciona en Expo managed.

## Arquitectura

Estructura feature-based con core compartido:

```
app/
  (auth)/login.tsx, register.tsx
  (app)/characters, notes, episodes
core/
  api/
  db/
  providers/
  session/
  utils/
features/
  auth/
  notes/
components/
```

Diagrama simple:

```
UI (app/*) -> features/* (validation)
UI -> core/api (Simpsons API)
UI -> core/db (SQLite)
core/session -> SecureStore
```

## Modelo de datos (SQLite)

```
users:
  id (uuid)
  email (unique)
  passwordHash
  passwordSalt
  createdAt

notes:
  id (uuid)
  userId
  characterId
  title
  text
  rating (0-5)
  updatedAt
```

## The Simpsons API

Client en `core/api/simpsonsApi.ts`:

- `getCharacters({ page, nameQuery })`
- `getCharacterById(id)`
- `getEpisodes({ page })`
- `getEpisodeById(id)`

Base URL usada: `https://thesimpsonsapi.com/api`  
Mapeo de media: `portrait_path` (personajes) y `image_path` (episodios) usan el CDN oficial.

Paginacion: la API devuelve 20 items por pagina; el infinite scroll respeta ese tamano y usa `page` incremental.

## Sesion

- Token generado en memoria por login/registro.
- Persistencia segura en SecureStore (`core/session/sessionStorage.ts`).
- Se restaura en el arranque antes de mostrar rutas protegidas.

## Limitaciones y mejoras futuras

- Sin sincronizacion remota: usuarios/notas solo locales.
- UI aun basica: se puede mejorar con tema, skeletons mas sofisticados y animaciones.
- Cobertura de tests incluye validaciones, repositorios y un hook base; se puede ampliar con mas flujos de UI.

## Cheatsheet de rutas

- `/login`, `/register`
- `/characters` (listado + busqueda)
- `/characters/[id]` (detalle + notas)
- `/notes/edit` (crear/editar)
- `/episodes` (listado)
- `/episodes/[id]` (detalle)

## Scripts

- `npm run start` (dev)
- `npm run ios` / `npm run android`
- `npm run test`
- `npm run lint`
- `npm run format`
