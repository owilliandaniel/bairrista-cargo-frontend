import React, { useState } from 'react';
import { Icons } from '../../components/EmpresaIcons';
import { FinancialRecord } from '../../types';

const MOCK_FINANCIAL_SERVICES: FinancialRecord[] = [
  { id: 1, desc: 'Frete Carga Seca - SP/RJ', data: '05/11/2023', valor: 4500, status: 'recebido', cliente: 'Indústrias Metalúrgicas' },
  { id: 2, desc: 'Mudança Residencial #402', data: '12/11/2023', valor: 2800, status: 'recebido', cliente: 'Ana Paula Souza' },
  { id: 3, desc: 'Transporte Frágil - Curitiba', data: '20/11/2023', valor: 3200, status: 'a_receber', cliente: 'Tech Solutions' },
  { id: 4, desc: 'Frete Retorno - Florianópolis', data: '28/11/2023', valor: 1500, status: 'a_receber', cliente: 'Carlos Express' },
];

function EmpresaFinanceiro() {
  const [mesSelecionado, setMesSelecionado] = useState<string>('Novembro 2023');

  const totalRecebido = MOCK_FINANCIAL_SERVICES
      .filter(i => i.status === 'recebido')
      .reduce((acc, curr) => acc + curr.valor, 0);
  
  const totalAReceber = MOCK_FINANCIAL_SERVICES
      .filter(i => i.status === 'a_receber')
      .reduce((acc, curr) => acc + curr.valor, 0);

  const totalGeral = totalRecebido + totalAReceber;

  return (
    <div className="management-panel fade-in">
        <div className="panel-header">
            <div>
                <h1>Financeiro</h1>
                <p>Controle de serviços realizados e previsão de recebimentos.</p>
            </div>
            
            <div className="month-selector">
                <Icons.Operations />
                <select 
                  value={mesSelecionado} 
                  onChange={(e) => setMesSelecionado(e.target.value)}
                  className="month-select-input"
                >
                    <option>Outubro 2023</option>
                    <option>Novembro 2023</option>
                    <option>Dezembro 2023</option>
                </select>
            </div>
        </div>

        <div className="finance-kpi-grid">
            <div className="finance-card highlight">
                <span className="f-label">Total Movimentado (Mês)</span>
                <h2 className="f-value">R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                <span className="f-sub">Soma de Realizados + A Receber</span>
            </div>
            <div className="finance-card">
                <div className="flex-between">
                    <span className="f-label">Já Recebido (Em Caixa)</span>
                    <div className="status-dot green"></div>
                </div>
                <h2 className="f-value text-green">R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                <span className="f-sub">Serviços concluídos</span>
            </div>
            <div className="finance-card">
                <div className="flex-between">
                     <span className="f-label">A Receber (Previsão)</span>
                     <div className="status-dot yellow"></div>
                </div>
                <h2 className="f-value text-gray">R$ {totalAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                <span className="f-sub">Aceitos e Em Andamento</span>
            </div>
        </div>

        <div className="content-box mt-4">
            <div className="box-header-simple">
                <h3>Detalhamento Mensal ({mesSelecionado})</h3>
            </div>
            <div className="finance-list">
                {MOCK_FINANCIAL_SERVICES.map(item => (
                    <div key={item.id} className="transaction-row">
                        <div className="t-status-icon">
                            {item.status === 'recebido' 
                                ? <Icons.Wallet /> 
                                : <Icons.Operations />
                            }
                        </div>
                        <div className="t-desc">
                            <strong>{item.desc}</strong>
                            <small>{item.cliente} • {item.data}</small>
                        </div>
                        <div className="t-status-pill">
                            {item.status === 'recebido' 
                                ? <span className="pill-success">Concluído</span> 
                                : <span className="pill-pending">A Receber</span>
                            }
                        </div>
                        <div className={`t-amount ${item.status === 'recebido' ? 'text-green' : 'text-gray'}`}>
                            R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default EmpresaFinanceiro;