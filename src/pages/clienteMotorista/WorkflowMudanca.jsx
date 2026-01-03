import { useState } from 'react'
import { iniciarServico, finalizarServico } from '../../services/api'
import { useToast } from '../../contexts/ToastContext'

/**
 * Componente de controle operacional da mudança
 * Usado pelo motorista para registrar início e fim do serviço
 */
function WorkflowMudanca({ mudanca, onStatusChange }) {
  const toast = useToast()
  const [processando, setProcessando] = useState(false)

  const handleIniciarServico = async () => {
    if (!confirm('Confirmar início do serviço? O cliente será notificado.')) {
      return
    }

    setProcessando(true)
    try {
      await iniciarServico(mudanca.id)
      toast.success('Serviço iniciado! Boa mudança!')
      onStatusChange?.('EM_ANDAMENTO')
    } catch (err) {
      console.error('Erro ao iniciar serviço:', err)
      toast.error('Erro ao iniciar serviço. Tente novamente.')
    } finally {
      setProcessando(false)
    }
  }

  const handleFinalizarServico = async () => {
    if (!confirm('Confirmar finalização do serviço? Todos os itens foram entregues?')) {
      return
    }

    setProcessando(true)
    try {
      await finalizarServico(mudanca.id)
      toast.success('Serviço finalizado! O cliente receberá uma solicitação de avaliação.')
      onStatusChange?.('CONCLUIDA')
    } catch (err) {
      console.error('Erro ao finalizar serviço:', err)
      toast.error('Erro ao finalizar serviço. Tente novamente.')
    } finally {
      setProcessando(false)
    }
  }

  const renderStatus = () => {
    const statusMap = {
      'AGUARDANDO_MOTORISTA': {
        label: 'Aguardando Motorista',
        color: 'orange',
        icon: '⏳'
      },
      'EM_ANDAMENTO': {
        label: 'Em Andamento',
        color: 'blue',
        icon: '🚛'
      },
      'CONCLUIDA': {
        label: 'Concluída',
        color: 'green',
        icon: '✅'
      }
    }

    const info = statusMap[mudanca.status] || { label: mudanca.status, color: 'gray', icon: '📋' }

    return (
      <div className={`status-badge ${info.color}`}>
        {info.icon} {info.label}
      </div>
    )
  }

  return (
    <div className="workflow-mudanca-container">
      <div className="workflow-header">
        <h3>Mudança #{mudanca.id}</h3>
        {renderStatus()}
      </div>

      <div className="workflow-info">
        <div className="info-item">
          <span className="label">📍 Origem:</span>
          <span className="value">{mudanca.endereco_origem}, {mudanca.cidade_origem}</span>
        </div>
        <div className="info-item">
          <span className="label">📍 Destino:</span>
          <span className="value">{mudanca.endereco_destino}, {mudanca.cidade_destino}</span>
        </div>
        <div className="info-item">
          <span className="label">📅 Data:</span>
          <span className="value">{new Date(mudanca.data_mudanca).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="info-item">
          <span className="label">📦 Volume:</span>
          <span className="value">{mudanca.volume_m3_estimado} m³</span>
        </div>
        <div className="info-item">
          <span className="label">👤 Cliente:</span>
          <span className="value">{mudanca.cliente_nome}</span>
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
