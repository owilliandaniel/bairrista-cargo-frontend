// AreaCliente_Usuario.tsx - Customer dashboard wrapper with TypeScript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import NotificationCenter from '../../components/NotificationCenter';
import Dashboard from './Dashboard';
import MinhasSolicitacoes from './Solicitacoes';
import Pagamentos from './Pagamentos';
import Config from './Config';
import PropostasRecebidas from './PropostasRecebidas';
import './AreaCliente.css';

interface UserFormData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

interface Order {
  id: number;
  origem: string;
  destino: string;
  data: string;
  valor: string;
  status: string;
  rating: number;
}

interface Card {
  id: number;
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
}

type ActiveView = 'dashboard' | 'orders' | 'proposals' | 'payments' | 'profile';

function AreaUsuario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: ''
  });

  const [orders, _setOrders] = useState<Order[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        cpf: user.cpf || '',
        telefone: user.telefone || '',
        endereco: user.endereco_padrao || ''
      });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <Link to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
          BairristaCargo<span style={{color: 'var(--primary-color)'}}>.</span>
        </Link>

        <div className="user-profile-compact">
          <div className="avatar">{user?.nome?.charAt(0) || 'U'}</div>
          <div className="info">
            <strong>{user?.nome?.split(' ')[0] || 'Usuário'}</strong>
            <span>Cliente</span>
          </div>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-btn ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <span>📊</span> Visão Geral
          </button>
          <button 
            className={`nav-btn ${activeView === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveView('orders')}
          >
            <span>📦</span> Minhas Solicitações
          </button>
          <button 
            className={`nav-btn ${activeView === 'proposals' ? 'active' : ''}`}
            onClick={() => setActiveView('proposals')}
          >
            <span>📋</span> Propostas Recebidas
          </button>
          <button 
            className={`nav-btn ${activeView === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveView('payments')}
          >
            <span>💳</span> Pagamentos
          </button>
          <button 
            className={`nav-btn ${activeView === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveView('profile')}
          >
            <span>👤</span> Meus Dados
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="breadcrumbs">
            Área do Cliente / <span style={{ fontWeight: 600 }}>
              {activeView === 'dashboard' ? 'Visão Geral' : 
               activeView === 'orders' ? 'Minhas Solicitações' : 
               activeView === 'proposals' ? 'Propostas Recebidas' :
               activeView === 'payments' ? 'Pagamentos' : 'Meus Dados'}
            </span>
          </div>
          <div className="topbar-controls">
            <NotificationCenter />
            <button className="control-btn-logout" onClick={handleLogout}>
              <span>🚪</span> Sair
            </button>
          </div>
        </header>

        <main className="admin-content-wrapper">
          {activeView === 'dashboard' && <Dashboard orders={orders} setActiveView={setActiveView} />}
          {activeView === 'orders' && <MinhasSolicitacoes />}
          {activeView === 'proposals' && <PropostasRecebidas />}
          {activeView === 'profile' && <Config user={user} formData={formData} setFormData={setFormData} />}
          {activeView === 'payments' && <Pagamentos cards={cards} setCards={setCards} />}
        </main>
      </div>
    </div>
  );
}

export default AreaUsuario;
