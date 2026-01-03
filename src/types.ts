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