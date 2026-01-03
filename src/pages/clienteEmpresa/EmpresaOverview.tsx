import React from 'react';
import { Icons } from '../../components/EmpresaIcons'
import { User, SectionKey } from '../../types';

interface EmpresaOverviewProps {
  user: User;
  setSection: (section: SectionKey) => void;
}

function EmpresaOverview({ user, setSection }: EmpresaOverviewProps) {
  return (
    <div className="overview-container fade-in">
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffffff' }}>Visão Geral</h2>
        <p style={{ color: '#a9acb3ff' }}>Resumo operacional e financeiro da sua transportadora.</p>
      </div>

      {/* KPIs - Indicadores Chave */}
      <div className="kpi-grid" >
        <div className="kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="kpi-icon" style={{ background: '#000000da', color: '#d97706' }}>
            <Icons.Marketplace />
          </div>
          <div className="kpi-content" >
            <span className="kpi-label">Solicitações Pendentes</span>
            <span className="kpi-value">2</span>
            <span className="kpi-sub" style={{ color: '#d97706' }}>Clientes aguardando resposta</span>
          </div>
        </div>
        
        <div className="kpi-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="kpi-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <Icons.Wallet />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Faturamento (Mês)</span>
            <span className="kpi-value">R$ 12.5k</span>
            <span className="kpi-sub positive">▲ 8% vs mês anterior</span>
          </div>
        </div>
        
        <div className="kpi-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="kpi-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <Icons.Truck />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Veículos Ativos</span>
            <span className="kpi-value">4</span>
            <span className="kpi-sub">Frota operacional</span>
          </div>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div className="content-box mt-4">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#374151' }}>Ações Rápidas</h3>
        <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          <button 
            className="action-btn-card" 
            onClick={() => setSection('ofertas')}
            style={{ padding: '1.5rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
          >
            <div style={{ fontSize: '1.5rem', color: '#4b5563' }}><Icons.Box /></div>
            <span style={{ fontWeight: '600', color: '#374151' }}>Criar Nova Oferta</span>
          </button>

          <button 
            className="action-btn-card" 
            onClick={() => setSection('veiculos')}
            style={{ padding: '1.5rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
          >
            <div style={{ fontSize: '1.5rem', color: '#4b5563' }}><Icons.Truck /></div>
            <span style={{ fontWeight: '600', color: '#374151' }}>Cadastrar Veículo</span>
          </button>

          <button 
            className="action-btn-card" 
            onClick={() => setSection('equipe')}
            style={{ padding: '1.5rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
          >
            <div style={{ fontSize: '1.5rem', color: '#4b5563' }}><Icons.Users /></div>
            <span style={{ fontWeight: '600', color: '#374151' }}>Gerenciar Equipe</span>
          </button>

        </div>
      </div>
    </div>
  );
}

export default EmpresaOverview;