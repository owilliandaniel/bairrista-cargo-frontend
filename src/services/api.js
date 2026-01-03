import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://untragic-afterwards-caroline.ngrok-free.dev/api/v1/'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', 
  },
  timeout: 10000,
})

// ============================================
// INTERCEPTOR DE REQUEST - ADICIONA O TOKEN
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ============================================
// INTERCEPTOR DE RESPONSE - REFRESH TOKEN
// ============================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        
        const response = await axios.post(
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

        originalRequest.headers.Authorization = `Bearer ${access}`
        originalRequest.headers['ngrok-skip-browser-warning'] = 'true'
        
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

// Funções do Simulador de Mudanças (Endpoint Público)
export const getTiposImovelProxy = async () => {
  try {
    console.log('GET:', BASE_URL + 'mudancas/tipos-imovel-proxy/')
    const response = await api.get('mudancas/tipos-imovel-proxy/')
    console.log('Dados recebidos:', response.data)
    
    return response.data
    
  } catch (error) {
    console.error('Erro getTiposImovelProxy:', error)
    console.error('Status:', error.response?.status)
    console.error('Resposta:', error.response?.data)
    
    return []
  }
}


export const simularPrecoMudanca = async (dados) => {
  try {
    const response = await api.post('mudancas/simular-preco/', dados)
    return response.data
  } catch (error) {
    console.error('Erro ao simular preço:', error)
    throw error
  }
}

// === EMPRESAS ===
export const getEmpresaProfile = async (id) => {
  const response = await api.get(`empresas/profile/${id}/`)
  return response.data
}

export const updateEmpresaProfile = async (id, dados) => {
  const response = await api.patch(`empresas/profile/${id}/`, dados)
  return response.data
}

export const getFrota = async () => {
  const response = await api.get('empresas/frota/')
  return response.data
}

export const addVeiculo = async (dados) => {
  const response = await api.post('empresas/frota/', dados)
  return response.data
}

export const deleteVeiculo = async (id) => {
  const response = await api.delete(`empresas/frota/${id}/`)
  return response.data
}

// === MOTORISTAS/FUNCIONÁRIOS ===
export const getFuncionarios = async () => {
  const response = await api.get('motoristas/funcionarios/')
  return response.data
}

export const addFuncionario = async (formData) => {
  const response = await api.post('motoristas/funcionarios/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const uploadCNH = async (motoristaId, formData) => {
  const response = await api.post(`motoristas/funcionarios/${motoristaId}/upload-cnh/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

// === CLIENTES ===
export const getClienteProfile = async () => {
  const response = await api.get('clientes/')
  return response.data
}

export const updateClienteProfile = async (id, dados) => {
  const response = await api.patch(`clientes/${id}/`, dados)
  return response.data
}

// === MUDANÇAS (Cliente) ===
export const getMinhasMudancas = async () => {
  const response = await api.get('mudancas/minhas-mudancas/')
  return response.data
}

export const createMudanca = async (dados) => {
  const response = await api.post('mudancas/minhas-mudancas/', dados)
  return response.data
}

export const deleteMudanca = async (id) => {
  const response = await api.delete(`mudancas/minhas-mudancas/${id}/`)
  return response.data
}

export const getMudancaDetalhes = async (id) => {
  const response = await api.get(`mudancas/minhas-mudancas/${id}/`)
  return response.data
}

export const cancelarMudanca = async (id, motivo) => {
  const response = await api.post(`mudancas/minhas-mudancas/${id}/cancelar/`, { motivo })
  return response.data
}

export const avaliarMudanca = async (id, dados) => {
  const response = await api.post(`mudancas/minhas-mudancas/${id}/avaliar/`, dados)
  return response.data
}

// === MUDANÇAS (Empresa) ===
export const getMudancasEmpresa = async () => {
  const response = await api.get('mudancas/mudancas-empresa/')
  return response.data
}

export const alocarMotorista = async (mudancaId, motoristaId) => {
  const response = await api.patch(`mudancas/mudancas-empresa/${mudancaId}/alocar-motorista/`, { motorista_id: motoristaId })
  return response.data
}

// === ORÇAMENTOS ===
export const getOrcamentos = async () => {
  const response = await api.get('mudancas/orcamentos/')
  return response.data
}

export const createOrcamento = async (dados) => {
  const response = await api.post('mudancas/orcamentos/', dados)
  return response.data
}

// === OFERTAS/MARKETPLACE ===
export const getOfertas = async () => {
  const response = await api.get('mudancas/ofertas/')  // <-- CORRIGIDO
  return response.data
}

// === NOTIFICAÇÕES ===
export const getNotificacoes = async () => {
  const response = await api.get('usuarios/notificacoes/')
  return response.data
}

export const marcarComoLida = async (id) => {
  const response = await api.post(`usuarios/notificacoes/${id}/marcar-como-lida/`)
  return response.data
}

// === CATÁLOGO DE ITENS ===
export const searchCatalogo = async (searchTerm) => {
  const response = await api.get(`mudancas/catalogo/?search=${searchTerm}`)
  return response.data
}

export const getComodos = async () => {
  const response = await api.get('mudancas/comodos/')
  return response.data
}

// === IA - OCR DE DOCUMENTOS ===
export const extrairDadosDocumento = async (tipo, arquivo) => {
  const formData = new FormData()
  formData.append('tipo', tipo)
  formData.append('imagem', arquivo)
  
  const response = await api.post('ia/extrair-dados/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

// === IA - ANÁLISE DE IMAGENS PARA INVENTÁRIO ===
export const analisarImagemInventario = async (arquivo) => {
  const formData = new FormData()
  formData.append('imagem', arquivo)
  
  const response = await api.post('mudancas/analisar-imagem/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

// MARKETPLACE
export const getMudancasDisponiveis = async () => {
  const response = await api.get('mudancas/ofertas/')
  return response.data
}

// === ORÇAMENTOS - CRUD COMPLETO ===
export const enviarProposta = async (dados) => {
  const response = await api.post('mudancas/orcamentos/', dados)
  return response.data
}

export const getPropostasRecebidas = async () => {
  const response = await api.get('orcamentos/')
  return response.data
}

export const aceitarOrcamento = async (orcamentoId) => {
  const response = await api.post(`orcamentos/${orcamentoId}/aceitar/`)
  return response.data
}

export const rejeitarOrcamento = async (orcamentoId, motivo) => {
  const response = await api.post(`orcamentos/${orcamentoId}/rejeitar/`, { motivo })
  return response.data
}

// === PAGAMENTOS - CHECKOUT E ESCROW ===
export const processarPagamento = async (dados) => {
  const response = await api.post('pagamentos/processar/', dados)
  return response.data
}

export const getHistoricoPagamentos = async () => {
  const response = await api.get('pagamentos/historico/')
  return response.data
}

// === WORKFLOW OPERACIONAL - MUDANÇAS ===
export const alocarMotoristaWorkflow = async (mudancaId, motoristaId) => {
  const response = await api.patch(`mudancas/${mudancaId}/alocar-motorista/`, { 
    motorista_id: motoristaId 
  })
  return response.data
}

export const iniciarServico = async (mudancaId) => {
  const response = await api.post(`mudancas/${mudancaId}/iniciar-servico/`)
  return response.data
}

export const finalizarServico = async (mudancaId) => {
  const response = await api.post(`mudancas/${mudancaId}/finalizar-servico/`)
  return response.data
}

// === PÓS-VENDA - AVALIAÇÃO E SINISTROS ===
export const avaliarMudancaCompleta = async (mudancaId, dados) => {
  const response = await api.post(`mudancas/${mudancaId}/avaliar/`, dados)
  return response.data
}

export const abrirSinistro = async (mudancaId, dados) => {
  const formData = new FormData()
  formData.append('item_afetado', dados.item_afetado)
  formData.append('descricao_cliente', dados.descricao_cliente)
  if (dados.foto_dano) {
    formData.append('foto_dano', dados.foto_dano)
  }
  
  const response = await api.post(`mudancas/${mudancaId}/abrir-sinistro/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const getSinistros = async () => {
  const response = await api.get('mudancas/sinistros/')
  return response.data
}

export const getSinistroDetalhes = async (sinistroId) => {
  const response = await api.get(`mudancas/sinistros/${sinistroId}/`)
  return response.data
}

// === PERFIL - COMPLETAR CADASTRO ===
export const completarCadastro = async (dados) => {
  const response = await api.patch('usuarios/perfil/completar-cadastro/', dados)
  return response.data
}

// === EMPRESAS - CADASTRAR MOTORISTA ===
export const cadastrarMotorista = async (dados) => {
  const response = await api.post('empresas/cadastrar-motorista/', dados)
  return response.data
}

export default api
