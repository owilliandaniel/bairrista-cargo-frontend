import { useState } from 'react'
import { iniciarServico, finalizarServico } from '../../services/api'
import { useToast } from '../../contexts/ToastContext'

interface Mudanca {
  id: number
  origem?: string
  destino?: string
  status: string
  cliente?: string
  endereco_origem?: string
  cidade_origem?: string
  endereco_destino?: string
  cidade_destino?: string
  data_mudanca?: string
  volume_m3_estimado?: number
  cliente_nome?: string
  cliente_telefone?: string
  data_alocacao?: string
  data_inicio?: string
  data_conclusao?: string
}

interface WorkflowMudancaProps {
  mudanca: Mudanca
  onStatusChange: (novoStatus: string) => void
}

function WorkflowMudanca({ mudanca, onStatusChange }: WorkflowMudancaProps) {
  const [processando, setProcessando] = useState(false)
  const { showToast } = useToast()

  const handleIniciarServico = async () => {
    if (!window.confirm('Confirma o início do serviço?')) return

    setProcessando(true)
    try {
      await iniciarServico(mudanca.id)
      showToast('Serviço iniciado com sucesso!', 'success')
      onStatusChange('EM_ANDAMENTO')
    } catch (error) {
      console.error('Erro ao iniciar serviço:', error)
      showToast('Erro ao iniciar serviço', 'error')
    } finally {
      setProcessando(false)
    }
  }

  const handleFinalizarServico = async () => {
    if (!window.confirm('Confirma a finalização do serviço? Todos os itens foram entregues?')) return

    setProcessando(true)
    try {
      await finalizarServico(mudanca.id)
      showToast('Serviço finalizado com sucesso!', 'success')
      onStatusChange('CONCLUIDA')
    } catch (error) {
      console.error('Erro ao finalizar serviço:', error)
      showToast('Erro ao finalizar serviço', 'error')
    } finally {
      setProcessando(false)
    }
  }

  const renderStatus = () => {
    const statusMap: Record<string, { label: string; color: string }> = {
      AGUARDANDO_MOTORISTA: { label: 'Aguardando Início', color: '#ffc107' },
      EM_ANDAMENTO: { label: 'Em Andamento', color: '#2196f3' },
      CONCLUIDA: { label: 'Concluída', color: '#4caf50' }
    }

    const info = statusMap[mudanca.status] || { label: mudanca.status, color: '#999' }

    return (
      <span
        className="status-badge"
        style={{
          background: info.color,
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '1rem',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}
      >
        {info.label}
      </span>
    )
  }

  return (
    <div className="workflow-container">
      <div className="workflow-header">
        <h3>Mudança #{mudanca.id}</h3>
        {renderStatus()}
      </div>

      <div className="workflow-info">
        <div className="info-item">
          <span className="label">📍 Origem:</span>
          <span className="value">
            {mudanca.endereco_origem || mudanca.origem}, {mudanca.cidade_origem || ''}
          </span>
        </div>
        <div className="info-item">
          <span className="label">📍 Destino:</span>
          <span className="value">
            {mudanca.endereco_destino || mudanca.destino}, {mudanca.cidade_destino || ''}
          </span>
        </div>
        <div className="info-item">
          <span className="label">📅 Data:</span>
          <span className="value">
            {mudanca.data_mudanca
              ? new Date(mudanca.data_mudanca).toLocaleDateString('pt-BR')
              : 'Não definida'}
          </span>
        </div>
        <div className="info-item">
          <span className="label">📦 Volume:</span>
          <span className="value">{mudanca.volume_m3_estimado || 0} m³</span>
        </div>
        <div className="info-item">
          <span className="label">👤 Cliente:</span>
          <span className="value">{mudanca.cliente_nome || mudanca.cliente}</span>
        </div>
        {mudanca.cliente_telefone && (
          <div className="info-item">
            <span className="label">📱 Contato:</span>
            <span className="value">
              <a href={`tel:${mudanca.cliente_telefone}`}>{mudanca.cliente_telefone}</a>
            </span>
          </div>
        )}
      </div>

      <div className="workflow-actions">
        {mudanca.status === 'AGUARDANDO_MOTORISTA' && (
          <>
            <div className="action-info">
              <p>✋ Chegou no local de origem? Inicie o serviço para começar.</p>
            </div>
            <button
              onClick={handleIniciarServico}
              disabled={processando}
              className="btn-workflow btn-iniciar"
            >
              {processando ? 'Processando...' : '🚀 Iniciar Serviço'}
            </button>
          </>
        )}

        {mudanca.status === 'EM_ANDAMENTO' && (
          <>
            <div className="action-info">
              <p>🚛 Mudança em andamento. Finalize quando todos os itens forem entregues.</p>
            </div>
            <button
              onClick={handleFinalizarServico}
              disabled={processando}
              className="btn-workflow btn-finalizar"
            >
              {processando ? 'Processando...' : '✅ Finalizar Serviço'}
            </button>
          </>
        )}

        {mudanca.status === 'CONCLUIDA' && (
          <div className="workflow-concluido">
            <p>✅ Serviço concluído com sucesso!</p>
            <p>Aguardando avaliação do cliente.</p>
          </div>
        )}
      </div>

      <div className="workflow-timeline">
        <h4>Linha do Tempo</h4>
        <div className="timeline">
          <div className={`timeline-item ${mudanca.data_alocacao ? 'completed' : ''}`}>
            <span className="timeline-icon">👤</span>
            <div className="timeline-content">
              <strong>Motorista Alocado</strong>
              {mudanca.data_alocacao && (
                <span className="timeline-date">
                  {new Date(mudanca.data_alocacao).toLocaleString('pt-BR')}
                </span>
              )}
            </div>
          </div>

          <div className={`timeline-item ${mudanca.data_inicio ? 'completed' : ''}`}>
            <span className="timeline-icon">🚀</span>
            <div className="timeline-content">
              <strong>Serviço Iniciado</strong>
              {mudanca.data_inicio && (
                <span className="timeline-date">
                  {new Date(mudanca.data_inicio).toLocaleString('pt-BR')}
                </span>
              )}
            </div>
          </div>

          <div className={`timeline-item ${mudanca.data_conclusao ? 'completed' : ''}`}>
            <span className="timeline-icon">✅</span>
            <div className="timeline-content">
              <strong>Serviço Concluído</strong>
              {mudanca.data_conclusao && (
                <span className="timeline-date">
                  {new Date(mudanca.data_conclusao).toLocaleString('pt-BR')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkflowMudanca
