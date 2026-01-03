import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Icons as SharedIcons } from "../../components/EmpresaIcons";
import WorkflowMudanca from './WorkflowMudanca'
import '../../components/AreaCliente.css'

// Ícones específicos do Motorista (que não estão no compartilhado)
const DriverIcons = {
  Navigation: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
}

// Mesclando os ícones
const Icons = { ...SharedIcons, ...DriverIcons };

// DADOS MOCKADOS (VIAGENS)
const MOCK_TRIPS = [
  { id: 101, origem: 'São Paulo, SP', destino: 'Campinas, SP', status: 'Em Andamento', valor: 'R$ 850,00', data: 'Hoje', cliente: 'Logística Express' },
  { id: 102, origem: 'Campinas, SP', destino: 'Sorocaba, SP', status: 'Agendado', valor: 'R$ 600,00', data: 'Amanhã', cliente: 'João Mudanças' },
];

const MENU_ITEMS = [
  { key: 'painel', label: 'Painel de Corridas', icon: <Icons.Dashboard /> },
  { key: 'workflow', label: 'Controle de Serviço', icon: <Icons.CheckCircle /> },
  { key: 'viagens', label: 'Minhas Viagens', icon: <Icons.Map /> },
  { key: 'financeiro', label: 'Meus Ganhos', icon: <Icons.Wallet /> },
  { key: 'veiculo', label: 'Meu Veículo', icon: <Icons.Truck /> },
];

function AreaCliente_Motorista() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState('painel');

  useEffect(() => { if (!user) navigate('/'); }, [user, navigate]);

  // --- PAINEL PRINCIPAL (DASHBOARD) ---
  const RenderDashboard = () => (
    <div className="fade-in">
      <div className="overview-header">
         <h1>Olá, {user?.nome?.split(' ')[0] || 'Motorista'}</h1>
         <p>Você está <strong>Online</strong> e vinculado à empresa {user?.empresa_vinculada || 'Bairrista'}.</p>
      </div>

      {/* Card de Viagem Atual em Destaque */}
      <div className="content-box" style={{ borderColor: 'var(--accent-green)', borderWidth: '2px' }}>
         <div className="flex-between mb-2">
            <h3 style={{ color: 'var(--accent-green)', margin: 0 }}>Viagem Atual</h3>
            <span className="status-badge blue">Em Andamento</span>
         </div>
         
         <div className="route-visual">
            <div className="route-point">
               <div className="point-dot start"></div>
               <div className="point-info">
                   <small>COLETA</small>
                   <strong>São Paulo, SP</strong>
               </div>
            </div>
            <div className="route-line-vertical" style={{ height: '30px' }}></div>
            <div className="route-point">
               <div className="point-dot end"></div>
               <div className="point-info">
                   <small>ENTREGA</small>
                   <strong>Campinas, SP</strong>
               </div>
            </div>
         </div>

         <div className="mt-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary-full" style={{ flex: 1 }}>
                <Icons.Navigation /> Abrir GPS (Waze)
            </button>
            <button className="btn-secondary-sm" style={{ flex: 1, justifyContent: 'center' }}>
                <Icons.CheckCircle /> Confirmar Entrega
            </button>
         </div>
      </div>

      {/* Lista de Oportunidades Rápidas */}
      <h3 className="mt-4 mb-2" style={{ color: '#444' }}>Próximas Demandas da Empresa</h3>
      <div className="finance-list">
         <div className="transaction-row">
            <div className="t-status-icon"><div className="icon-circle green"><Icons.Box /></div></div>
            <div className="t-desc">
               <strong>Frete Rápido - Eletrônicos</strong>
               <small>5km de distância • 200kg</small>
            </div>
            <div className="t-amount" style={{ color: 'var(--primary-color)' }}>R$ 450,00</div>
            <button className="btn-secondary-sm" style={{ marginLeft: '10px' }}>Aceitar</button>
         </div>
      </div>
    </div>
  );

  // --- HISTÓRICO DE VIAGENS ---
  const RenderTrips = () => (
    <div className="fade-in">
       <div className="box-header-simple"><h3>Histórico e Agendamentos</h3></div>
       <div className="services-list mt-4">
          {MOCK_TRIPS.map(trip => (
             <div key={trip.id} className="service-card-row">
                <div className="service-info-main">
                   <div className={`service-type-badge ${trip.status === 'Em Andamento' ? 'blue' : 'yellow'}`}>{trip.status}</div>
                   <h3>{trip.origem} ➝ {trip.destino}</h3>
                   <small>{trip.cliente}</small>
                </div>
                <div className="service-meta">
                   <div className="meta-item"><Icons.Clock /> <span>{trip.data}</span></div>
                   <div className="meta-item price" style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{trip.valor}</div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  // --- FINANCEIRO (GANHOS) ---
  const RenderFinance = () => (
     <div className="fade-in">
        <div className="finance-kpi-grid">
           <div className="finance-card highlight">
              <span className="f-label">Total Ganhos (Mês)</span>
              <h2 className="f-value">R$ 3.450,00</h2>
              <span className="f-sub positive">▲ Meta atingida</span>
           </div>
           <div className="finance-card">
              <span className="f-label">A Receber da Empresa</span>
              <h2 className="f-value text-gray">R$ 850,00</h2>
              <span className="f-sub">Fechamento dia 05</span>
           </div>
        </div>
        <div className="content-box mt-4">
           <h3 style={{ fontSize: '1rem', color: '#666' }}>Últimos Repasses</h3>
           <div className="finance-list">
               <div className="transaction-row">
                   <div className="t-desc"><strong>Pagamento Semanal</strong><small>15/11/2023</small></div>
                   <div className="t-amount text-green">+ R$ 1.200,00</div>
               </div>
               <div className="transaction-row">
                   <div className="t-desc"><strong>Adiantamento Combustível</strong><small>10/11/2023</small></div>
                   <div className="t-amount text-green">+ R$ 300,00</div>
               </div>
           </div>
        </div>
     </div>
  );

  const renderContent = () => {
    switch (section) {
      case 'painel': return <RenderDashboard />;
      case 'workflow': return (
        <div className="content-box fade-in">
          <WorkflowMudanca
            mudanca={{ id: 101, origem: 'São Paulo, SP', destino: 'Campinas, SP', status: 'Em Andamento', cliente: 'João Cliente' }}
            onStatusChange={(novoStatus) => {
              console.log('Status alterado para:', novoStatus)
              // Aqui seria chamada a API para atualizar o status
            }}
          />
        </div>
      );
      case 'viagens': return <RenderTrips />;
      case 'financeiro': return <RenderFinance />;
      case 'veiculo': return (
        <div className="content-box fade-in">
            <div className="box-header-simple"><h3>Meu Veículo Vinculado</h3></div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: '#eee', padding: '1rem', borderRadius: '50%' }}><Icons.Truck /></div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Caminhão Baú - Mercedes</h2>
                    <p style={{ margin: 0, color: '#666' }}>Placa: <strong>IVX-9090</strong></p>
                </div>
            </div>
            <div className="mt-4">
                <p>Status: <span className="status-badge blue">Ativo na Frota</span></p>
            </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand-area"><span className="brand-logo">BairristaCargo</span></div>
        
        <div className="user-profile-compact">
            <div className="avatar">{user?.nome?.charAt(0) || 'M'}</div>
            <div className="info">
                <strong>{user?.nome}</strong>
                <span>Motorista</span>
            </div>
        </div>

        <nav className="nav-menu">
          {MENU_ITEMS.map(item => (
            <button key={item.key} className={`nav-btn ${section === item.key ? 'active' : ''}`} onClick={() => setSection(item.key)}>
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      
      <main className="admin-main">
        <header className="admin-topbar">
            <div className="breadcrumbs"><span>Motorista</span> / <span>{MENU_ITEMS.find(i => i.key === section)?.label}</span></div>
            <div className="topbar-controls">
                <Link to="/" className="control-link"><Icons.Home /> Site</Link>
                <button onClick={logout} className="control-btn-logout"><Icons.Logout /> Sair</button>
            </div>
        </header>
        <div className="admin-content-wrapper">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default AreaCliente_Motorista