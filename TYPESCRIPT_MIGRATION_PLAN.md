# 🎯 TypeScript Migration Plan - BairristaCargo Frontend

**Created:** January 7, 2026  
**Project Status:** Partial TypeScript Migration (35% Complete)  
**Backend Policy:** ❌ **DO NOT MODIFY BACKEND CODE**

---

## 📊 Current State Analysis

### TypeScript Configuration Status
- ✅ TypeScript installed (`^5.9.3`)
- ✅ `types.ts` file exists with core interfaces
- ✅ React TypeScript types installed
- ❌ **Missing `tsconfig.json`** - CRITICAL BLOCKER
- ⚠️ ESLint configured only for `.js/.jsx` files
- ⚠️ 4 ESLint errors + 1 warning in current codebase

### Current Migration Status

#### ✅ Already TypeScript (14 files - 35%)
1. **Core Configuration**
   - `src/main.tsx` - Entry point
   - `src/types.ts` - Type definitions
   - `src/vite-env.d.ts` - Vite types

2. **Contexts (2/2 - 100%)**
   - ✅ `src/contexts/AuthContext.tsx`
   - ✅ `src/contexts/ToastContext.tsx`

3. **Enterprise Dashboard (9/9 - 100%)**
   - ✅ `src/pages/clienteEmpresa/AreaCliente_Empresa.tsx`
   - ✅ `src/pages/clienteEmpresa/CadastrarMotorista.tsx`
   - ✅ `src/pages/clienteEmpresa/CadastrarOferta.tsx`
   - ✅ `src/pages/clienteEmpresa/CadastrarVeiculo.tsx`
   - ✅ `src/pages/clienteEmpresa/ContasBancarias.tsx`
   - ✅ `src/pages/clienteEmpresa/EmpresaConfig.tsx`
   - ✅ `src/pages/clienteEmpresa/EmpresaFinanceiro.tsx`
   - ✅ `src/pages/clienteEmpresa/EmpresaOperacional.tsx`
   - ✅ `src/pages/clienteEmpresa/EmpresaOverview.tsx`
   - ✅ `src/pages/clienteEmpresa/Marketplace.tsx`
   - ✅ `src/pages/clienteEmpresa/NotasFiscais.tsx`
   - ✅ `src/pages/clienteEmpresa/VisualizarOfertas.tsx`

4. **Test Files**
   - ✅ `e2e/auth.spec.ts`
   - ✅ `e2e/ocr.spec.ts`
   - ✅ `playwright.config.ts`
   - ✅ `tests/example.spec.ts`

---

#### ⚠️ Pending JavaScript Files (26 files - 65%)

### Priority 1: Core Infrastructure (4 files) 🔴
**Impact:** High - Used by all other components  
**Dependencies:** None

1. **`src/services/api.js`** (418 lines)
   - Axios instance with interceptors
   - 40+ API functions
   - Token refresh logic
   - Used by: EVERY component making API calls
   - **Complexity:** High
   - **Risk:** Medium (well-tested)

2. **`src/services/authService.js`** (105 lines)
   - Authentication operations
   - Token management
   - Used by: AuthContext, all auth pages
   - **Complexity:** Medium
   - **Risk:** Low

3. **`src/utils/validators.js`** (117 lines)
   - CPF, CNPJ, email, phone validators
   - Pure functions
   - Used by: All registration/config forms
   - **Complexity:** Low
   - **Risk:** Very Low

4. **`src/hooks/useRegistration.js`** (71 lines)
   - Registration form logic
   - Used by: RegistrarEmpresa, RegistrarUsuario
   - **Complexity:** Medium
   - **Risk:** Low

---

### Priority 2: Authentication & Routing (6 files) 🟠
**Impact:** Critical - Guards app access  
**Dependencies:** Priority 1 (services, hooks)

5. **`src/pages/auth/LoginForm.jsx`** (208 lines)
6. **`src/pages/auth/ValidateCodeForm.jsx`** (134 lines)
7. **`src/pages/auth/PrivateRoute.jsx`** (70 lines)
8. **`src/pages/auth/OCRDocumentUpload.jsx`** (107 lines)
9. **`src/pages/auth/AIFileUpload.jsx`** (79 lines)
10. **`src/pages/auth/AuthCard.jsx`** (22 lines)

---

### Priority 3: Public Pages (4 files) 🟡
**Impact:** Medium - Entry points for users  
**Dependencies:** Priority 1 + 2

11. **`src/pages/LandingPage.jsx`** (595 lines)
12. **`src/pages/RegistrarEmpresa.jsx`** (166 lines)
13. **`src/pages/RegistrarUsuario.jsx`** (161 lines)
14. **`src/pages/SimularPreco.jsx`** (595 lines)
15. **`src/pages/Home.jsx`** (129 lines)

---

### Priority 4: Customer Dashboard (7 files) 🟢
**Impact:** High - Main user interface  
**Dependencies:** Priority 1 + 2

16. **`src/pages/clienteUsuario/AreaCliente_Usuario.jsx`** (129 lines)
    - **Current Issues:** `setOrders` unused variable (ESLint error)

17. **`src/pages/clienteUsuario/Dashboard.jsx`** (50 lines)
18. **`src/pages/clienteUsuario/Solicitacoes.jsx`** (133 lines)
19. **`src/pages/clienteUsuario/PropostasRecebidas.jsx`** (242 lines)
    - **Current Issues:** Missing `carregarPropostas` dependency (ESLint warning)

20. **`src/pages/clienteUsuario/Pagamentos.jsx`** (577 lines)
21. **`src/pages/clienteUsuario/AvaliacaoMudanca.jsx`** (244 lines)
22. **`src/pages/clienteUsuario/Config.jsx`** (89 lines)
    - **Current Issues:** `user` unused variable (ESLint error)

---

### Priority 5: Driver Dashboard (2 files) 🟢
**Impact:** Medium  
**Dependencies:** Priority 1 + 2

23. **`src/pages/clienteMotorista/AreaCliente_Motorista.jsx`** (287 lines)
24. **`src/pages/clienteMotorista/WorkflowMudanca.jsx`** (198 lines)

---

### Priority 6: Shared Components (4 files) 🔵
**Impact:** Low - UI components  
**Dependencies:** Priority 1

25. **`src/components/Header.jsx`**
26. **`src/components/BackendStatus.jsx`**
27. **`src/components/EmpresaIcons.jsx`**
28. **`src/components/NotificationCenter.jsx`**
29. **`src/components/mudancas/InventarioIA.jsx`**

---

### Priority 7: Root Components (2 files) 🔵
**Impact:** Critical but small  
**Dependencies:** All others

30. **`src/App.jsx`** (67 lines)
31. **`src/pages/clienteEmpresa.jsx`** (188 lines) - Duplicate/deprecated?

---

## 🛠️ Pre-Migration Tasks (Required Before Any Conversion)

### 1. Create `tsconfig.json` (CRITICAL)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true,
    "checkJs": false
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2. Create `tsconfig.node.json`
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.js"]
}
```

### 3. Update ESLint Configuration
Modify `eslint.config.js` to include TypeScript files:
```javascript
{
  files: ['**/*.{js,jsx,ts,tsx}'], // Add ts, tsx
  // Add TypeScript parser if needed
}
```

### 4. Fix Current ESLint Errors
Before migration, resolve:
- ❌ `src/hooks/useRegistration.js:34` - Remove unused `res` variable
- ❌ `src/pages/auth/ValidateCodeForm.jsx:25` - Remove unused `err` variable
- ❌ `src/pages/clienteUsuario/AreaCliente_Usuario.jsx:26` - Remove unused `setOrders`
- ❌ `src/pages/clienteUsuario/Config.jsx:4` - Remove unused `user`
- ⚠️ `src/pages/clienteUsuario/PropostasRecebidas.jsx:23` - Add `carregarPropostas` to deps

---

## 📝 Migration Strategy

### Phase 1: Foundation (Week 1)
**Goal:** Establish TypeScript infrastructure

1. ✅ Create `tsconfig.json` and `tsconfig.node.json`
2. ✅ Update ESLint config for TS support
3. ✅ Fix all current ESLint errors
4. ✅ Verify build process works with mixed JS/TS

### Phase 2: Core Services (Week 1-2)
**Files:** `api.js`, `authService.js`, `validators.js`, `useRegistration.js`

**Order:**
1. `validators.js` → `validators.ts` (easiest, no dependencies)
2. `authService.js` → `authService.ts` (depends on api.js types)
3. `api.js` → `api.ts` (most complex, define all API response types)
4. `useRegistration.js` → `useRegistration.ts`

**Key Actions:**
- Define API response interfaces in `types.ts`
- Add generic types for axios responses
- Export typed API functions

### Phase 3: Authentication Layer (Week 2)
**Files:** All `src/pages/auth/*.jsx`

**Order (by complexity):**
1. `AuthCard.jsx` (simplest)
2. `AIFileUpload.jsx`
3. `OCRDocumentUpload.jsx`
4. `ValidateCodeForm.jsx`
5. `LoginForm.jsx`
6. `PrivateRoute.jsx` (most complex - type guards)

### Phase 4: Public Pages (Week 3)
**Order:**
1. `Home.jsx`
2. `RegistrarUsuario.jsx`
3. `RegistrarEmpresa.jsx`
4. `SimularPreco.jsx` (largest)
5. `LandingPage.jsx` (largest)

### Phase 5: Dashboard Components (Week 3-4)
**Order by user role:**
1. Customer dashboard (7 files)
2. Driver dashboard (2 files)
3. Shared components (4 files)

### Phase 6: Root & Finalization (Week 4)
1. `App.jsx` → `App.tsx`
2. Remove deprecated `clienteEmpresa.jsx` if unused
3. Strict TypeScript mode audit
4. Documentation update

---

## 🔄 Conversion Checklist (Per File)

### Before Converting:
- [ ] Read entire file to understand logic
- [ ] Identify all props, state, API calls
- [ ] Check dependencies (are they typed?)
- [ ] Note any `any` types that will be needed temporarily

### During Conversion:
1. [ ] Rename `.jsx` → `.tsx` or `.js` → `.ts`
2. [ ] Add prop interfaces (name as `<ComponentName>Props`)
3. [ ] Type all `useState` hooks
4. [ ] Type all `useEffect` dependencies
5. [ ] Type event handlers (e.g., `React.ChangeEvent<HTMLInputElement>`)
6. [ ] Type API response data
7. [ ] Remove `React.FC` (not recommended in React 19)
8. [ ] Use `children: React.ReactNode` for child props

### After Converting:
- [ ] Run `npm run lint` - must pass
- [ ] Run `npm run build` - must succeed
- [ ] Test in browser (critical user flows)
- [ ] Update imports in consuming files
- [ ] Commit with message: `feat: migrate <ComponentName> to TypeScript`

---

## 🎯 Type Definitions Needed in `types.ts`

### Expand Current Types:
```typescript
// Add these to types.ts

// API Response Wrappers
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Registration/Auth
export interface RegistrationData {
  nome: string
  email: string
  telefone: string
  senha: string
  confirmar_senha: string
  tipo_usuario: 'C' | 'E' | 'M'
  cnpj?: string
  nome_fantasia?: string
  tipo_atuacao?: string
}

export interface LoginCredentials {
  email: string
  senha: string
}

export interface ValidationCode {
  email: string
  codigo: string
}

export interface TokenResponse {
  access: string
  refresh: string
  user_id: number
  email: string
  nome: string
  tipo_usuario: string
  empresa_id?: number
  nome_fantasia?: string
  tipo_atuacao?: string
}

// Motorista/Driver
export interface Motorista {
  id: number
  nome: string
  cpf: string
  cnh: string
  categoria_cnh: string
  telefone: string
  email: string
  empresa: number
}

// Proposta/Offer
export interface Proposta {
  id: number
  mudanca: number
  empresa: number
  valor_proposto: number
  prazo_execucao: number
  observacoes: string
  status: 'pendente' | 'aceita' | 'recusada'
  criado_em: string
}

// Orcamento/Budget
export interface Orcamento {
  id: number
  mudanca: number
  valor_total: number
  valor_ajudantes: number
  valor_empacotamento: number
  valor_seguro: number
  observacoes: string
}

// Form Events
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>
export type TextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>

// Component Props (common patterns)
export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
}

export interface FormFieldProps extends BaseComponentProps {
  label: string
  name: string
  value: string | number
  onChange: (e: InputChangeEvent) => void
  required?: boolean
  disabled?: boolean
  error?: string
}
```

---

## 🚨 Common Pitfalls & Solutions

### 1. `any` Type Overuse
❌ **Bad:**
```typescript
const data: any = await api.get('/endpoint')
```

✅ **Good:**
```typescript
const { data } = await api.get<Mudanca[]>('/mudancas/')
```

### 2. Event Handler Types
❌ **Bad:**
```typescript
const handleChange = (e: any) => { ... }
```

✅ **Good:**
```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }
```

### 3. Props Destructuring
❌ **Bad:**
```typescript
export const Component = ({ prop1, prop2 }) => { ... }
```

✅ **Good:**
```typescript
interface ComponentProps {
  prop1: string
  prop2: number
}

export const Component = ({ prop1, prop2 }: ComponentProps) => { ... }
```

### 4. Optional Chaining for API Data
✅ **Always use:**
```typescript
const userName = user?.nome ?? 'Guest'
const errorMsg = error.response?.data?.detail ?? 'Unknown error'
```

---

## 📊 Estimated Effort

| Phase | Files | Estimated Hours | Risk Level |
|-------|-------|----------------|------------|
| Pre-Migration Setup | 2 config files | 2h | Low |
| ESLint Error Fixes | 5 issues | 1h | Low |
| Phase 1: Foundation | 4 files | 8h | Medium |
| Phase 2: Services | 4 files | 12h | High |
| Phase 3: Auth | 6 files | 10h | Medium |
| Phase 4: Public | 5 files | 15h | Medium |
| Phase 5: Dashboards | 13 files | 20h | Medium |
| Phase 6: Root & QA | 2 files + testing | 8h | Low |
| **TOTAL** | **36 files** | **76 hours** | **~10 days** |

---

## 🎓 Learning Resources

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Axios TypeScript Guide](https://axios-http.com/docs/typescript)

---

## ✅ Success Criteria

1. ✅ All 26 JS files converted to TS
2. ✅ Zero ESLint errors
3. ✅ `npm run build` succeeds with no warnings
4. ✅ All critical user flows tested and working
5. ✅ Type coverage > 95% (minimize `any` types)
6. ✅ Documentation updated (README, CHANGELOG)

---

## 📌 Next Immediate Actions

1. **Create `tsconfig.json` and `tsconfig.node.json`** (5 minutes)
2. **Fix 5 ESLint issues** (30 minutes)
3. **Start with `validators.js` → `validators.ts`** (1 hour)
4. **Define all API response types in `types.ts`** (2 hours)
5. **Convert `authService.js` → `authService.ts`** (2 hours)

---

## 🔐 Backend Integration Notes

**CRITICAL REMINDER:** Do NOT modify backend code. All type definitions must match existing backend API contracts:
- User roles: `'C'` (cliente), `'E'` (empresa), `'M'` (motorista)
- Token format: JWT with `access` and `refresh` keys
- API base path: `/api/v1/`
- All endpoints documented in [Roteiro_Integracao_Frontend.md](Roteiro_Integracao_Frontend.md)

---

**Last Updated:** January 7, 2026  
**Maintainer:** Development Team  
**Status:** ⚠️ Migration Pending - Infrastructure Setup Required
