// PropostasRecebidas.tsx - Customer received proposals with TypeScript
import { useState, useEffect } from 'react';
import { getPropostasRecebidas, processarPagamento, getOrcamentos } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface Proposta {
  id: number;
  mudanca: number;
  empresa: number;
  empresa_nome?: string;
  empresa_avaliacao?: number;
  empresa_avaliacoes_total?: number;
  valor_final_empresa: number;
  valor_empacotamento: number;
  valor_desmontagem_montagem: number;
  observacoes_empresa?: string;
}

interface FormPagamento {
  metodo_pagamento: 'CARTAO' | 'PIX' | 'BOLETO';
  parcelas: number;
}

interface PropostasRecebidasProps {
  mudancaId?: number;
}

function PropostasRecebidas({ mudancaId }: PropostasRecebidasProps) {
  const toast = useToast();
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutAberto, setCheckoutAberto] = useState<number | null>(null);
  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  const [formPagamento, setFormPagamento] = useState<FormPagamento>({
    metodo_pagamento: 'CARTAO',
    parcelas: 1
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const data = await getOrcamentos();
        setPropostas(data);
      } catch (error) {
        console.error('Erro ao carregar propostas:', error);
      }
    };
    
    carregarDados();
  }, []);

  const carregarPropostas = async () => {
    try {
      setLoading(true);
      const responseData = await getPropostasRecebidas();

      let lista: any[] = [];
      if (Array.isArray(responseData)) {
        lista = responseData;
      } else if (responseData && Array.isArray(responseData.results)) {
        lista = responseData.results;
      } else if (responseData && Array.isArray(responseData.data)) {
        lista = responseData.data;
      }

      const propostasFiltradas = mudancaId 
        ? lista.filter(p => p.mudanca === mudancaId)
        : lista;
      setPropostas(propostasFiltradas);
    } catch (err) {
      console.error('Erro ao carregar propostas:', err);
      setPropostas([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirCheckout = (proposta: Proposta) => {
    setCheckoutAberto(proposta.id);
    setFormPagamento({
      metodo_pagamento: 'CARTAO',
      parcelas: 1
    });
  };

  const handleChangePagamento = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormPagamento(prev => ({ ...prev, [name]: value }));
  };

  const handlePagar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessandoPagamento(true);

    try {
      const resultado = await processarPagamento(checkoutAberto!, {
        metodo_pagamento: formPagamento.metodo_pagamento,
        parcelas: parseInt(formPagamento.parcelas.toString())
      });
      
      if (resultado.status === 'APROVADO') {
        toast.success(resultado.mensagem);
        setCheckoutAberto(null);
        carregarPropostas();
      } else {
        toast.error('Pagamento não aprovado. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      toast.error('Erro ao processar pagamento. Verifique os dados e tente novamente.');
    } finally {
      setProcessandoPagamento(false);
    }
  };

  const calcularValorTotal = (proposta: Proposta): string => {
    const base = parseFloat(proposta.valor_final_empresa.toString()) || 0;
    const empacotamento = parseFloat(proposta.valor_empacotamento.toString()) || 0;
    const montagem = parseFloat(proposta.valor_desmontagem_montagem.toString()) || 0;
    return (base + empacotamento + montagem).toFixed(2);
  };

  const calcularValorParcela = (proposta: Proposta): string => {
    const total = parseFloat(calcularValorTotal(proposta));
    return (total / formPagamento.parcelas).toFixed(2);
  };

  if (loading) {
    return <div className="propostas-loading">Carregando propostas...</div>;
  }

  if (propostas.length === 0) {
    return (
      <div className="propostas-empty">
        <p>Você ainda não recebeu propostas para esta mudança.</p>
        <p className="propostas-hint">💡 As empresas enviarão orçamentos em breve!</p>
      </div>
    );
  }

  const propostasOrdenadas = [...propostas].sort((a, b) => 
    parseFloat(calcularValorTotal(a)) - parseFloat(calcularValorTotal(b))
  );

  return (
    <div className="propostas-container">
      <h3>📬 Propostas Recebidas ({propostas.length})</h3>
      
      <div className="propostas-grid">
        {propostasOrdenadas.map((proposta, index) => (
          <div key={proposta.id} className={`proposta-card ${index === 0 ? 'melhor-oferta' : ''}`}>
            {index === 0 && <span className="badge-melhor">🏆 Melhor Oferta</span>}
            
            <div className="proposta-empresa">
              <h4>{proposta.empresa_nome || `Empresa #${proposta.empresa}`}</h4>
              {proposta.empresa_avaliacao && (
                <div className="empresa-rating">
                  ⭐ {proposta.empresa_avaliacao} ({proposta.empresa_avaliacoes_total} avaliações)
                </div>
              )}
            </div>

            <div className="proposta-valores">
              <div className="valor-item">
                <span className="label">Serviço de Mudança:</span>
                <span className="value">R$ {parseFloat(proposta.valor_final_empresa.toString()).toFixed(2)}</span>
              </div>
              {proposta.valor_desmontagem_montagem > 0 && (
                <div className="valor-item">
                  <span className="label">Desmontagem/Montagem:</span>
                  <span className="value">R$ {parseFloat(proposta.valor_desmontagem_montagem.toString()).toFixed(2)}</span>
                </div>
              )}
              {proposta.valor_empacotamento > 0 && (
                <div className="valor-item">
                  <span className="label">Empacotamento:</span>
                  <span className="value">R$ {parseFloat(proposta.valor_empacotamento.toString()).toFixed(2)}</span>
                </div>
              )}
              <div className="valor-total">
                <span className="label">Total:</span>
                <span className="value">R$ {calcularValorTotal(proposta)}</span>
              </div>
            </div>

            {proposta.observacoes_empresa && (
              <div className="proposta-observacoes">
                <p className="label">💬 Observações da Empresa:</p>
                <p>{proposta.observacoes_empresa}</p>
              </div>
            )}

            {checkoutAberto === proposta.id ? (
              <form onSubmit={handlePagar} className="checkout-form">
                <h4>💳 Finalizar Contratação</h4>
                
                <div className="form-group">
                  <label>Método de Pagamento*</label>
                  <select
                    name="metodo_pagamento"
                    value={formPagamento.metodo_pagamento}
                    onChange={handleChangePagamento}
                    required
                  >
                    <option value="CARTAO">Cartão de Crédito</option>
                    <option value="PIX">PIX</option>
                    <option value="BOLETO">Boleto Bancário</option>
                  </select>
                </div>

                {formPagamento.metodo_pagamento === 'CARTAO' && (
                  <div className="form-group">
                    <label>Parcelamento*</label>
                    <select
                      name="parcelas"
                      value={formPagamento.parcelas}
                      onChange={handleChangePagamento}
                      required
                    >
                      <option value="1">1x de R$ {calcularValorTotal(proposta)} (à vista)</option>
                      <option value="2">2x de R$ {calcularValorParcela(proposta)}</option>
                      <option value="3">3x de R$ {calcularValorParcela(proposta)}</option>
                      <option value="6">6x de R$ {calcularValorParcela(proposta)}</option>
                      <option value="12">12x de R$ {calcularValorParcela(proposta)}</option>
                    </select>
                  </div>
                )}

                <div className="checkout-info">
                  <p>🔒 Pagamento seguro via escrow</p>
                  <p>💡 O valor ficará retido até a conclusão da mudança</p>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => setCheckoutAberto(null)}
                    className="btn-cancelar"
                    disabled={processandoPagamento}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-pagar"
                    disabled={processandoPagamento}
                  >
                    {processandoPagamento ? 'Processando...' : 'Confirmar Pagamento'}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => abrirCheckout(proposta)}
                className="btn-contratar"
              >
                ✅ Contratar Empresa
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropostasRecebidas;
