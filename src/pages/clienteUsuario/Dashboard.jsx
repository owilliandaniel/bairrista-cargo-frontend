import React from 'react'
import '../../components/AreaCliente.css'

function Dashboard({ orders, setActiveView }) {
  return (
    <div className="fade-in">
      <h2 className="mb-2">Visão Geral</h2>
      <div className="kpi-grid">
        <div className="kpi-card highlight">
          <div className="kpi-icon">📦</div>
          <div className="kpi-content">
            <span className="kpi-label">Total de Pedidos</span>
            <span className="kpi-value">{orders.length}</span>
            <span className="kpi-sub">Desde o cadastro</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">🚚</div>
          <div className="kpi-content">
            <span className="kpi-label">Em Trânsito</span>
            <span className="kpi-value">{orders.filter(o => o.status === 'transit').length}</span>
            <span className="kpi-sub positive">Acompanhe agora</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">💳</div>
          <div className="kpi-content">
            <span className="kpi-label">Cartões Salvos</span>
            <span className="kpi-value">0</span>
            <span className="kpi-sub">Métodos ativos</span>
          </div>
        </div>
      </div>

      <div className="content-box">
        <h3>Últimas Atividades</h3>
        {orders.length > 0 ? (
           <div style={{ marginTop: '1rem' }}>
             <p>Seu último pedido para <strong>{orders[0].destino}</strong> está <strong style={{color: orders[0].status === 'transit' ? 'blue' : 'green'}}>
               {orders[0].status === 'transit' ? 'A Caminho' : 'Concluído'}
             </strong>.</p>
             <button className="btn-link" onClick={() => setActiveView('orders')}>Ver detalhes →</button>
           </div>
        ) : <p>Nenhuma atividade recente.</p>}
      </div>
    </div>
  )
}

export default Dashboard
