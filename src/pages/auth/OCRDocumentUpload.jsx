import { useState } from 'react'
import { extrairDadosDocumento } from '../../services/api'
import { useToast } from '../../contexts/ToastContext'

/**
 * Componente para upload e extração automática de dados de documentos via OCR/IA
 * Suporta: CNH, RG, CNPJ
 * 
 * Uso:
 * <OCRDocumentUpload 
 *   tipoDocumento="CNH" 
 *   onDataExtracted={(dados) => console.log(dados)} 
 * />
 */
function OCRDocumentUpload({ tipoDocumento = 'CNH', onDataExtracted, disabled = false }) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  const handleFileChange = async (e) => {
    const arquivo = e.target.files[0]
    if (!arquivo) return

    // Validar tipo de arquivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!tiposPermitidos.includes(arquivo.type)) {
      setError('Formato não suportado. Use JPG, PNG ou PDF.')
      return
    }

    // Validar tamanho (max 10MB)
    if (arquivo.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 10MB.')
      return
    }

    setError('')
    setLoading(true)

    // Preview para imagens
    if (arquivo.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(arquivo)
    }

    try {
      const dados = await extrairDadosDocumento(tipoDocumento, arquivo)
      toast.success('Dados extraídos com sucesso!')
      onDataExtracted?.(dados)
    } catch (err) {
      console.error('Erro ao extrair dados:', err)
      setError(err.response?.data?.erro || 'Erro ao processar documento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ocr-upload-container">
      <div className="ocr-upload-area">
        <input
          type="file"
          id={`ocr-${tipoDocumento}`}
          accept="image/jpeg,image/jpg,image/png,application/pdf"
          onChange={handleFileChange}
          disabled={disabled || loading}
          style={{ display: 'none' }}
        />
        <label htmlFor={`ocr-${tipoDocumento}`} className="ocr-upload-label">
          {loading ? (
            <div className="ocr-loading">
              <div className="spinner"></div>
              <p>Analisando documento com IA...</p>
            </div>
          ) : (
            <>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="ocr-title">Upload de {tipoDocumento}</p>
              <p className="ocr-subtitle">Arraste ou clique para enviar</p>
              <p className="ocr-formats">JPG, PNG ou PDF (máx. 10MB)</p>
            </>
          )}
        </label>
      </div>

      {preview && (
        <div className="ocr-preview">
          <img src={preview} alt="Preview do documento" />
        </div>
      )}

      {error && (
        <div className="ocr-error">
          <span>⚠️</span> {error}
        </div>
      )}
    </div>
  )
}

export default OCRDocumentUpload
