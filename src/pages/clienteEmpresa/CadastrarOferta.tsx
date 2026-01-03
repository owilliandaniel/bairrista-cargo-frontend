import React from 'react';
import { Icons } from '../../components/EmpresaIcons';

interface CadastrarOfertaProps {
  tipoAtuacao?: 'M' | 'C' | 'E';
}

function CadastrarOferta({ tipoAtuacao }: CadastrarOfertaProps) {
  return (
    <div className="fade-in">
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        Publique uma rota ou disponibilidade para que clientes encontrem seus serviços.
      </p>

      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="detail-grid">
          <div className="form-group">
            <label>Cidade de Origem</label>
            <input type="text" className="modal-input" placeholder="Cidade - UF" />
          </div>
          <div className="form-group">
            <label>Cidade de Destino (ou Região)</label>
            <input type="text" className="modal-input" placeholder="Cidade - UF" />
          </div>
        </div>

        <div className="detail-grid">
          <div className="form-group">
            <label>Data de Saída</label>
            <input type="date" className="modal-input" />
          </div>
          <div className="form-group">
            <label>Valor Estimado (Opcional)</label>
            <input type="text" className="modal-input" placeholder="R$ 0,00" />
          </div>
        </div>

        <div className="form-group">
            <label>Tipo de Serviço</label>
            <select className="modal-input">
                <option value="compartilhado">Carga Fracionada / Compartilhada</option>
                <option value="exclusivo">Caminhão Exclusivo</option>
                <option value="retorno">Frete de Retorno (Valor Promocional)</option>
            </select>
        </div>

        <div className="form-group">
            <label>Observações / Restrições</label>
            <textarea 
                className="modal-input" 
                rows={3} 
                placeholder="Ex: Não transportamos produtos químicos. Caminhão com plataforma elevatória."
            ></textarea>
        </div>

        <button className="btn-primary-full" style={{ maxWidth: '300px' }}>
          <Icons.Offer /> Publicar Oferta
        </button>
      </form>
    </div>
  );
}
export default CadastrarOferta;