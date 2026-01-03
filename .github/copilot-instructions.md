# BairristaCargo Frontend - AI Coding Guide

## Project Overview
React + Vite frontend for a cargo/moving services marketplace connecting transportadoras (shipping companies), motoristas (drivers), and clientes (customers). Three distinct user dashboards with role-based access control.

## Architecture & User Roles

### User Types & Role Mapping
- **empresa** (e): Transportadora companies - manage fleet, drivers, and service offerings
- **motorista** (m): Drivers - view assigned jobs (often managed by empresa)
- **usuario/cliente** (c/u): End customers - request and track services
- **admin** (a): System administrators

Role mapping happens in [PrivateRoute.jsx](src/pages/auth/PrivateRoute.jsx#L26-L35) - backend sends single-letter codes, frontend normalizes to full names for routing.

### Dashboard Separation
- `/area-empresa` → [AreaCliente_Empresa.tsx](src/pages/clienteEmpresa/AreaCliente_Empresa.tsx) - Company dashboard with state-driven section rendering using `SectionKey` type
- `/area-usuario` → [AreaCliente_Usuario.jsx](src/pages/clienteUsuario/AreaCliente_Usuario.jsx) - Customer dashboard
- `/area-motorista` → [AreaCliente_Motorista.jsx](src/pages/clienteEmpresa/AreaCliente_Motorista.jsx) - Driver dashboard

## Authentication Flow

### Registration → Validation → Login
1. User registers via [RegistrarEmpresa.jsx](src/pages/RegistrarEmpresa.jsx) or [RegistrarUsuario.jsx](src/pages/RegistrarUsuario.jsx)
2. Backend sends validation code by email
3. User validates with [ValidateCodeForm.jsx](src/pages/auth/ValidateCodeForm.jsx)
4. On successful validation, tokens are stored and user is auto-logged in
5. [AuthContext.tsx](src/contexts/AuthContext.tsx) manages global auth state

### Token Management
- Access token + refresh token stored in `localStorage`
- Axios interceptor in [api.js](src/services/api.js#L14-L73) auto-injects Bearer token and handles refresh on 401
- **Critical**: All requests include `'ngrok-skip-browser-warning': 'true'` header for development (ngrok proxy requirement)
- Refresh token endpoint: `POST usuarios/login/refresh/` with `{ refresh: refreshToken }` body
- On refresh failure, localStorage is cleared and user redirected to `/login`

## API Integration Patterns

### Base Configuration
```javascript
// All API calls go through centralized axios instance in src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'https://...ngrok.../api/v1/'
```

### Service Organization
- [api.js](src/services/api.js) - Centralized API functions grouped by domain (empresas, motoristas, mudancas, etc.)
- [authService.js](src/services/authService.js) - Dedicated auth operations (register, login, validateCode, logout)
- API functions are imported directly: `import { getFrota, addVeiculo } from '../../services/api'`

### Integration Guide
See [Roteiro_Integracao_Frontend.md](Roteiro_Integracao_Frontend.md) for complete API endpoint documentation, payload formats, and integration workflows.

# Copilot instructions — BairristaCargo frontend (concise)

Purpose: make AI contributors productive in this repo. Focus on patterns, commands, and safe edits — not general dev advice.

- **Run / build**: `npm run dev` (Vite), `npm run build`, `npm run preview`, `npm run lint`.
- **Env**: set `VITE_API_URL` in `.env` (points to backend ngrok/URL).

Architecture & key areas
- React + Vite SPA with TypeScript types in [types.ts](src/types.ts)
- Routes and role-protected areas live in `src/App.jsx` and `src/pages/auth/PrivateRoute.jsx`
- Central API layer: `src/services/api.js` (axios instance, token refresh interceptor). All network calls should use functions exported here
- Auth flows live in `src/contexts/AuthContext.tsx` and `src/services/authService.js` (register, validate, login, logout)
- UI patterns: dashboards split per role under `src/pages/clienteEmpresa/` and `src/pages/clienteUsuario/` with state-driven section rendering (see `AreaCliente_Empresa.tsx`)

Important conventions (must-follow)
- All API requests include header `'ngrok-skip-browser-warning': 'true'` — axios instance sets this. Keep it when adding raw fetch/axios calls
- File uploads: use `FormData()` and send `Content-Type: multipart/form-data`. See `src/pages/auth/OCRDocumentUpload.jsx` and `src/pages/clienteEmpresa/CadastrarMotorista.tsx` for examples
- LocalStorage keys: the app expects `access_token`, `refresh_token`, and `user`/`user_data` in places. Do not rename keys unless updating all usages (`AuthContext.tsx`, `api.js`)
- Role normalization: backend may return single letters (e, m, c, a) or full names. Use `PrivateRoute.jsx` roleMap behavior when modifying role logic
- Brazilian validations: use [validators.js](src/utils/validators.js) for CPF/CNPJ/phone formatting and validation

Patterns & examples
- Token refresh: `api.js` intercepts 401 → posts to `usuarios/login/refresh/` with `{ refresh }`. Follow same pattern if adding endpoints that require auth
- Error messages: components use the same extraction pattern from `err.response?.data?.detail` to produce user-facing toast text. Reuse this block instead of inventing new error parsing
- Form handling: `useRegistration.js` is a reusable hook used by registration pages — follow its API when adding new registration-like forms
- Dashboard sections: use `SectionKey` type and switch rendering in `renderContent()` method (see `AreaCliente_Empresa.tsx`)

Where to look (quick links)
- Routing & app entry: `src/App.jsx`
- Auth context: `src/contexts/AuthContext.tsx`
- API helpers: `src/services/api.js`, `src/services/authService.js`
- OCR / AI uploads: `src/pages/auth/OCRDocumentUpload.jsx`, `src/pages/auth/AIFileUpload.jsx`
- Validators: `src/utils/validators.js`
- Toasts: `src/contexts/ToastContext.tsx`, styles in `src/components/Toast.css`
- Types: `src/types.ts`

How AI should edit code (rules)
- Small, focused changes only. Prefer editing single file per PR unless feature spans multiple files
- Preserve existing conventions: token keys, header usage, FormData pattern, and toast-based error UX
- Add unit tests/manual test steps where behavior is critical (auth, upload). If unsure about side effects, leave a TODO comment and notify maintainers

If you change API shapes or token storage
- Update `src/services/api.js`, `src/contexts/AuthContext.tsx`, and any code reading `localStorage` in the same commit

Questions / next steps
- If anything here is unclear or you want more examples (e.g., token refresh or OCR flow), say which area to expand

---
This file is intentionally concise — ask for expansion on any section.
[validators.js](src/utils/validators.js) provides Brazilian-specific validation
