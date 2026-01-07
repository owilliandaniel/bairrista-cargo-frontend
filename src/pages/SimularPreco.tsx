// SimularPreco.tsx - Price simulation with TypeScript
import React, { useState, useEffect } from 'react';
import { getTiposImovelProxy, simularPrecoMudanca, createMudanca } from '../services/api';
import InventarioIA from '../components/mudancas/InventarioIA';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

interface TipoImovel {
  id: number;
  nome: string;
}

interface SimulacaoForm {
  cidade_origem: string;
  cidade_destino: string;
  tipo_imovel_id: string;
  precisa_empacotamento: boolean;
}

interface ItemInventario {
  tipo_mobilia?: number;
  quantidade_sugerida?: number;
  observacao?: string;
}

interface ResultadoSimulacao {
  distancia_km?: number;
  duracao_horas?: number;
  volume_m3_estimado?: number;
  volume_estimado_m3?: number;
  preco_medio?: number;
  preco_minimo?: number;
  preco_maximo?: number;
  detalhes?: {
    custo_frete: number;
    custo_embalagem: number;
    taxa_fixa: number;
  };
}

interface SimularPrecoProps {
  onClose?: () => void;
}

function SimularPreco({ onClose }: SimularPrecoProps) {
  const toast = useToast();
  const { user } = useAuth();
  const [tiposImovel, setTiposImovel] = useState<TipoImovel[]>([]);
  const [simulacao, setSimulacao] = useState<SimulacaoForm>({
    cidade_origem: '',
    cidade_destino: '',
    tipo_imovel_id: '',
    precisa_empacotamento: false
  });
  const [itensInventario, setItensInventario] = useState<ItemInventario[]>([]);
  const [resultado, setResultado] = useState<ResultadoSimulacao | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar tipos de imóvel ao montar o componente
  useEffect(() => {
    const carregarTiposImovel = async () => {
      try {
        console.log('Carregando tipos de imovel...');
        const response = await getTiposImovelProxy();
        console.log('Resposta da API:', response);
        
        let tipos: TipoImovel[] = [];
        
        if (Array.isArray(response)) {
          tipos = response;
        } else if (response?.results && Array.isArray(response.results)) {
          tipos = response.results;
        } else if (response?.data && Array.isArray(response.data)) {
          tipos = response.data;
        }
        
        console.log('Tipos carregados:', tipos);
        console.log('Total:', tipos.length);
        
        if (tipos.length === 0) {
          console.warn('API retornou vazio, usando fallback');
          tipos = [
            { id: 1, nome: 'Kitnet (ate 30m2)' },
            { id: 2, nome: 'Apartamento 1 quarto (30-50m2)' },
            { id: 3, nome: 'Apartamento 2 quartos (50-70m2)' },
            { id: 4, nome: 'Apartamento 3 quartos (70-100m2)' },
            { id: 5, nome: 'Casa pequena (ate 100m2)' },
            { id: 6, nome: 'Casa media (100-200m2)' },
            { id: 7, nome: 'Casa grande (200m2+)' }
          ];
        }
        
        setTiposImovel(tipos);
        
      } catch (err) {
        console.error('Erro ao carregar tipos de imovel:', err);
        console.error('Detalhes:', (err as any).response?.data || (err as Error).message);
        
        const fallback: TipoImovel[] = [
          { id: 1, nome: 'Kitnet (ate 30m2)' },
          { id: 2, nome: 'Apartamento 1 quarto (30-50m2)' },
          { id: 3, nome: 'Apartamento 2 quartos (50-70m2)' },
          { id: 4, nome: 'Apartamento 3 quartos (70-100m2)' },
          { id: 5, nome: 'Casa pequena (ate 100m2)' },
          { id: 6, nome: 'Casa media (100-200m2)' },
          { id: 7, nome: 'Casa grande (200m2+)' }
        ];
        
        setTiposImovel(fallback);
        setError('Erro ao carregar tipos de imovel. Usando lista padrao.');
      }
    };
    
    carregarTiposImovel();
  }, []);

  // Função para processar a simulação
  const handleSimulacaoSubmit = async () => {
    // Validações
    if (!simulacao.cidade_origem || !simulacao.cidade_destino || !simulacao.tipo_imovel_id) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const result = await simularPrecoMudanca(simulacao);
      setResultado(result);
    } catch (err) {
      setError((err as any).response?.data?.message || 'Erro ao calcular o preço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para solicitar serviço (criar mudança real)
  const handleSolicitarServico = async () => {
    if (!resultado) {
      toast.error('Faça uma simulação primeiro');
      return;
    }

    if (!user) {
      toast.error('Você precisa estar logado para solicitar um serviço');
      return;
    }

    if (itensInventario.length === 0) {
      toast.warning('Adicione pelo menos um item ao inventário usando a IA ou continue sem itens');
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar dados da mudança
      const MAP_TIPO_MUDANCA: { [key: string]: string } = {
        'RESIDENCIAL': 'RES',
        'COMERCIAL': 'COM',
        'OUTROS': 'OUT'
      };
      const MAP_TIPO_LOCAL: { [key: string]: string } = {
        'CASA': 'CAS',
        'APARTAMENTO': 'APT',
        'OUTROS': 'OUT'
      };

      const dadosMudanca = {
        status: 'SOL',
        tipo_mudanca: MAP_TIPO_MUDANCA['RESIDENCIAL'],
        data_mudanca: new Date().toISOString().split('T')[0],
        cidade_origem: simulacao.cidade_origem,
        estado_origem: 'RS',
        endereco_origem: 'A definir',
        tipo_origem: MAP_TIPO_LOCAL['APARTAMENTO'],
        elevador_origem: true,
        cidade_destino: simulacao.cidade_destino,
        estado_destino: 'RS',
        endereco_destino: 'A definir',
        tipo_destino: MAP_TIPO_LOCAL['APARTAMENTO'],
        precisa_empacotamento: simulacao.precisa_empacotamento,
        itens: itensInventario.length > 0 ? itensInventario.map(item => ({
          tipo_mobilia: item.tipo_mobilia || 1,
          quantidade: item.quantidade_sugerida || 1,
          observacao_item: item.observacao || ''
        })) : []
      };

      console.log('Enviando dados da mudança:', dadosMudanca);
      await createMudanca(dadosMudanca);
      
      toast.success('✅ Serviço solicitado com sucesso! Sua mudança foi enviada para o marketplace.');
      if (onClose) onClose();
      
    } catch (err) {
      console.error('Erro ao solicitar serviço:', err);
      const errorMsg = (err as any).response?.data?.detail || (err as any).response?.data?.message || 'Erro ao solicitar serviço. Tente novamente.';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetSimulacao = () => {
    setSimulacao({
      cidade_origem: '',
      cidade_destino: '',
      tipo_imovel_id: '',
      precisa_empacotamento: false
    });
    setItensInventario([]);
    setResultado(null);
    setError(null);
  };

  const handleClose = () => {
    resetSimulacao();
    if (onClose) onClose();
  };

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      background: 'rgba(255,255,255,0.05)',
      padding: '3rem',
      borderRadius: '20px',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      maxWidth: '700px',
      width: '100%'
    }}>
      {!resultado ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '400', margin: 0 }}>Simular Preço de Mudança</h3>
            <button
              onClick={handleClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '1.5rem',
                padding: '0.5rem'
              }}
            >✕</button>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              background: 'rgba(255,77,77,0.2)',
              border: '1px solid rgba(255,77,77,0.4)',
              borderRadius: '8px',
              color: '#ff9999',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ 
              fontSize: '0.85rem', 
              color: 'rgba(255,255,255,0.5)', 
              marginBottom: '10px', 
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '500'
            }}>Cidade de Origem *</label>
            <input 
              type="text" 
              placeholder="Porto Alegre, RS"
              value={simulacao.cidade_origem}
              onChange={(e) => setSimulacao({...simulacao, cidade_origem: e.target.value})}
              style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                width: '100%',
                fontSize: '1.1rem',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                transition: 'all 0.3s ease',
                fontWeight: '300'
              }} 
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.5)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.2)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              fontSize: '0.85rem', 
              color: 'rgba(255,255,255,0.5)', 
              marginBottom: '10px', 
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '500'
            }}>Cidade de Destino *</label>
            <input 
              type="text" 
              placeholder="Florianópolis, SC" 
              value={simulacao.cidade_destino}
              onChange={(e) => setSimulacao({...simulacao, cidade_destino: e.target.value})}
              style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                width: '100%',
                fontSize: '1.1rem',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                transition: 'all 0.3s ease',
                fontWeight: '300'
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.5)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.2)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>

          <div>
            <label style={{ 
              fontSize: '0.85rem', 
              color: 'rgba(255,255,255,0.5)', 
              marginBottom: '10px', 
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '500'
            }}>Tamanho do Imóvel *</label>
            <select 
              value={simulacao.tipo_imovel_id}
              onChange={(e) => setSimulacao({...simulacao, tipo_imovel_id: e.target.value})}
              style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                width: '100%',
                fontSize: '1.1rem',
                background: '#1a1a1a',
                color: '#fff',
                transition: 'all 0.3s ease',
                fontWeight: '300',
                cursor: 'pointer',
                appearance: 'auto',
                WebkitAppearance: 'menulist',
                MozAppearance: 'menulist'
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.5)';
                e.currentTarget.style.background = '#2a2a2a';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.2)';
                e.currentTarget.style.background = '#1a1a1a';
              }}
            >
              <option value="" style={{ background: '#0a0a0a' }}>
                Selecione o tipo de imóvel
              </option>
              {tiposImovel.map(tipo => (
                <option 
                  key={tipo.id} 
                  value={tipo.id} 
                  style={{ 
                    background: '#1a1a1a',
                    color: '#fff',
                    padding: '10px'
                  }}
                >
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input 
              type="checkbox"
              id="empacotamento"
              checked={simulacao.precisa_empacotamento}
              onChange={(e) => setSimulacao({...simulacao, precisa_empacotamento: e.target.checked})}
              style={{ 
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="empacotamento" style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer'
            }}>
              Preciso de serviço de empacotamento
            </label>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <InventarioIA 
              onItensDetectados={(itens: ItemInventario[]) => setItensInventario(itens)}
            />
          </div>

          <button 
            onClick={handleSimulacaoSubmit}
            disabled={loading}
            style={{ 
              padding: '1.2rem 2.5rem',
              fontSize: '0.95rem',
              borderRadius: '50px',
              background: loading ? 'linear-gradient(135deg, #434343 0%, #000000 100%)' : 'linear-gradient(135deg, #434343 0%, #000000 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '0.5rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
              }
            }}
            onMouseOut={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }
            }}
          >
            {loading ? '⏳ Calculando...' : '↗ Calcular Preço ↗'}
          </button>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '400', margin: 0 }}>Resultado da Simulação</h3>
            <button
              onClick={handleClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '1.5rem',
                padding: '0.5rem'
              }}
            >✕</button>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
                Distância: {resultado.distancia_km?.toFixed(1) || '0.0'} km
                {resultado.duracao_horas && ` | Duração estimada: ${resultado.duracao_horas.toFixed(1)}h`}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                Volume estimado: {resultado.volume_m3_estimado || resultado.volume_estimado_m3 || 0} m³
              </div>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.15)',
              padding: '1.5rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                PREÇO MÉDIO ESTIMADO
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '300', color: '#fff' }}>
                R$ {resultado.preco_medio?.toFixed(2) || '0.00'}
              </div>
            </div>

            {(resultado.preco_minimo || resultado.preco_maximo) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                {resultado.preco_minimo && (
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem' }}>
                      MÍNIMO
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '400' }}>
                      R$ {resultado.preco_minimo.toFixed(2)}
                    </div>
                  </div>
                )}
                {resultado.preco_maximo && (
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem' }}>
                      MÁXIMO
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '400' }}>
                      R$ {resultado.preco_maximo.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {resultado.detalhes && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.8rem' }}>
                  Detalhamento:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>Frete:</span>
                    <span style={{ color: '#fff' }}>R$ {resultado.detalhes.custo_frete.toFixed(2)}</span>
                  </div>
                  {resultado.detalhes.custo_embalagem > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>Empacotamento:</span>
                      <span style={{ color: '#fff' }}>R$ {resultado.detalhes.custo_embalagem.toFixed(2)}</span>
                    </div>
                  )}
                  {resultado.detalhes.taxa_fixa > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>Taxa fixa:</span>
                      <span style={{ color: '#fff' }}>R$ {resultado.detalhes.taxa_fixa.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={handleSolicitarServico}
              disabled={loading}
              style={{ 
                padding: '1.2rem 2.5rem',
                fontSize: '0.95rem',
                borderRadius: '50px',
                background: loading ? 'linear-gradient(135deg, #666 0%, #333 100%)' : 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                flex: 1,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.5)';
                }
              }}
              onMouseOut={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                }
              }}
            >
              {loading ? '⏳ Solicitando...' : '✅ Solicitar Serviço'}
            </button>

            <button 
              onClick={resetSimulacao}
              style={{ 
                padding: '1.2rem 2.5rem',
                fontSize: '0.95rem',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flex: 1,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }}
            >
              ↗ Nova Simulação ↗
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SimularPreco;
