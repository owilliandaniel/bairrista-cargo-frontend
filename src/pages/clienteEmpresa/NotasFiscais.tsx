import React, { useState, useEffect } from 'react';
import { getNotasFiscais, downloadNotaFiscal } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import '../../components/AreaCliente.css';

interface NotaFiscal {
  id: number;
  numero: string;
  data_emissao: string;
  valor: string | number;
  cliente_nome?: string;
  mudanca_id?: number;
  status?: string;
}

export default function NotasFiscais() {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotas();
  }, []);

  const fetchNotas = async () => {
    try {
      setLoading(true);
      const data = await getNotasFiscais();
      const list = Array.isArray(data) ? data : data.results || [];
      setNotas(list);
    } catch (err) {
      console.error('Erro ao carregar notas fiscais:', err);
      showToast('Erro ao carregar notas fiscais', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (notaId: number, numero: string) => {
    try {
      setDownloading(notaId);
      const blob = await downloadNotaFiscal(notaId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NF-${numero}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('Download iniciado com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao baixar nota fiscal:', err);
      showToast('Erro ao baixar nota fiscal', 'error');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="content-box">
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          Carregando notas fiscais...
        </div>
      </div>
    );
  }

  return (
    <div className="notas-fiscais-section">
      <div className="content-box">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#333' }}>📄 Notas Fiscais Emitidas</h3>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.95rem' }}>
            Consulte e baixe suas notas fiscais emitidas
          </p>
        </div>

        {notas.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <p>Nenhuma nota fiscal encontrada</p>
            <small>As notas fiscais aparecerão aqui após a emissão</small>
          </div>
        ) : (
          <div className="table-container">
            <table className="table-notas">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Data Emissão</th>
                  <th>Valor</th>
                  <th>Cliente</th>
                  <th>Mudança</th>
                  <th style={{ textAlign: 'center' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {notas.map((nota) => (
                  <tr key={nota.id}>
                    <td>
                      <strong style={{ color: '#333' }}>{nota.numero}</strong>
                    </td>
                    <td>
                      {new Date(nota.data_emissao).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      <span style={{ color: '#2e7d32', fontWeight: '500' }}>
                        R$ {parseFloat(String(nota.valor)).toFixed(2)}
                      </span>
                    </td>
                    <td>{nota.cliente_nome || '-'}</td>
                    <td>
                      {nota.mudanca_id ? (
                        <span style={{ color: '#666' }}>#{nota.mudanca_id}</span>
                      ) : '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-download"
                        onClick={() => handleDownload(nota.id, nota.numero)}
                        disabled={downloading === nota.id}
                        title="Baixar PDF"
                      >
                        {downloading === nota.id ? (
                          <>⏳ Baixando...</>
                        ) : (
                          <>📥 Baixar PDF</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .table-container {
          overflow-x: auto;
        }

        .table-notas {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .table-notas thead {
          background: #f8f9fa;
        }

        .table-notas th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #444;
          border-bottom: 2px solid #e0e0e0;
        }

        .table-notas td {
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
          color: #666;
        }

        .table-notas tbody tr {
          transition: background 0.2s;
        }

        .table-notas tbody tr:hover {
          background: #f9f9f9;
        }

        .btn-download {
          background: #0066cc;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .btn-download:hover:not(:disabled) {
          background: #0052a3;
        }

        .btn-download:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .table-notas {
            font-size: 0.85rem;
          }

          .table-notas th,
          .table-notas td {
            padding: 0.75rem 0.5rem;
          }

          .btn-download {
            padding: 0.4rem 0.75rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
