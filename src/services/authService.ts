// authService.ts - Authentication service with TypeScript
import api from './api';
import { 
  RegistrationData, 
  ValidationCodeData, 
  TokenResponse,
  User 
} from '../types';

interface BackendHealthCheck {
  status: 'online' | 'offline';
  message: string;
  error?: string;
}

export const authService = {
  // Verifica se o backend está acessível
  async checkBackendHealth(): Promise<BackendHealthCheck> {
    try {
      console.log('authService: Verificando saúde do backend...');
      await api.get('/', { timeout: 5000 });
      console.log('authService: Backend está saudável');
      return { status: 'online', message: 'Backend acessível' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('authService: Backend não acessível', errorMessage);
      return { 
        status: 'offline', 
        message: 'Backend não está acessível. Verifique se o servidor está rodando.',
        error: errorMessage
      };
    }
  },

  async register(data: RegistrationData): Promise<{ detail: string }> {
    console.log('authService: Iniciando requisição de registro...');

    // Verifica conectividade antes de tentar registrar
    const healthCheck = await this.checkBackendHealth();
    if (healthCheck.status === 'offline') {
      throw new Error(`Backend não acessível: ${healthCheck.message}`);
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value instanceof File ? value : String(value));
        }
      });

      const response = await api.post<{ detail: string }>('/usuarios/registrar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('authService: Resposta recebida com sucesso', response.data);
      return response.data;
    } catch (error) {
      console.error('authService: Erro na requisição', error);
      throw error;
    }
  },

  async validateCode(email: string, codigo: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/usuarios/validar-codigo/', { email, codigo });
    return response.data;
  },

  async login(email: string, senha: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/usuarios/login/', { email, senha });

    console.log('Resposta completa do login:', response.data);

    if (response.data.access) {
      console.log('Token access:', response.data.access);
      console.log('Token refresh:', response.data.refresh);

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      const userData: Partial<User> = {
        id: response.data.user_id,
        email: response.data.email,
        nome: response.data.nome,
        tipo_usuario: response.data.tipo_usuario as 'M' | 'C' | 'E',
      };

      localStorage.setItem('user_data', JSON.stringify(userData));
      return response.data;
    }

    throw new Error('Resposta de login inválida');
  },

  async completarPerfil(dados: Partial<User>): Promise<User> {
    const response = await api.patch<User>('usuarios/perfil/completar-cadastro/', dados);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
