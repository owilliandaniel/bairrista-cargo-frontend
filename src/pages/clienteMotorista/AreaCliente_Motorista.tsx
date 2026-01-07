import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getMudancasMotorista, getTripHistory } from '../../services/api'
import { Icons } from '../../components/EmpresaIcons'
import WorkflowMudanca from './WorkflowMudanca'
import NotificationCenter from '../../components/NotificationCenter'
import '../../components/AreaCliente.css'

interface MenuItemConfig {
  key: SectionKey
  label: string
  icon: JSX.Element
}

type SectionKey = 'painel' | 'workflow' | 'viagens' | 'financeiro' | 'veiculo'

interface Mudanca {
  id: number
  origem: string
  destino: string
  status: string
  cliente: string
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

interface Viagem {
  id: number
  data: string
  origem: string
  destino: string
  status: string
  valor: number
}

const MENU_ITEMS: MenuItemConfig[] = [
  { key: 'painel', label: 'Painel', icon: <Icons.Dashboard /> },
  { key: 'workflow', label: 'Workflow Atual', icon: <Icons.Operations /> },
  { key: 'viagens', label: 'Histórico', icon: <Icons.Truck /> },
  { key: 'financeiro', label: 'Financeiro', icon: <Icons.Wallet /> },
  { key: 'veiculo', label: 'Meu Veículo', icon: <Icons.Settings /> }
]

function AreaCliente_Motorista() {
  const { user, logout } = useAuth()
  const [section, setSection] = useState<SectionKey>('painel')
  const [mudancas, setMudancas] = useState<Mudanca[]>([])
  const [viagens, setViagens] = useState<Viagem[]>([])
  const [currentTrip, setCurrentTrip] = useState<Mudanca | null>(null)

  useEffect(() => {
    fetchMudancas()
    fetchViagens()
  }, [])

  const fetchMudancas = async () => {
    try {
      const data = await getMudancasMotorista()
      setMudancas(data)
      const atual = data.find((m: Mudanca) => m.status === 'AGUARDANDO_MOTORISTA' || m.status === 'EM_ANDAMENTO')
      setCurrentTrip(atual || null)
    } catch (error) {
      console.error('Erro ao carregar mudanças:', error)
    }
  }

  const fetchViagens = async () => {
    try {
      const data = await getTripHistory()
      setViagens(data)
    } catch (error) {
      console.error('Erro ao carregar viagens:', error)
    }
  }

  const RenderDashboard = () => (
    <div className="content-box fade-in">
      <div className="box-header-simple">
        <h3>Painel do Motorista</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{mudancas.length}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.95, marginTop: '0.5rem' }}>Mudanças Ativas</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{viagens.length}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.95, marginTop: '0.5rem' }}>Viagens Realizadas</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>4.8⭐</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.95, marginTop: '0.5rem' }}>Avaliação Média</div>
        </div>
      </div>
      {currentTrip && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff3cd', borderRadius: '0.75rem', border: '2px solid #ffecb5' }}>
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>🚛 Mudança Atual</h4>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            <strong>{currentTrip.origem}</strong> → <strong>{currentTrip.destino}</strong>
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#856404' }}>
            Cliente: {currentTrip.cliente} | Status: {currentTrip.status}
          </p>
        </div>
      )}
    </div>
  )

  const RenderTrips = () => (
    <div className="content-box fade-in">
      <div className="box-header-simple">
        <h3>Histórico de Viagens</h3>
      </div>
      <div className="table-responsive" style={{ marginTop: '1.5rem' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Origem → Destino</th>
              <th>Status</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {viagens.length > 0 ? (
              viagens.map(v => (
                <tr key={v.id}>
                  <td>#{v.id}</td>
                  <td>{new Date(v.data).toLocaleDateString('pt-BR')}</td>
                  <td>{v.origem} → {v.destino}</td>
                  <td>
                    <span className={`status-badge ${v.status === 'concluida' ? 'green' : 'gray'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>R$ {v.valor.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  Nenhuma viagem realizada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  const RenderFinance = () => (
    <div className="content-box fade-in">
      <div className="box-header-simple">
        <h3>Financeiro</h3>
      </div>
      <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
        <div className="transaction-row">
          <div className="t-desc">
            <strong>Pagamento Semanal</strong>
            <small>15/11/2023</small>
          </div>
          <div className="t-amount text-green">+ R$ 1.200,00</div>
        </div>
        <div className="transaction-row">
          <div className="t-desc">
            <strong>Adiantamento Combustível</strong>
            <small>10/11/2023</small>
          </div>
          <div className="t-amount text-green">+ R$ 300,00</div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (section) {
      case 'painel':
        return <RenderDashboard />
      case 'workflow':
        return (
          <div className="content-box fade-in">
            <WorkflowMudanca
              mudanca={
                currentTrip || {
                  id: 101,
                  origem: 'São Paulo, SP',
                  destino: 'Campinas, SP',
                  status: 'Em Andamento',
                  cliente: 'João Cliente'
                }
              }
              onStatusChange={(novoStatus: string) => {
                console.log('Status alterado para:', novoStatus)
                fetchMudancas()
              }}
            />
          </div>
        )
      case 'viagens':
        return <RenderTrips />
      case 'financeiro':
        return <RenderFinance />
      case 'veiculo':
        return (
          <div className="content-box fade-in">
            <div className="box-header-simple">
              <h3>Meu Veículo Vinculado</h3>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ background: '#eee', padding: '1rem', borderRadius: '50%' }}>
                <Icons.Truck />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Caminhão Baú - Mercedes</h2>
                <p style={{ margin: 0, color: '#666' }}>
                  Placa: <strong>IVX-9090</strong>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p>
                Status: <span className="status-badge blue">Ativo na Frota</span>
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand-area">
          <span className="brand-logo">BairristaCargo</span>
        </div>

        <div className="user-profile-compact">
          <div className="avatar">{user?.nome?.charAt(0) || 'M'}</div>
          <div className="info">
            <strong>{user?.nome}</strong>
            <span>Motorista</span>
          </div>
        </div>

        <nav className="nav-menu">
          {MENU_ITEMS.map(item => (
            <button
              key={item.key}
              className={`nav-btn ${section === item.key ? 'active' : ''}`}
              onClick={() => setSection(item.key)}
            >
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="breadcrumbs">
            <span>Motorista</span> / <span>{MENU_ITEMS.find(i => i.key === section)?.label}</span>
          </div>
          <div className="topbar-controls">
            <NotificationCenter />
            <Link to="/" className="control-link">
              <Icons.Truck /> Site
            </Link>
            <button onClick={logout} className="control-btn-logout">
              <Icons.Logout /> Sair
            </button>
          </div>
        </header>
        <div className="admin-content-wrapper">{renderContent()}</div>
      </main>
    </div>
  )
}

export default AreaCliente_Motorista
