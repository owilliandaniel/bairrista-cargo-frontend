// Solicitacoes.tsx - Customer shipment requests with TypeScript
import React, { useState, useEffect } from 'react';
import AvaliacaoMudanca from './AvaliacaoMudanca';
import { getMinhasMudancas, deleteMudanca } from '../../services/api';
import '../../components/AreaCliente.css';

interface Solicitacao {
  id: number;
  origem: string;
  destino: string;
  data: string;
  valor: string;
  status: string;
  rating: number;
}

interface AvaliacaoModalState {
  open: boolean;
  orderId: number | null;
}

function MinhasSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [avaliacaoModal, setAvaliacaoModal] = useState<AvaliacaoModalState>({ open: false, orderId: null });

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const data = await getMinhasMudancas();
        
        let lista: any[] = [];
        if (Array.isArray(data)) {
          lista = data;
        } else if (data && Array.isArray(data.results)) {
          lista = data.results;
        } else if (data && Array.isArray(data.data)) {
          lista = data.data;
        }

        // Mapear para o formato esperado pela tabela
        const mapped: Solicitacao[] = lista.map(m => ({
          id: m.id,
          origem: `${m.cidade_origem}, ${m.estado_origem}`,
          destino: `${m.cidade_destino}, ${m.estado_destino}`,
          data: m.data_mudanca,
          valor: m.valor_final_empresa ? `R$ ${Number(m.valor_final_empresa).toFixed(2)}` : '--',
          status: m.status || 'PENDENTE',
          rating: m.rating || 0
        }));
        setSolicitacoes(mapped);
      } catch (err) {
        console.error('Erro ao carregar solicitações:', err);
        setSolicitacoes([]);
      }
    };
    fetchSolicitacoes();
  }, []);

  const openAvaliacao = (orderId: number) => {
    setAvaliacaoModal({ open: true, orderId });
  };

  const handleAvaliacaoEnviada = () => {
    setAvaliacaoModal({ open: false, orderId: null });
    setSolicitacoes(solicitacoes.map(o => o.id === avaliacaoModal.orderId ? { ...o, rating: 5 } : o));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
      try {
        await deleteMudanca(id);
        setSolicitacoes(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('Erro ao excluir solicitação:', err);
        alert('Não foi possível excluir a solicitação. Tente novamente.');
      }
    }
  };

  return (
    <div className="fade-in">
      <h2 className="mb-2">Minhas Solicitações</h2>
      <div className="content-box">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Rota</th>
              <th style={{ padding: '1rem' }}>Data</th>
              <th style={{ padding: '1rem' }}>Valor</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {solicitacoes.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>#{order.id}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.9rem' }}>De: {order.origem}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Para: {order.destino}</div>
                </td>
                <td style={{ padding: '1rem' }}>{order.data}</td>
                <td style={{ padding: '1rem' }}>{order.valor}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`status-badge ${
                    order.status === 'FIN' ? 'status-completed' : 
                    order.status === 'AND' ? 'status-transit' : 'status-pending'
                  }`}>
                    {order.status === 'FIN' ? 'Concluída' : 
                     order.status === 'AND' ? 'Em Andamento' : 'Pendente'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {order.status === 'FIN' ? (
                    order.rating > 0 ? (
                      <span style={{ color: '#ffc107' }}>{'★'.repeat(order.rating)}</span>
                    ) : (
                      <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 8px' }} onClick={() => openAvaliacao(order.id)}>
                        Avaliar
                      </button>
                    )
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '4px 8px' }}>Rastrear</button>
                      <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 8px', color: '#d63031', borderColor: '#d63031' }} onClick={() => handleDelete(order.id)}>
                        Excluir
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {avaliacaoModal.open && (
        <AvaliacaoMudanca
          mudancaId={avaliacaoModal.orderId!}
          onAvaliacaoEnviada={handleAvaliacaoEnviada}
        />
      )}
    </div>
  );
}

export default MinhasSolicitacoes;
