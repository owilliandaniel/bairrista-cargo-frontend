# BairristaCargo Frontend - AI Coding Guide

**Updated:** January 2026

## Project Overview
React 19 + Vite SPA for a cargo/moving services marketplace. Three distinct user dashboards (empresa/transportadora, motorista/driver, usuario/customer) with role-based access control, integrated with Django REST backend via ngrok.

## Architecture & User Roles

### User Types & Role Mapping
- **empresa** (e): Transportadora companies - manage fleet, drivers, service pricing, marketplace access
- **motorista** (m): Drivers - view assigned jobs and route tracking
- **usuario/cliente** (c/u): End customers - create shipment requests, track moves
- **admin** (a): System administrators

Backend sends single-letter role codes; [PrivateRoute.jsx](src/pages/auth/PrivateRoute.jsx#L26-L35) normalizes via `roleMap` object to route-friendly names (e→empresa, m→motorista, c/u→usuario, a→admin).

### Dashboard Routes & Section-Based Navigation
- `/area-empresa` → [AreaCliente_Empresa.tsx](src/pages/clienteEmpresa/AreaCliente_Empresa.tsx) - Company dashboard
  - Uses `SectionKey` type and state-driven switch rendering in `renderContent()`
  - Sections: marketplace, visao_geral, gestao, financeiro, frota, equipe, rotas, config
  - Nesting example: `gestao` renders [EmpresaOperacional.tsx](src/pages/clienteEmpresa/EmpresaOperacional.tsx)
- `/area-usuario` → [AreaCliente_Usuario.jsx](src/pages/clienteUsuario/AreaCliente_Usuario.jsx) - Customer dashboard
- `/area-motorista` → [AreaCliente_Motorista.jsx](src/pages/clienteMotorista/AreaCliente_Motorista.jsx) - Driver dashboard

## Authentication Flow

### Registration → Code Validation → Auto-Login
1. User registers with email + password via [RegistrarEmpresa.jsx](src/pages/RegistrarEmpresa.jsx) or [RegistrarUsuario.jsx](src/pages/RegistrarUsuario.jsx)
   - Data sent as `multipart/form-data` (see [authService.js](src/services/authService.js#L1-L20))
   - Backend returns success/error in `response.data.detail`
2. Backend sends validation code to email
3. User submits code in [ValidateCodeForm.jsx](src/pages/auth/ValidateCodeForm.jsx)
4. On validation success, backend returns `{ access, refresh, user_id, email, nome, tipo_usuario, empresa_id, ... }`
5. Tokens and user data stored in `localStorage` (keys: `access_token`, `refresh_token`, `user_data`)
6. [AuthContext.tsx](src/contexts/AuthContext.tsx) automatically logs user in via `validateCode()` method

### Token Management & Axios Interceptors
- Centralized axios instance: [api.js](src/services/api.js)
- **Request interceptor** (lines 14-27): Injects `Authorization: Bearer {access_token}` into all requests
- **Response interceptor** (lines 33-73): On 401, attempts refresh via `POST usuarios/login/refresh/` with `{ refresh: refreshToken }`
  - Success: updates `access_token`, retries original request
  - Failure: clears localStorage and redirects to `/login`
- **Critical header**: `'ngrok-skip-browser-warning': 'true'` must be present (set in axios defaults and refresh call)

## API Integration Patterns

### Base Configuration & Axios Setup
- Base URL: `import.meta.env.VITE_API_URL` (set in `.env`), defaults to hardcoded ngrok URL
- All requests go through [api.js](src/services/api.js) - do NOT use raw `fetch` or direct `axios` calls
- Timeout: 10 seconds
- FormData for file uploads: `headers: { 'Content-Type': 'multipart/form-data' }` (example: [authService.js#L3-L20](src/services/authService.js#L3-L20))

### Service Organization
- [api.js](src/services/api.js) - Centralized API functions grouped by domain
  - Exports: `getTiposImovelProxy()`, `simularPrecoMudanca()`, and domain-specific functions (empresas, motoristas, mudancas, etc.)
  - Error handling: log both status and `error.response?.data` for debugging
- [authService.js](src/services/authService.js) - Dedicated auth operations
  - Methods: `register()`, `validateCode()`, `login()`, `logout()`, `getCurrentUser()`, `isAuthenticated()`
  - Always call `authService` methods, never duplicate auth logic
- API functions are imported directly: `import { getFrota, addVeiculo } from '../../services/api'`

### Error Handling Pattern
Standard error extraction across components:
```javascript
} catch (error) {
  const errorMessage = error.response?.data?.detail || 'Erro na operação'
  // Pass to toast via context
}
```

# Copilot Instructions — BairristaCargo Frontend (Concise)

## Quick Start
- **Run**: `npm run dev` (Vite dev server on port 3000 + auto-open)
- **Build**: `npm run build` (production bundle)
- **Lint**: `npm run lint` (ESLint)
- **Test**: `npm run test` (Playwright e2e tests in `./e2e/`)
- **Env**: Create `.env` with `VITE_API_URL=https://{ngrok-url}/api/v1/`

## Core Architecture
- **Stack**: React 19 + Vite + TypeScript + Axios + React Router
- **Types**: [types.ts](src/types.ts) defines `User`, `Mudanca`, `SectionKey`, etc.
- **Auth**: [AuthContext.tsx](src/contexts/AuthContext.tsx) + [authService.js](src/services/authService.js)
- **API**: Centralized axios instance [api.js](src/services/api.js) with request/response interceptors
- **UI**: Dashboard sections use state-driven rendering (see `AreaCliente_Empresa.tsx`)
- **State Management**: No Redux/Zustand - relies on Context API + localStorage for tokens/user data

## Must-Follow Conventions

### localStorage Keys (DO NOT CHANGE)
```javascript
localStorage.setItem('access_token', token)   // JWT access token
localStorage.setItem('refresh_token', token)  // Refresh token
localStorage.setItem('user_data', JSON.stringify(user)) // User object
```
Used by: `AuthContext.tsx`, `api.js`, `authService.js`. Update all three if you rename keys.

### API Requests
- **Always use [api.js](src/services/api.js) exports** — never raw `axios` or `fetch`
- **FormData for uploads**: `const fd = new FormData(); fd.append('file', file)` then `headers: { 'Content-Type': 'multipart/form-data' }`
- **Error parsing**: Extract `error.response?.data?.detail` for user messages
- **Header**: `'ngrok-skip-browser-warning': 'true'` is set globally in api.js; preserve it if adding raw requests

### Role Normalization
- Backend may return single letters (`e`, `m`, `c`, `a`) or full names
- [PrivateRoute.jsx](src/pages/auth/PrivateRoute.jsx#L26-L35) has `roleMap` for translation
- Use `user.tipo_usuario` to check roles; always lowercase before comparing

### File Uploads & Validation
- Use `FormData()` + multipart (example: [CadastrarMotorista.tsx](src/pages/clienteEmpresa/CadastrarMotorista.tsx))
- Brazilian validators: [validators.js](src/utils/validators.js) for CPF/CNPJ/phone
- OCR uploads: [OCRDocumentUpload.jsx](src/pages/auth/OCRDocumentUpload.jsx)
- AI file uploads: [AIFileUpload.jsx](src/pages/auth/AIFileUpload.jsx)

## Patterns & Examples

### Token Refresh Flow
```javascript
// api.js Response Interceptor:
// On 401 → POST usuarios/login/refresh/ with { refresh: token }
// If success: update localStorage['access_token'] and retry request
// If failure: clear localStorage and redirect to /login
```

### Dashboard Section Pattern
```typescript
// AreaCliente_Empresa.tsx uses SectionKey type + setState to render components
const [section, setSection] = useState<SectionKey>('marketplace')
const renderContent = () => {
  switch(section) {
    case 'marketplace': return <Marketplace />
    case 'visao_geral': return <EmpresaOverview />
    // ... etc
  }
}
```

### Toast Notifications
- Context: [ToastContext.tsx](src/contexts/ToastContext.tsx)
- Usage: `const { showToast } = useToast(); showToast('message', 'success' | 'error')`
- Styles: [Toast.css](src/components/Toast.css)

### Reusable Form Hook
- [useRegistration.js](src/hooks/useRegistration.js) for registration forms
- Handles form state, submission, error display

## File Structure (Key Directories)
```
src/
  contexts/          # AuthContext, ToastContext
  services/          # api.js (axios), authService.js (auth methods)
  pages/
    auth/            # LoginForm, RegistrarEmpresa, ValidateCodeForm, PrivateRoute
    clienteEmpresa/  # AreaCliente_Empresa + subsections (Marketplace, Config, etc.)
    clienteUsuario/  # Customer dashboard
    clienteMotorista/# Driver dashboard
  components/        # Reusable UI (Header, Toast, Icons)
  utils/             # validators.js (CPF/CNPJ/phone)
  types.ts           # TypeScript interfaces
e2e/                 # Playwright test specs (auth.spec.ts, ocr.spec.ts)
```

## Code Review Checklist
- **localStorage**: Did you add/rename keys? Update AuthContext, api.js, authService
- **API calls**: Always via api.js exports? FormData for uploads?
- **Auth changes**: Update all usages if modifying token storage or refresh logic
- **Role logic**: Does it handle both single-letter and full role names?
- **Error UX**: Extract error.response?.data?.detail for user toasts
- **Tests**: Add e2e tests in `./e2e/` for critical flows (auth, uploads, marketplace)

## Integration Documentation
See [Roteiro_Integracao_Frontend.md](Roteiro_Integracao_Frontend.md) for complete API endpoint reference, payload examples, and workflow details.
