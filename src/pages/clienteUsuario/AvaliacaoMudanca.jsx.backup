import { useState } from 'react'
import { avaliarMudancaCompleta, abrirSinistro } from '../../services/api'
import { useToast } from '../../contexts/ToastContext'

/**
 * Componente de avaliação pós-mudança com opção de abertura de sinistro
 * Cliente avalia o serviço e, se houver problemas, abre disputa
 */
function AvaliacaoMudanca({ mudancaId, onAvaliacaoEnviada }) {
  const toast = useToast()
  const [etapa, setEtapa] = useState('avaliacao') // 'avaliacao' | 'sinistro'
  const [processando, setProcessando] = useState(false)
  
  const [formAvaliacao, setFormAvaliacao] = useState({
    nota: 5,
    comentario: '',
    teve_problema: false
  })

  const [formSinistro, setFormSinistro] = useState({
    item_afetado: '',
    descricao_cliente: '',
    foto_dano: null
  })

  const [previewFoto, setPreviewFoto] = useState(null)

  const handleChangeAvaliacao = (e) => {
    const { name, value, type, checked } = e.target
    setFormAvaliacao(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleChangeSinistro = (e) => {
    const { name, value } = e.target
    setFormSinistro(prev => ({ ...prev, [name]: value }))
  }

  const handleFotoChange = (e) => {
    const arquivo = e.target.files[0]
    if (arquivo) {
      setFormSinistro(prev => ({ ...prev, foto_dano: arquivo }))
      
      // Preview
      const reader = new FileReader()
      reader.onloadend = () => setPreviewFoto(reader.result)
      reader.readAsDataURL(arquivo)
    }
  }

  const handleSubmitAvaliacao = async (e) => {
    e.preventDefault()

    if (formAvaliacao.teve_problema) {
      // Avança para formulário de sinistro
      setEtapa('sinistro')
      return
    }

    // Envia avaliação positiva
    setProcessando(true)
    try {
      await avaliarMudancaCompleta(mudancaId, formAvaliacao)
      toast.success('Avaliação enviada! O pagamento foi liberado para a empresa.')
      onAvaliacaoEnviada?.()
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err)
      toast.error('Erro ao enviar avaliação. Tente novamente.')
    } finally {
      setProcessando(false)
    }
  }

  const handleSubmitSinistro = async (e) => {
    e.preventDefault()
    setProcessando(true)

    try {
      // Abre o sinistro
      await abrirSinistro(mudancaId, formSinistro)
      
      toast.success('Sinistro aberto com sucesso! O pagamento foi retido e sua solicitação está em análise.')
      onAvaliacaoEnviada?.()
    } catch (err) {
      console.error('Erro ao abrir sinistro:', err)
      toast.error('Erro ao abrir sinistro. Tente novamente.')
    } finally {
      setProcessando(false)
    }
  }

  if (etapa === 'sinistro') {
    return (
      <div className="avaliacao-container">
        <div className="avaliacao-header">
          <h3>⚠️ Abrir Sinistro</h3>
          <p>Descreva o problema e envie fotos dos danos</p>
        </div>

        <form onSubmit={handleSubmitSinistro} className="form-sinistro">
          <div className="form-group">
            <label>Item Afetado*</label>
            <input
              type="text"
              name="item_afetado"
              value={formSinistro.item_afetado}
              onChange={handleChangeSinistro}
              required
              placeholder="Ex: Geladeira, Sofá, Mesa..."
            />
          </div>

          <div className="form-group">
            <label>Descrição do Problema*</label>
            <textarea
              name="descricao_cliente"
              value={formSinistro.descricao_cliente}
              onChange={handleChangeSinistro}
              required
              rows="4"
              placeholder="Descreva o que aconteceu com o máximo de detalhes possível"
            />
          </div>

          <div className="form-group">
            <label>Foto do Dano*</label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFotoChange}
              required
            />
            {previewFoto && (
              <div className="foto-preview">
                <img src={previewFoto} alt="Preview do dano" />
              </div>
            )}
          </div>

          <div className="sinistro-info">
            <p>🔒 O pagamento ficará retido até a resolução do sinistro</p>
            <p>🤖 Nossa IA analisará as fotos para gerar um laudo preliminar</p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => {
                setEtapa('avaliacao')
                setFormAvaliacao(prev => ({ ...prev, teve_problema: false }))
              }}
              className="btn-voltar"
              disabled={processando}
            >
              ← Voltar
            </button>
            <button
              type="submit"
              className="btn-abrir-sinistro"
              disabled={processando}
            >
              {processando ? 'Enviando...' : 'Abrir Sinistro'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="avaliacao-container">
      <div className="avaliacao-header">
        <h3>⭐ Avaliar Mudança</h3>
        <p>Conte-nos como foi sua experiência</p>
      </div>

      <form onSubmit={handleSubmitAvaliacao} className="form-avaliacao">
        <div className="form-group">
          <label>Nota Geral*</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map((nota) => (
              <label key={nota} className="rating-option">
                <input
                  type="radio"
                  name="nota"
                  value={nota}
                  checked={formAvaliacao.nota === nota}
                  onChange={(e) => setFormAvaliacao(prev => ({ ...prev, nota: parseInt(e.target.value) }))}
                  required
                />
                <span className="star-display">
                  {'⭐'.repeat(nota)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Comentário (opcional)</label>
          <textarea
            name="comentario"
            value={formAvaliacao.comentario}
            onChange={handleChangeAvaliacao}
            rows="4"
            placeholder="Conte-nos mais sobre sua experiência..."
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="teve_problema"
              checked={formAvaliacao.teve_problema}
              onChange={handleChangeAvaliacao}
            />
            <span>❌ Houve algum problema ou dano durante a mudança</span>
          </label>
        </div>

        {formAvaliacao.teve_problema && (
          <div className="problema-alert">
            <p>⚠️ Você será direcionado para abrir um sinistro e relatar o problema em detalhes.</p>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn-enviar-avaliacao"
            disabled={processando}
          >
            {processando ? 'Enviando...' : formAvaliacao.teve_problema ? 'Prosseguir para Sinistro →' : 'Enviar Avaliação'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AvaliacaoMudanca
