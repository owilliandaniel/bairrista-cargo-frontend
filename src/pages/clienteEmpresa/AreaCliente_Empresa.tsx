import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Icons } from '../../components/EmpresaIcons'; 
import NotificationCenter from '../../components/NotificationCenter';
import Marketplace from './Marketplace';
import EmpresaOverview from './EmpresaOverview';
import EmpresaOperacional from './EmpresaOperacional';
import EmpresaFinanceiro from './EmpresaFinanceiro';
import EmpresaConfig from './EmpresaConfig';
import CadastrarVeiculo from './CadastrarVeiculo';
import CadastrarMotorista from './CadastrarMotorista';
import CadastrarOferta from './CadastrarOferta';
import { SectionKey } from '../../types';
import '../../components/AreaCliente.css';

// Definição das chaves possíveis para o menu
type MenuItem = {
  key: SectionKey;
  label: string;
  icon: React.ComponentType;
}

const MENU_ITEMS: MenuItem[] = [
  { key: 'marketplace', label: 'Marketplace', icon: Icons.Marketplace },
  { key: 'visao_geral', label: 'Visão Geral', icon: Icons.Dashboard },
  { key: 'gestao', label: 'Gestão Operacional', icon: Icons.Operations },
  { key: 'financeiro', label: 'Controle Financeiro', icon: Icons.Wallet },
  { key: 'frota', label: 'Gerenciar Frota', icon: Icons.Truck },
  { key: 'equipe', label: 'Equipe', icon: Icons.Users },
  { key: 'rotas', label: 'Minhas Rotas', icon: Icons.Map },
  { key: 'config', label: 'Configurações', icon: Icons.Settings },
];

function AreaCliente_Empresa() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<SectionKey>('marketplace');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair?")) {
      logout();
    }
  };

  const renderContent = () => {
    // Usamos 'user as any' temporariamente se useAuth não estiver totalmente tipado
    switch (section) {
      case 'marketplace': return <Marketplace user={user as any} />;
      case 'visao_geral': return <EmpresaOverview user={user as any} setSection={setSection} />;
      case 'gestao': return <EmpresaOperacional setSection={setSection} />;
      case 'financeiro': return <EmpresaFinanceiro />;
      case 'frota': return <CadastrarVeiculo />;
      case 'equipe': return <CadastrarMotorista />;
      case 'config': return <EmpresaConfig user={user as any} />;
      case 'veiculos': return <CadastrarVeiculo />;
      case 'ofertas': return <CadastrarOferta tipoAtuacao={user?.tipo_usuario} />;
      default: return <div className="p-8">Em construção...</div>;
    }
  };

  const getCurrentPageInfo = () => {
    const item = MENU_ITEMS.find(i => i.key === section);
    return {
      title: item ? item.label : 'Área da Empresa',
      breadcrumb: `Empresa / ${item ? item.label : 'Início'}`
    };
  };
  const pageInfo = getCurrentPageInfo();

  return (
    <div className="layout-container">
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <div className="logo-icon">BC</div>
            <span className="logo-text">BairristaCargo</span>
          </Link>
          
          <button className="btn-toggle" onClick={toggleSidebar}>
            <Icons.Menu />
          </button>
        </div>

        <nav className="sidebar-nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${section === item.key ? 'active' : ''}`}
              onClick={() => setSection(item.key)}
            >
              <div className="nav-icon">
                <item.icon />
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <Icons.Logout />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
           <div className="breadcrumb">
             <span>{pageInfo.breadcrumb}</span>
           </div>
           <div className="top-bar-title">{pageInfo.title}</div>
           <div className="top-bar-actions">
             <NotificationCenter />
             <div className="company-greeting">Olá, {user?.nome || 'Transportador'}!</div>
           </div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default AreaCliente_Empresa;