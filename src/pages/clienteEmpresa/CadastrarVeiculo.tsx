import React from 'react';
import { Icons } from '../../components/EmpresaIcons';

function CadastrarVeiculo() {
  return (
    <div className="fade-in">
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        Adicione novos veículos à sua frota para aumentar sua capacidade de atendimento.
      </p>

      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="detail-grid">
          <div className="form-group">
            <label>Modelo do Veículo</label>
            <input type="text" className="modal-input" placeholder="Ex: Mercedes Accelo 1016" />
          </div>
          <div className="form-group">
            <label>Placa</label>
            <input type="text" className="modal-input" placeholder="ABC-1234" />
          </div>
        </div>

        <div className="detail-grid">
          <div className="form-group">
            <label>Tipo de Carroceria</label>
            <select className="modal-input">
              <option>Baú Fechado</option>
              <option>Sider</option>
              <option>Grade Baixa</option>
              <option>Caçamba</option>
            </select>
          </div>
          <div className="form-group">
            <label>Capacidade de Carga (kg)</label>
            <input type="number" className="modal-input" placeholder="Ex: 4500" />
          </div>
        </div>

        <div className="form-group">
           <label>Possui Rastreador?</label>
           <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input type="radio" name="rastreador" /> Sim
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input type="radio" name="rastreador" /> Não
              </label>
           </div>
        </div>

        <button className="btn-primary-full" style={{ maxWidth: '300px' }}>
          <Icons.Truck /> Cadastrar Veículo
        </button>
      </form>
      
      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            Veículos Ativos
        </h3>
        <div className="items-list-box" style={{ marginTop: '1rem' }}>
            <ul>
                <li><strong>IVX-9090</strong> - Caminhão Baú (Mercedes) - <span className="status-badge blue">Disponível</span></li>
                <li><strong>ABC-1234</strong> - Fiorino - <span className="status-badge yellow">Em Rota</span></li>
            </ul>
        </div>
      </div>
    </div>
  );
}
export default CadastrarVeiculo;