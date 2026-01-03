import React, { useState, ChangeEvent, FormEvent } from 'react';
import { enviarProposta } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Mudanca, User } from '../../types';

interface VisualizarOfertasProps {
  mudanca: Mudanca;
  user: User | null;
  onClose: () => void;
  onPropostaEnviada: () => void;
}

export default function VisualizarOfertas({ mudanca, user, onClose, onPropostaEnviada }: VisualizarOfertasProps) {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  
  const [formProposta, setFormProposta] = useState({
    valor_final_empresa: mudanca.preco_sugerido_para_minha_empresa 
        ? Number(mudanca.preco_sugerido_para_minha_empresa).toFixed(2) 
        : '',
    valor_empacotamento: mudanca.precisa_empacotamento ? '150.00' : '0.00',
    valor_desmontagem_montagem: '',
    observacoes_empresa: ''
  });

  const handleChangeProposta = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormProposta(prev => ({ ...prev, [name]: value }));
  };

  const calcularTotal = () => {
    const base = parseFloat(formProposta.valor_final_empresa) || 0;
    const empacotamento = parseFloat(formProposta.valor_empacotamento) || 0;
    const desmontagem = parseFloat(formProposta.valor_desmontagem_montagem) || 0;
    return (base + empacotamento + desmontagem).toFixed(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Usuário não identificado.');
      return;
    }
    
    // Verificar se é uma empresa
    if (user.tipo_usuario !== 'E') {
      toast.error('Apenas empresas podem enviar orçamentos.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        mudanca: mudanca.id,
        empresa: user.tipo_usuario === 'E' ? user.id : user.empresa_id,
        valor_final_empresa: formProposta.valor_final_empresa,
        valor_empacotamento: formProposta.valor_empacotamento,
        valor_desmontagem_montagem: formProposta.valor_desmontagem_montagem,
        observacoes_empresa: formProposta.observacoes_empresa
      };
      
      await enviarProposta(payload);
      toast.success('Proposta enviada com sucesso!');
      onPropostaEnviada();
    } catch (err: any) {
      console.error('Erro ao enviar proposta:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao enviar proposta.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="oferta-detalhe-overlay">
      <div className="oferta-detalhe-modal">
        <div className="modal-header">
          <h2>Detalhes da Solicitação #{mudanca.id}</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="modal-body">
          <div className="info-column">
            <div className="route-card">
              <div className="point">
                <span className="dot origin"></span>
                <strong>{mudanca.cidade_origem}</strong>
                <span className="uf">{mudanca.uf_origem}</span>
              </div>
              <div className="connector">↓ <span className="dist">{mudanca.distancia_km} km</span></div>
              <div className="point">
                <span className="dot dest"></span>
                <strong>{mudanca.cidade_destino}</strong>
                <span className="uf">{mudanca.uf_destino}</span>
              </div>
            </div>

            <div className="specs-grid">
              <div className="spec-item">
                <span className="label">Data Prevista</span>
                <strong>{new Date(mudanca.data_mudanca).toLocaleDateString('pt-BR')}</strong>
              </div>
              <div className="spec-item">
                <span className="label">Volume Total</span>
                <strong>{mudanca.volume_m3_estimado || mudanca.volume_total_m3} m³</strong>
              </div>
              <div className="spec-item">
                <span className="label">Itens</span>
                <strong>{mudanca.total_itens || 0} itens listados</strong>
              </div>
              <div className="spec-item">
                <span className="label">Serviços Extras</span>
                <strong>{mudanca.precisa_empacotamento ? 'Empacotamento Incluso' : 'Apenas Transporte'}</strong>
              </div>
            </div>
          </div>

          <div className="form-column">
            <h3>Enviar Orçamento</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Frete Base (R$)</label>
                <input
                  type="number"
                  name="valor_final_empresa"
                  value={formProposta.valor_final_empresa}
                  onChange={handleChangeProposta}
                  required
                />
              </div>
              
              <div className="row-inputs">
                <div className="form-group">
                  <label>Empacotamento</label>
                  <input
                    type="number"
                    name="valor_empacotamento"
                    value={formProposta.valor_empacotamento}
                    onChange={handleChangeProposta}
                  />
                </div>
                <div className="form-group">
                  <label>Desmontagem</label>
                  <input
                    type="number"
                    name="valor_desmontagem_montagem"
                    value={formProposta.valor_desmontagem_montagem}
                    onChange={handleChangeProposta}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Observações</label>
                <textarea
                  name="observacoes_empresa"
                  rows={3}
                  value={formProposta.observacoes_empresa}
                  onChange={handleChangeProposta}
                  placeholder="Diferenciais, prazos, etc."
                />
              </div>

              <div className="total-display">
                <span>Total Estimado:</span>
                <strong>R$ {calcularTotal()}</strong>
              </div>

              <button type="submit" disabled={loading} className="btn-submit-proposta">
                {loading ? 'Enviando...' : 'Confirmar Proposta'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}