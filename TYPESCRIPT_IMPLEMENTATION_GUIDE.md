# 🚀 TypeScript Migration - Step-by-Step Implementation Guide

**Project:** BairristaCargo Frontend  
**Target:** Convert 26 JavaScript files to TypeScript  
**Timeline:** 10 days (76 hours)  
**Current Status:** Day 0 - Pre-Migration Setup

---

## 📋 Implementation Phases

### ✅ Phase 0: Pre-Migration Setup (Day 1 - 3 hours)

#### Step 0.1: Create TypeScript Configuration Files

**Action 1: Create `tsconfig.json`**

Create file at project root with strict TypeScript settings:

```bash
# Create the file
New-Item -Path "tsconfig.json" -ItemType File
```

Paste this content:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "allowJs": true,
    "checkJs": false,

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
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Action 2: Create `tsconfig.node.json`**

```bash
New-Item -Path "tsconfig.node.json" -ItemType File
```

Content:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.js", "eslint.config.js"]
}
```

**Action 3: Verify TypeScript Installation**

```powershell
npx tsc --version
# Should show: Version 5.9.3
```

**Action 4: Update ESLint Config**

Edit `eslint.config.js`:
```javascript
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // ⬅️ Add ts, tsx support
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_' // ⬅️ Allow _unused naming convention
      }],
    },
  },
])
```

**Verification:**
```powershell
npm run build  # Should succeed
npm run lint   # Should show same 5 errors as before
```

---

#### Step 0.2: Fix Current ESLint Errors (30 minutes)

**Error 1: `src/hooks/useRegistration.js:34` - Unused `res` variable**

Line 34:
```javascript
const res = await register(payload);  // ❌ res is unused
```

Fix: Remove the variable since we don't use the response:
```javascript
await register(payload);  // ✅ No assignment needed
```

**Error 2: `src/pages/auth/ValidateCodeForm.jsx:25` - Unused `err` variable**

Find the catch block around line 25:
```javascript
} catch (err) {  // ❌ err defined but never used
  setError('Código inválido')
}
```

Fix options:
```javascript
// Option 1: Use underscore prefix
} catch (_err) {
  setError('Código inválido')
}

// Option 2: Remove if truly not needed
} catch {
  setError('Código inválido')
}
```

**Error 3: `src/pages/clienteUsuario/AreaCliente_Usuario.jsx:26` - Unused `setOrders`**

Line 26:
```javascript
const [orders, setOrders] = useState([])  // ❌ setOrders never used
```

Fix options:
```javascript
// Option 1: If setOrders will be used soon, prefix with underscore
const [orders, _setOrders] = useState([])

// Option 2: If truly not needed, remove useState
// Just use a const array if data is static
const orders = []
```

**Error 4: `src/pages/clienteUsuario/Config.jsx:4` - Unused `user` variable**

Line 4:
```javascript
const { user, logout } = useAuth()  // ❌ user never used
```

Fix:
```javascript
const { logout } = useAuth()  // ✅ Only destructure what you need
```

**Warning 5: `src/pages/clienteUsuario/PropostasRecebidas.jsx:23` - Missing dependency**

Line 23:
```javascript
useEffect(() => {
  carregarPropostas()
}, [])  // ⚠️ Missing 'carregarPropostas' dependency
```

Fix: Wrap `carregarPropostas` with `useCallback` or add to deps:
```javascript
// Option 1: Add to dependencies (if function is stable)
useEffect(() => {
  carregarPropostas()
}, [carregarPropostas])

// Option 2: Move function inside useEffect (better)
useEffect(() => {
  const carregarPropostas = async () => {
    try {
      const data = await getOrcamentos()
      setPropostas(data)
    } catch (error) {
      console.error('Erro ao carregar propostas:', error)
    }
  }
  
  carregarPropostas()
}, [])  // ✅ No external dependencies
```

**Run After Fixes:**
```powershell
npm run lint  # ✅ Should pass with 0 errors
```

---

### 🔧 Phase 1: Core Services (Days 2-3, 20 hours)

#### Step 1.1: Convert `src/utils/validators.js` → `validators.ts` (2 hours)

**Why First?** No dependencies, pure functions, easy win.

**Process:**

1. **Backup:** `Copy-Item src/utils/validators.js src/utils/validators.js.backup`

2. **Rename:** `Rename-Item src/utils/validators.js validators.ts`

3. **Add Types:**

```typescript
// validators.ts

// Define types for validator functions
type ValidatorFunction = (value: string) => boolean

// Export typed validators object
export const validators: Record<string, ValidatorFunction> = {
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  cnpj: (cnpj: string): boolean => {
    cnpj = cnpj.replace(/[^\d]/g, '')
    if (cnpj.length !== 14) return false
    if (/^(\d)\1+$/.test(cnpj)) return false

    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    const digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(0))) return false

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    return resultado === parseInt(digitos.charAt(1))
  },

  cpf: (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]/g, '')
    if (cpf.length !== 11) return false
    if (/^(\d)\1+$/.test(cpf)) return false

    let soma = 0
    let resto: number

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }

    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(9, 10))) return false

    soma = 0
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }

    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    return resto === parseInt(cpf.substring(10, 11))
  },

  telefone: (telefone: string): boolean => {
    telefone = telefone.replace(/[^\d]/g, '')
    return telefone.length >= 10 && telefone.length <= 11
  },

  cep: (cep: string): boolean => {
    cep = cep.replace(/[^\d]/g, '')
    return cep.length === 8
  },
}

// Optional: Export individual validators for tree-shaking
export const validateEmail = validators.email
export const validateCNPJ = validators.cnpj
export const validateCPF = validators.cpf
export const validateTelefone = validators.telefone
export const validateCEP = validators.cep
```

4. **Test:**
```powershell
npm run build  # Should succeed
# Manually test a form that uses validators
```

5. **Commit:**
```powershell
git add src/utils/validators.ts
git commit -m "feat: migrate validators to TypeScript"
```

---

#### Step 1.2: Expand `src/types.ts` with API Types (3 hours)

**Add these interfaces to `types.ts`:**

```typescript
// Add to existing types.ts

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T
  message?: string
  status?: number
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  detail: string | Record<string, string[]>
  code?: string
}

// ============================================
// AUTHENTICATION TYPES
// ============================================

export interface RegistrationData {
  nome: string
  email: string
  telefone: string
  senha: string
  confirmar_senha: string
  tipo_usuario: 'C' | 'E' | 'M' | 'A'
  cnpj?: string
  cpf?: string
  nome_fantasia?: string
  tipo_atuacao?: string
  foto_perfil?: File | null
}

export interface LoginCredentials {
  email: string
  senha: string
}

export interface ValidationCodeData {
  email: string
  codigo: string
}

export interface TokenResponse {
  access: string
  refresh: string
  user_id: number
  id_usuario?: number
  email: string
  nome: string
  tipo_usuario: string
  empresa_id?: number
  nome_fantasia?: string
  tipo_atuacao?: string
}

// ============================================
// MOTORISTA/DRIVER TYPES
// ============================================

export interface Motorista {
  id: number
  nome: string
  cpf: string
  cnh: string
  categoria_cnh: string
  validade_cnh?: string
  telefone: string
  email: string
  empresa: number
  status?: 'ativo' | 'inativo'
  foto?: string
}

export interface MotoristaFormData {
  nome: string
  cpf: string
  cnh: string
  categoria_cnh: string
  validade_cnh: string
  telefone: string
  email: string
  foto_cnh?: File | null
}

// ============================================
// VEICULO/VEHICLE TYPES
// ============================================

export interface VeiculoFormData {
  modelo: string
  placa: string
  tipo: string
  capacidade_kg?: number
  capacidade_m3?: number
  ano?: number
}

// ============================================
// PROPOSTA/OFFER TYPES
// ============================================

export interface Proposta {
  id: number
  mudanca: number
  empresa: number
  empresa_nome?: string
  valor_proposto: number
  prazo_execucao: number
  observacoes?: string
  status: 'pendente' | 'aceita' | 'recusada' | 'cancelada'
  criado_em: string
  atualizado_em?: string
}

export interface PropostaFormData {
  mudanca: number
  valor_proposto: number
  prazo_execucao: number
  observacoes?: string
}

// ============================================
// ORCAMENTO/BUDGET TYPES
// ============================================

export interface Orcamento {
  id: number
  mudanca: number
  valor_total: number
  valor_ajudantes?: number
  valor_empacotamento?: number
  valor_seguro?: number
  valor_transporte?: number
  observacoes?: string
  criado_em: string
}

// ============================================
// SIMULACAO/SIMULATION TYPES
// ============================================

export interface SimulacaoMudanca {
  tipo_imovel: string
  cidade_origem: string
  cidade_destino: string
  data_mudanca: string
  quantidade_comodos?: number
  possui_elevador?: boolean
  precisa_desmontagem?: boolean
  precisa_empacotamento?: boolean
}

export interface SimulacaoResponse {
  preco_estimado: number
  distancia_km: number
  tempo_estimado_horas: number
  detalhamento?: {
    valor_base: number
    valor_distancia: number
    valor_comodos: number
    valor_servicos_extras: number
  }
}

// ============================================
// NOTIFICACAO/NOTIFICATION TYPES
// ============================================

export interface Notificacao {
  id: number
  tipo: 'info' | 'success' | 'warning' | 'error'
  titulo: string
  mensagem: string
  lida: boolean
  criado_em: string
  link?: string
}

// ============================================
// FORM EVENT TYPES
// ============================================

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>
export type TextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export interface FormFieldProps extends BaseComponentProps {
  label: string
  name: string
  value: string | number
  onChange: (e: InputChangeEvent) => void
  required?: boolean
  disabled?: boolean
  error?: string
  placeholder?: string
}
```

**Commit:**
```powershell
git add src/types.ts
git commit -m "feat: expand types.ts with API and form types"
```

---

#### Step 1.3: Convert `src/services/authService.js` → `authService.ts` (4 hours)

**Process:**

1. **Rename:** `Rename-Item src/services/authService.js authService.ts`

2. **Add Types:**

```typescript
// authService.ts
import api from './api'
import { 
  RegistrationData, 
  ValidationCodeData, 
  LoginCredentials, 
  TokenResponse,
  User 
} from '../types'

interface BackendHealthCheck {
  status: 'online' | 'offline'
  message: string
  error?: string
}

export const authService = {
  async checkBackendHealth(): Promise<BackendHealthCheck> {
    try {
      console.log('authService: Verificando saúde do backend...')
      await api.get('/', { timeout: 5000 })
      console.log('authService: Backend está saudável')
      return { status: 'online', message: 'Backend acessível' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('authService: Backend não acessível', errorMessage)
      return { 
        status: 'offline', 
        message: 'Backend não está acessível. Verifique se o servidor está rodando.',
        error: errorMessage
      }
    }
  },

  async register(data: RegistrationData): Promise<{ detail: string }> {
    console.log('authService: Iniciando requisição de registro...')

    const healthCheck = await this.checkBackendHealth()
    if (healthCheck.status === 'offline') {
      throw new Error(`Backend não acessível: ${healthCheck.message}`)
    }

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value instanceof File ? value : String(value))
        }
      })

      const response = await api.post<{ detail: string }>('/usuarios/registrar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('authService: Resposta recebida com sucesso', response.data)
      return response.data
    } catch (error) {
      console.error('authService: Erro na requisição', error)
      throw error
    }
  },

  async validateCode(email: string, codigo: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/usuarios/validar-codigo/', { email, codigo })
    return response.data
  },

  async login(email: string, senha: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/usuarios/login/', { email, senha })

    console.log('Resposta completa do login:', response.data)

    if (response.data.access) {
      console.log('Token access:', response.data.access)
      console.log('Token refresh:', response.data.refresh)

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)

      const userData: Partial<User> = {
        id: response.data.user_id,
        email: response.data.email,
        nome: response.data.nome,
        tipo_usuario: response.data.tipo_usuario as 'M' | 'C' | 'E',
      }

      localStorage.setItem('user_data', JSON.stringify(userData))
      return response.data
    }

    throw new Error('Resposta de login inválida')
  },

  async completarPerfil(dados: Partial<User>): Promise<User> {
    const response = await api.patch<User>('usuarios/perfil/completar-cadastro/', dados)
    return response.data
  },

  logout(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
  },

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token')
    return Boolean(token)
  },
}
```

3. **Test:**
```powershell
npm run build
# Test login/register flows in browser
```

4. **Commit:**
```powershell
git add src/services/authService.ts
git commit -m "feat: migrate authService to TypeScript"
```

---

#### Step 1.4: Convert `src/services/api.js` → `api.ts` (8 hours)

⚠️ **WARNING:** This is the most complex file. Take your time!

**Process:**

1. **Rename:** `Rename-Item src/services/api.js api.ts`

2. **Import Types:**

```typescript
// api.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { 
  Mudanca, 
  Veiculo, 
  Motorista, 
  Proposta, 
  Orcamento,
  Notificacao,
  FinancialRecord,
  User,
  SimulacaoMudanca,
  SimulacaoResponse,
  VeiculoFormData,
  MotoristaFormData,
  ApiError
} from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://untragic-afterwards-caroline.ngrok-free.dev/api/v1/'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 15000,
})

// ============================================
// INTERCEPTOR DE REQUEST - ADICIONA O TOKEN
// ============================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// ============================================
// INTERCEPTOR DE RESPONSE - REFRESH TOKEN
// ============================================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        
        const response = await axios.post<{ access: string }>(
          BASE_URL + 'usuarios/login/refresh/',
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            }
          }
        )

        const { access } = response.data
        localStorage.setItem('access_token', access)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`
          originalRequest.headers['ngrok-skip-browser-warning'] = 'true'
        }
        
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Sessão expirada', refreshError)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ============================================
// TIPOS DE IMOVEL (SIMULADOR)
// ============================================
export const getTiposImovelProxy = async (): Promise<string[]> => {
  try {
    console.log('GET:', BASE_URL + 'mudancas/tipos-imovel-proxy/')
    const response = await api.get<string[]>('mudancas/tipos-imovel-proxy/')
    console.log('Dados recebidos:', response.data)
    return response.data
  } catch (error) {
    console.error('Erro getTiposImovelProxy:', error)
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status)
      console.error('Resposta:', error.response?.data)
    }
    return []
  }
}

export const simularPrecoMudanca = async (dados: SimulacaoMudanca): Promise<SimulacaoResponse> => {
  try {
    const response = await api.post<SimulacaoResponse>('mudancas/simular-preco/', dados)
    return response.data
  } catch (error) {
    console.error('Erro ao simular preço:', error)
    throw error
  }
}

// ============================================
// PERFIL DA EMPRESA
// ============================================
export const getEmpresaProfile = async (): Promise<User> => {
  const response = await api.get<User>('empresas/perfil/')
  return response.data
}

export const updateEmpresaProfile = async (dados: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('empresas/perfil/', dados)
  return response.data
}

// ============================================
// FROTA (VEÍCULOS)
// ============================================
export const getFrota = async (): Promise<Veiculo[]> => {
  const response = await api.get<Veiculo[]>('veiculos/')
  return response.data
}

export const addVeiculo = async (dados: VeiculoFormData): Promise<Veiculo> => {
  const response = await api.post<Veiculo>('veiculos/', dados)
  return response.data
}

export const deleteVeiculo = async (id: number): Promise<void> => {
  await api.delete(`veiculos/${id}/`)
}

// ============================================
// FUNCIONÁRIOS (MOTORISTAS)
// ============================================
export const getFuncionarios = async (): Promise<Motorista[]> => {
  const response = await api.get<Motorista[]>('motoristas/')
  return response.data
}

export const addFuncionario = async (formData: FormData): Promise<Motorista> => {
  const response = await api.post<Motorista>('motoristas/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const uploadCNH = async (motoristaId: number, formData: FormData): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    `motoristas/${motoristaId}/upload-cnh/`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  )
  return response.data
}

// ============================================
// PERFIL DO CLIENTE
// ============================================
export const getClienteProfile = async (): Promise<User> => {
  const response = await api.get<User>('usuarios/perfil/')
  return response.data
}

export const updateClienteProfile = async (dados: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('usuarios/perfil/', dados)
  return response.data
}

// ============================================
// MUDANÇAS (CLIENTE)
// ============================================
export const getMinhasMudancas = async (): Promise<Mudanca[]> => {
  const response = await api.get<Mudanca[]>('mudancas/minhas/')
  return response.data
}

export const createMudanca = async (dados: Partial<Mudanca>): Promise<Mudanca> => {
  const response = await api.post<Mudanca>('mudancas/', dados)
  return response.data
}

export const deleteMudanca = async (id: number): Promise<void> => {
  await api.delete(`mudancas/${id}/`)
}

export const getMudancaDetalhes = async (id: number): Promise<Mudanca> => {
  const response = await api.get<Mudanca>(`mudancas/${id}/`)
  return response.data
}

export const cancelarMudanca = async (id: number, motivo: string): Promise<Mudanca> => {
  const response = await api.post<Mudanca>(`mudancas/${id}/cancelar/`, { motivo })
  return response.data
}

export const avaliarMudanca = async (id: number, dados: { nota: number; comentario?: string }): Promise<Mudanca> => {
  const response = await api.post<Mudanca>(`mudancas/${id}/avaliar/`, dados)
  return response.data
}

// ============================================
// MUDANÇAS (EMPRESA)
// ============================================
export const getMudancasEmpresa = async (): Promise<Mudanca[]> => {
  const response = await api.get<Mudanca[]>('mudancas/empresa/')
  return response.data
}

export const alocarMotorista = async (mudancaId: number, motoristaId: number): Promise<Mudanca> => {
  const response = await api.post<Mudanca>(`mudancas/${mudancaId}/alocar-motorista/`, { motorista_id: motoristaId })
  return response.data
}

// ============================================
// ORÇAMENTOS
// ============================================
export const getOrcamentos = async (): Promise<Orcamento[]> => {
  const response = await api.get<Orcamento[]>('orcamentos/')
  return response.data
}

export const createOrcamento = async (dados: Partial<Orcamento>): Promise<Orcamento> => {
  const response = await api.post<Orcamento>('orcamentos/', dados)
  return response.data
}

// ============================================
// OFERTAS/PROPOSTAS
// ============================================
export const getOfertas = async (): Promise<Proposta[]> => {
  const response = await api.get<Proposta[]>('ofertas/')
  return response.data
}

// ============================================
// NOTIFICAÇÕES
// ============================================
export const getNotificacoes = async (): Promise<Notificacao[]> => {
  const response = await api.get<Notificacao[]>('notificacoes/')
  return response.data
}

export const marcarComoLida = async (id: number): Promise<Notificacao> => {
  const response = await api.patch<Notificacao>(`notificacoes/${id}/`, { lida: true })
  return response.data
}

// ============================================
// CATÁLOGO DE ITENS
// ============================================
export const searchCatalogo = async (searchTerm: string): Promise<any[]> => {
  const response = await api.get<any[]>(`catalogo/buscar/?q=${searchTerm}`)
  return response.data
}

export const getComodos = async (): Promise<any[]> => {
  const response = await api.get<any[]>('catalogo/comodos/')
  return response.data
}

// ============================================
// OCR/AI - DOCUMENTOS
// ============================================
export const extrairDadosDocumento = async (tipo: string, arquivo: File): Promise<any> => {
  const formData = new FormData()
  formData.append('tipo', tipo)
  formData.append('arquivo', arquivo)

  const response = await api.post<any>('ocr/extrair-dados/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export default api
```

3. **Test Thoroughly:**
```powershell
npm run build
# Test ALL major features in browser:
# - Login/Register
# - Marketplace loading
# - Vehicle CRUD
# - Driver CRUD
# - Price simulation
```

4. **Commit:**
```powershell
git add src/services/api.ts
git commit -m "feat: migrate api.js to TypeScript with full type safety"
```

---

#### Step 1.5: Convert `src/hooks/useRegistration.js` → `useRegistration.ts` (3 hours)

```typescript
// useRegistration.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { RegistrationData } from '../types'
import { AxiosError } from 'axios'

interface UseRegistrationReturn {
  loading: boolean
  analyzing: boolean
  error: string
  formData: any  // Will be typed per component usage
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  setFormData: React.Dispatch<React.SetStateAction<any>>
  setAnalyzing: React.Dispatch<React.SetStateAction<boolean>>
}

export const useRegistration = <T extends Record<string, any>>(
  initialFormData: T,
  userType: 'C' | 'E' | 'M',
  validationFunction: (data: T) => string | null
): UseRegistrationReturn => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<T>(initialFormData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validationFunction(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      const payload = { ...formData, tipo_usuario: userType } as RegistrationData
      await register(payload)  // Removed unused 'res' variable
      
      alert('Cadastro realizado com sucesso! Verifique seu email para o código de validação.')
      navigate('/validar-codigo', { state: { email: formData.email } })

    } catch (error) {
      let errorMsg = 'Erro ao realizar o cadastro.'
      
      if (error instanceof AxiosError && error.response?.data) {
        const errorDetail = error.response.data.detail
        
        if (typeof errorDetail === 'object' && errorDetail !== null) {
          const firstErrorKey = Object.keys(errorDetail)[0]
          const firstErrorMsg = errorDetail[firstErrorKey]
          errorMsg = `${firstErrorKey}: ${Array.isArray(firstErrorMsg) ? firstErrorMsg[0] : firstErrorMsg}`
        } else if (typeof errorDetail === 'string') {
          errorMsg = errorDetail
        }
      }
      
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    analyzing,
    error,
    formData,
    handleChange,
    handleFileChange,
    handleSubmit,
    setFormData,
    setAnalyzing,
  }
}
```

**Test & Commit:**
```powershell
npm run build
git add src/hooks/useRegistration.ts
git commit -m "feat: migrate useRegistration hook to TypeScript"
```

---

### 🔐 Phase 2: Authentication Components (Days 4-5, 10 hours)

I'll continue with detailed steps for each auth component...

**Due to message length, I'll provide a summary for remaining phases:**

### Phase 3-6 Summary

Each component follows the same pattern:

1. **Rename** `.jsx` → `.tsx`
2. **Define Props Interface** at top of file
3. **Type all hooks** (`useState<Type>(initial)`)
4. **Type event handlers** (`e: React.ChangeEvent<HTMLInputElement>`)
5. **Import types** from `types.ts`
6. **Test** with `npm run build` and browser testing
7. **Commit** with descriptive message

---

## 🎯 Daily Checklist

**Each Day:**
- [ ] Morning: Review previous day's changes
- [ ] Convert 2-3 files following the pattern
- [ ] Run `npm run lint` after each file
- [ ] Run `npm run build` after each file
- [ ] Test critical flows in browser
- [ ] Commit each file individually
- [ ] Evening: Update progress tracker

---

## 🏁 Final Verification (Day 10)

```powershell
# 1. Clean build
Remove-Item -Recurse -Force dist
npm run build

# 2. Lint check
npm run lint

# 3. Type check
npx tsc --noEmit

# 4. Run all tests
npm run test

# 5. Manual testing checklist
# - Login as empresa
# - Login as usuario
# - Register new accounts
# - Upload documents (OCR)
# - Create vehicles
# - Create drivers
# - Simulate price
# - Browse marketplace
# - Create mudança
# - Submit proposal
```

---

## ⚠️ Rollback Plan

If TypeScript migration causes critical bugs:

```powershell
# Restore from backup branch
git checkout main
git branch -D typescript-migration
git checkout -b typescript-rollback

# Keep tsconfig.json for future attempts
# Revert individual files as needed
```

---

## 📚 Resources for Each Phase

- **Validators:** [DefinitelyTyped Validator Types](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/validator)
- **Axios:** [Axios TypeScript Docs](https://axios-http.com/docs/typescript)
- **React Events:** [React TypeScript Cheatsheet - Events](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/)
- **Hooks:** [React TypeScript Cheatsheet - Hooks](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/)

---

**Last Updated:** January 7, 2026  
**Next Step:** Create `tsconfig.json` and fix ESLint errors
