import api from './api'

export const authService = {
  async register(data) {
    console.log('authService: Iniciando requisição de registro...')
    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key])
        }
      })
      
      const response = await api.post('/usuarios/registrar/', formData, {
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

  async validateCode(email, codigo) {
    const response = await api.post('/usuarios/validar/', { email, codigo })
    return response.data
  },

  async login(email, senha) {
    const response = await api.post('usuarios/login/', { email, senha })
    console.log('Resposta completa do login:', response.data)
    
    if (response.data.access) {
      console.log('Token access:', response.data.access)
      console.log('Token refresh:', response.data.refresh)
      
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      
      const userData = {
        user_id: response.data.user_id,
        email: response.data.email,
        nome: response.data.nome,
        tipo_usuario: response.data.tipo_usuario,
        empresa_id: response.data.empresa_id,
        nome_fantasia: response.data.nome_fantasia,
        tipo_atuacao: response.data.tipo_atuacao,
      }
      
      localStorage.setItem('user_data', JSON.stringify(userData))
      return response.data
    }
    
    throw new Error('Resposta de login inválida')
  },

  async completarPerfil(dados) {
    const response = await api.patch('usuarios/perfil/completar-cadastro/', dados)
    return response.data
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
  },

  getCurrentUser() {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },
}
