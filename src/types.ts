// types.ts
// Definição do Usuário (usado em Contextos, Config e Props)
export interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cnpj?: string;
  nome_fantasia?: string;
  endereco_padrao?: string;
  tipo_usuario?: 'M' | 'C' | 'E'; // Motorista, Cliente, Empresa
  foto?: string;
}

// Definição de Mudança (usado no Marketplace e Ofertas)
export interface Mudanca {
  id: number;
  cidade_origem: string;
  uf_origem?: string;
  cidade_destino: string;
  uf_destino?: string;
  data_mudanca: string;
  volume_m3_estimado?: number;
  volume_total_m3?: number;
  total_itens?: number;
  precisa_empacotamento: boolean;
  distancia_km?: number;
  preco_sugerido_para_minha_empresa?: string | number;
  // Permite propriedades extras da API
  [key: string]: any;
}

// Definição para Financeiro
export interface FinancialRecord {
  id: number;
  desc: string;
  data: string;
  valor: number;
  status: 'recebido' | 'a_receber';
  cliente: string;
}

// Definição para Solicitações Operacionais
export interface OperationalRequest {
  id: number;
  cliente: string;
  tipo: string;
  origem: string;
  destino: string;
  data_desejada: string;
  itens: string[];
  valor_bruto: number;
  taxa_plataforma: number;
  status: string;
}

// Definição para Serviços Ativos (Operacional)
export interface ActiveService {
  id: number;
  cliente: string;
  status: string;
  origem_cidade: string;
  origem_end?: string;
  destino_cidade: string;
  destino_end?: string;
  data: string;
  horario?: string;
  motorista?: string;
  veiculo?: string;
}

// Definição para Veículos
export interface Veiculo {
  id: number;
  modelo: string;
  placa: string;
  tipo: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  // Add other methods
}

export interface ToastContextType {
  showToast: (message: string, type?: string, duration?: number) => number;
  success: (message: string, duration?: number) => number;
  error: (message: string, duration?: number) => number;
  warning: (message: string, duration?: number) => number;
  info: (message: string, duration?: number) => number;
  removeToast: (id: number) => void;
}

export type SectionKey = 'marketplace' | 'visao_geral' | 'gestao' | 'financeiro' | 'frota' | 'equipe' | 'rotas' | 'config' | 'veiculos' | 'ofertas';

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail: string | Record<string, string[]>;
  code?: string;
}

// ============================================
// AUTHENTICATION TYPES
// ============================================

export interface RegistrationData {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmar_senha: string;
  tipo_usuario: 'C' | 'E' | 'M' | 'A';
  cnpj?: string;
  cpf?: string;
  nome_fantasia?: string;
  tipo_atuacao?: string;
  foto_perfil?: File | null;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface ValidationCodeData {
  email: string;
  codigo: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
  user_id: number;
  id_usuario?: number;
  email: string;
  nome: string;
  tipo_usuario: string;
  empresa_id?: number;
  nome_fantasia?: string;
  tipo_atuacao?: string;
}

// ============================================
// MOTORISTA/DRIVER TYPES
// ============================================

export interface Motorista {
  id: number;
  nome: string;
  cpf: string;
  cnh: string;
  categoria_cnh: string;
  validade_cnh?: string;
  telefone: string;
  email: string;
  empresa: number;
  status?: 'ativo' | 'inativo';
  foto?: string;
}

export interface MotoristaFormData {
  nome: string;
  cpf: string;
  cnh: string;
  categoria_cnh: string;
  validade_cnh: string;
  telefone: string;
  email: string;
  foto_cnh?: File | null;
}

// ============================================
// VEICULO/VEHICLE TYPES (Extended)
// ============================================

export interface VeiculoFormData {
  modelo: string;
  placa: string;
  tipo: string;
  capacidade_kg?: number;
  capacidade_m3?: number;
  ano?: number;
}

// ============================================
// PROPOSTA/OFFER TYPES
// ============================================

export interface Proposta {
  id: number;
  mudanca: number;
  empresa: number;
  empresa_nome?: string;
  valor_proposto: number;
  prazo_execucao: number;
  observacoes?: string;
  status: 'pendente' | 'aceita' | 'recusada' | 'cancelada';
  criado_em: string;
  atualizado_em?: string;
}

export interface PropostaFormData {
  mudanca: number;
  valor_proposto: number;
  prazo_execucao: number;
  observacoes?: string;
}

// ============================================
// ORCAMENTO/BUDGET TYPES
// ============================================

export interface Orcamento {
  id: number;
  mudanca: number;
  valor_total: number;
  valor_ajudantes?: number;
  valor_empacotamento?: number;
  valor_seguro?: number;
  valor_transporte?: number;
  observacoes?: string;
  criado_em: string;
}

// ============================================
// SIMULACAO/SIMULATION TYPES
// ============================================

export interface SimulacaoMudanca {
  tipo_imovel: string;
  cidade_origem: string;
  cidade_destino: string;
  data_mudanca: string;
  quantidade_comodos?: number;
  possui_elevador?: boolean;
  precisa_desmontagem?: boolean;
  precisa_empacotamento?: boolean;
}

export interface SimulacaoResponse {
  preco_estimado: number;
  distancia_km: number;
  tempo_estimado_horas: number;
  detalhamento?: {
    valor_base: number;
    valor_distancia: number;
    valor_comodos: number;
    valor_servicos_extras: number;
  };
}

// ============================================
// NOTIFICACAO/NOTIFICATION TYPES
// ============================================

export interface Notificacao {
  id: number;
  tipo: 'info' | 'success' | 'warning' | 'error';
  titulo: string;
  mensagem: string;
  lida: boolean;
  criado_em: string;
  link?: string;
}

// ============================================
// FORM EVENT TYPES
// ============================================

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type TextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: InputChangeEvent) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
}