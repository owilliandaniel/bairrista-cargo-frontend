import React, { useState, useEffect } from 'react';
import { getOfertas } from '../../services/api';
import VisualizarOfertas from './VisualizarOfertas';
import { Mudanca, User } from '../../types';
import '../../components/AreaCliente.css';

interface MarketplaceProps {
  user: User | null;
}

export default function Marketplace({ user }: MarketplaceProps) {
  const [oportunidades, setOportunidades] = useState<Mudanca[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ofertaSelecionada, setOfertaSelecionada] = useState<Mudanca | null>(null);

  useEffect(() => {
    carregarOportunidades();
  }, []);

  const carregarOportunidades = async () => {
    try {
      setLoading(true);
      // 'any' é usado aqui para lidar com a resposta da API antes de formatar
      const dados: any = await getOfertas();
      let lista: Mudanca[] = [];
      
      if (Array.isArray(dados)) {
        lista = dados;
      } else if (dados && Array.isArray(dados.results)) {
        lista = dados.results;
      } else if (dados && Array.isArray(dados.data)) {
        lista = dados.data;
      }
      setOportunidades(lista);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropostaSucesso = () => {
    setOfertaSelecionada(null);
    carregarOportunidades();
  };

  if (loading) return <div style={{padding:'2rem', color:'#fff'}}>Carregando...</div>;

  return (
    <div className="marketplace-container fade-in">
      <div className="page-header">
        <h1 className="page-title">Mural de Oportunidades</h1>
        <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por origem ou destino..."
        />
      </div>

      <div className="cards-grid">
        {oportunidades.map((mudanca) => (
          <div key={mudanca.id} className="card-opportunity">
            <div className="card-badge">
              {new Date(mudanca.data_mudanca).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </div>

            <div className="route-container">
              <div className="route-item">
                <div className="route-dot origin"></div>
                <div className="route-info">
                  <span className="route-label">De</span>
                  <span className="route-city">{mudanca.cidade_origem}</span>
                </div>
              </div>

              <div className="route-item">
                <div className="route-dot destination"></div>
                <div className="route-info">
                  <span className="route-label">Para</span>
                  <span className="route-city">{mudanca.cidade_destino}</span>
                </div>
              </div>
            </div>

            <div className="card-chips">
               <span className="chip info">{mudanca.volume_m3_estimado || '-'} m³</span>
               <span className="chip service">{mudanca.precisa_empacotamento ? 'Com Montagem' : 'Só Frete'}</span>
            </div>

            <div className="card-footer">
               <div className="price-section">
                  <div className="price-label">Valor Sugerido</div>
                  <div className="price-value">
                      R$ {Number(mudanca.preco_sugerido_para_minha_empresa || 0).toLocaleString('pt-BR')}
                  </div>
               </div>
               <button className="btn-details" onClick={() => setOfertaSelecionada(mudanca)}>
                  Ver Detalhes
               </button>
            </div>
          </div>
        ))}
      </div>

      {ofertaSelecionada && (
        <VisualizarOfertas 
          mudanca={ofertaSelecionada} 
          user={user}
          onClose={() => setOfertaSelecionada(null)}
          onPropostaEnviada={handlePropostaSucesso}
        />
      )}
    </div>
  );
}