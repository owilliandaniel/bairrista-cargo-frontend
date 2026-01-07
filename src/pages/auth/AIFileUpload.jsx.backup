import React from 'react';
import api from '../../services/api';

const AIFileUpload = ({
  onDataExtracted,
  documentType,
  uploadId,
  labelIcon,
  labelText,
  labelHint,
  analyzingText,
  analyzing,
  setAnalyzing,
  setError,
}) => {

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAnalyzing(true);
    if(setError) setError('');

    const uploadData = new FormData();
    uploadData.append('imagem', file);
    uploadData.append('tipo', documentType);

    console.log('Enviando para IA:', documentType, file.name);

    try {
      const response = await api.post('ia/extrair-dados/', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) throw new Error('Falha na análise do documento');

      const data = response.data;
      onDataExtracted(data);
      alert('Dados extraídos com sucesso! Verifique e complete o formulário.');

    } catch (err) {
      console.error("Erro na IA:", err);
      if(setError) setError('Não foi possível extrair os dados do arquivo. Por favor, preencha manualmente.');
    } finally {
      setAnalyzing(false);
      e.target.value = ''; 
    }
  };

  return (
    <div className="ai-upload-section">
      {analyzing ? (
        <div className="ai-loading">
          <div className="spinner"></div>
          <span>{analyzingText}</span>
        </div>
      ) : (
        <>
          <input 
            type="file" 
            id={uploadId} 
            accept="image/*,.pdf" 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
          />
          <label htmlFor={uploadId} className="ai-upload-label">
            <span className="ai-icon">{labelIcon}</span>
            <span>{labelText}</span>
            <span className="ai-hint">{labelHint}</span>
          </label>
        </>
      )}
    </div>
  );
};

export default AIFileUpload;
