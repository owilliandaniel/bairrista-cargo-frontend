import { useState } from 'react'
import { analisarImagemInventario } from '../../services/api'

/**
 * Componente para análise de imagens de ambientes e detecção automática de móveis via IA
 * A IA retorna uma lista de itens detectados com nível de confiança
 * 
 * Uso:
 * <InventarioIA 
 *   onItensDetectados={(itens) => console.log(itens)}
 * />
 */
function InventarioIA({ onItensDetectados, disabled = false }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const [resultado, setResultado] = useState(null)

  const handleFileChange = async (e) => {
    const arquivo = e.target.files[0]
    if (!arquivo) return

    // Validar tipo de arquivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png']
    if (!tiposPermitidos.includes(arquivo.type)) {
      setError('Formato não suportado. Use JPG ou PNG.')
      return
    }

    // Validar tamanho (max 10MB)
    if (arquivo.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 10MB.')
      return
    }

    setError('')
    setLoading(true)
    setResultado(null)

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(arquivo)

    try {
      const dados = await analisarImagemInventario(arquivo)
      setResultado(dados)
      onItensDetectados?.(dados.itens_detectados || [])
    } catch (err) {
      console.error('Erro ao analisar imagem:', err)
      setError(err.response?.data?.erro || 'Erro ao processar imagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const limpar = () => {
    setPreview(null)
    setResultado(null)
    setError('')
  }

  return (
    <div className="inventario-ia-container">
      <div className="ia-header">
        <h3>🤖 Análise Automática com IA</h3>
        <p>Tire uma foto do ambiente e deixe a IA identificar os móveis</p>
      </div>

      {!preview ? (
        <div className="ia-upload-area">
          <input
            type="file"
            id="inventario-ia-upload"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            disabled={disabled || loading}
            style={{ display: 'none' }}
          />
          <label htmlFor="inventario-ia-upload" className="ia-upload-label">
            {loading ? (
              <div className="ia-loading">
                <div className="spinner"></div>
                <p>A IA está carregando as informações da foto...</p>
                <p className="ia-loading-sub">Isso pode levar alguns segundos</p>
              </div>
            ) : (
              <>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21" strokeWidth="2"/>
                </svg>
                <p className="ia-title">Fotografe o ambiente</p>
                <p className="ia-subtitle">Sala, quarto, cozinha, escritório...</p>
                <p className="ia-formats">JPG ou PNG (máx. 10MB)</p>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="ia-result-area">
          <div className="ia-preview">
            <img src={preview} alt="Ambiente fotografado" />
            <button onClick={limpar} className="ia-clear-btn" type="button">
              ✕ Tirar outra foto
            </button>
          </div>

          {loading && (
            <div className="ia-loading" style={{ margin: '2rem 0' }}>
              <div className="spinner"></div>
              <p>A IA está carregando as informações da foto...</p>
              <p className="ia-loading-sub">Isso pode levar alguns segundos</p>
            </div>
          )}

          {resultado && (
            <div className="ia-items-detected">
              <h4>✅ Itens Detectados ({resultado.itens_detectados?.length || 0})</h4>
              {resultado.itens_detectados?.length > 0 ? (
                <ul className="ia-items-list">
                  {resultado.itens_detectados.map((item, index) => (
                    <li key={index} className="ia-item">
                      <div className="ia-item-info">
                        <strong>{item.nome_sugerido}</strong>
                        <span className="ia-item-qty">Qtd: {item.quantidade_sugerida}</span>
                        <span className="ia-item-size">{item.tamanho_ia}</span>
                      </div>
                      <div className="ia-item-confidence">
                        <span className={`confidence-badge ${item.confianca > 0.8 ? 'high' : item.confianca > 0.5 ? 'medium' : 'low'}`}>
                          {Math.round(item.confianca * 100)}% confiança
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ia-no-items">Nenhum item detectado nesta imagem.</p>
              )}
              <p className="ia-hint">💡 Revise os itens e ajuste as quantidades se necessário</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="ia-error">
          <span>⚠️</span> {error}
        </div>
      )}
    </div>
  )
}

export default InventarioIA
