import { useState, useEffect } from 'react'
import api from '../services/api'
import { Icons } from '../components/EmpresaIcons'
import '../components/AreaCliente.css'

interface Veiculo {
  id: number
  placa: string
  modelo: string
  capacidade?: number
}

interface FormData {
  nome: string
  email: string
  senha: string
  cnh: string
  categoria_cnh: 'B' | 'C' | 'D' | 'E'
  validade_cnh: string
  placa_veiculo: string
  modelo_veiculo: string
  capacidade_carga_kg: string
}

interface CadastrarMotoristaProps {
  onSuccess?: () => void
}

function CadastrarMotorista({ onSuccess }: CadastrarMotoristaProps) {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loading, setLoading] = useState(false)
  const [veiculoSelecionadoId, setVeiculoSelecionadoId] = useState('')

  const [formData, setFormData] = useState<FormData>({
    // Dados do Usuário (Login)
    nome: '',
    email: '',
    senha: '',
    // Dados do Motorista
    cnh: '',
    categoria_cnh: 'C',
    validade_cnh: '',
    // Dados do Veículo (Texto plano conforme models.py)
    placa_veiculo: '',
    modelo_veiculo: '',
    capacidade_carga_kg: ''
  })

  // 1. Carrega a frota para facilitar o preenchimento
  useEffect(() => {
    async function loadVeiculos() {
      try {
        const response = await api.get('empresas/frota/')
        setVeiculos(response.data)
      } catch (error) {
        console.error('Erro ao carregar frota', error)
      }
    }
    loadVeiculos()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 2. A Mágica: Quando seleciona no dropdown, preenche os campos de texto automaticamente
  const handleVeiculoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setVeiculoSelecionadoId(id)

    if (id) {
      const veiculoEncontrado = veiculos.find(v => v.id === parseInt(id))
      if (veiculoEncontrado) {
        setFormData(prev => ({
          ...prev,
          placa_veiculo: veiculoEncontrado.placa,
          modelo_veiculo: veiculoEncontrado.modelo,
          capacidade_carga_kg: String(veiculoEncontrado.capacidade || 0)
        }))
      }
    } else {
      // Se limpar a seleção, limpa os campos
      setFormData(prev => ({ ...prev, placa_veiculo: '', modelo_veiculo: '', capacidade_carga_kg: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Envia exatamente o que o models.py espera (Strings)
      await api.post('motoristas/funcionarios/', formData)

      alert('Motorista cadastrado com sucesso!')

      // Limpa formulário
      setFormData({
        nome: '',
        email: '',
        senha: '',
        cnh: '',
        categoria_cnh: 'C',
        validade_cnh: '',
        placa_veiculo: '',
        modelo_veiculo: '',
        capacidade_carga_kg: ''
      })
      setVeiculoSelecionadoId('')

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error(error)
      alert('Erro ao cadastrar. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        Cadastre um novo motorista e vincule um veículo da sua frota existente.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        {/* LOGIN */}
        <div className="detail-section">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            <Icons.Users /> Dados de Acesso
          </h3>
          <div className="detail-grid">
            <div className="form-group">
              <label>Nome Completo</label>
              <input name="nome" value={formData.nome} onChange={handleChange} required className="modal-input" />
            </div>
            <div className="form-group">
              <label>Email (Login)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="modal-input"
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                className="modal-input"
              />
            </div>
          </div>
        </div>

        {/* DADOS DO MOTORISTA */}
        <div className="detail-section">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            <Icons.Truck /> Motorista e Veículo
          </h3>
          <div className="detail-grid">
            <div className="form-group">
              <label>CNH</label>
              <input name="cnh" value={formData.cnh} onChange={handleChange} required className="modal-input" />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select name="categoria_cnh" value={formData.categoria_cnh} onChange={handleChange} className="modal-input">
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>

            {/* SELEÇÃO INTELIGENTE DE VEÍCULO */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Selecionar Veículo da Frota</label>
              <select
                value={veiculoSelecionadoId}
                onChange={handleVeiculoSelect}
                className="modal-input"
                style={{ borderColor: 'var(--primary-color)' }}
              >
                <option value="">-- Escolha um veículo --</option>
                {veiculos.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.modelo} - {v.placa}
                  </option>
                ))}
              </select>
            </div>

            {/* CAMPOS DE TEXTO (PREENCHIDOS AUTOMATICAMENTE MAS VISÍVEIS) */}
            <div className="form-group">
              <label>Placa (Vinculada)</label>
              <input
                name="placa_veiculo"
                value={formData.placa_veiculo}
                onChange={handleChange}
                readOnly // Deixamos readOnly para garantir integridade, ou remova para permitir edição manual
                className="modal-input"
                style={{ background: '#f9f9f9' }}
              />
            </div>
            <div className="form-group">
              <label>Modelo</label>
              <input
                name="modelo_veiculo"
                value={formData.modelo_veiculo}
                readOnly
                className="modal-input"
                style={{ background: '#f9f9f9' }}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary-full" disabled={loading} style={{ maxWidth: '300px' }}>
          {loading ? 'Salvando...' : 'Cadastrar Motorista'}
        </button>
      </form>
    </div>
  )
}

export default CadastrarMotorista
