import React, { useState, ChangeEvent, FormEvent } from 'react';
import api from '../../services/api';
import { Icons } from '../../components/EmpresaIcons';
import OCRDocumentUpload from '../auth/OCRDocumentUpload';
import { useToast } from '../../contexts/ToastContext';
import { Veiculo } from '../../types';
import '../../components/AreaCliente.css';

interface CadastrarMotoristaProps {
  onSuccess?: () => void;
}

function CadastrarMotorista({ onSuccess }: CadastrarMotoristaProps) {
  const toast = useToast();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [usarOCR, setUsarOCR] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cnh: '',
    categoria_cnh: 'C',
    validade_cnh: '',
    veiculo_padrao: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('motoristas/funcionarios/', formData);
      toast.success('Motorista cadastrado com sucesso! Ele já pode fazer login.');
      
      setFormData({
        nome: '', email: '', senha: '', cnh: '', 
        categoria_cnh: 'C', validade_cnh: '', veiculo_padrao: ''
      });
      
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      toast.error('Erro ao cadastrar. Verifique se o email ou CNH já existem.');
    } finally {
      setLoading(false);
    }
  };

  const handleDadosOCRExtraidos = (dados: any) => {
    setFormData(prev => ({
      ...prev,
      nome: dados.nome || prev.nome,
      cnh: dados.registro_cnh || prev.cnh,
      categoria_cnh: dados.categoria || prev.categoria_cnh,
      validade_cnh: dados.validade || prev.validade_cnh
    }));
    setUsarOCR(false);
  };

  return (
    <div className="fade-in">
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        Cadastre um funcionário. Isso criará um <strong>usuário de acesso</strong> para ele no sistema.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          type="button"
          onClick={() => setUsarOCR(!usarOCR)} 
          className="btn-toggle-ocr"
          style={{
            padding: '10px 20px',
            background: usarOCR ? '#f5f5f5' : '#4CAF50',
            color: usarOCR ? '#666' : 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          {usarOCR ? '📝 Preencher Manualmente' : '🤖 Usar OCR (Foto da CNH)'}
        </button>
      </div>

      {usarOCR && (
        <div style={{ marginBottom: '2rem' }}>
          <OCRDocumentUpload
            tipoDocumento="CNH"
            onDataExtracted={handleDadosOCRExtraidos}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        
        <div className="detail-section" style={{ paddingBottom: 0, borderBottom: 'none' }}>
           <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}><Icons.Users /> Dados de Acesso</h3>
           <div className="detail-grid">
              <div className="form-group">
                <label>Nome Completo</label>
                <input 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  required 
                  className="modal-input" 
                />
              </div>
              <div className="form-group">
                <label>Email (Login)</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="modal-input" 
                  placeholder="motorista@empresa.com"
                />
              </div>
              <div className="form-group">
                <label>Senha Provisória</label>
                <input 
                  type="password" 
                  name="senha" 
                  value={formData.senha} 
                  onChange={handleChange} 
                  required 
                  className="modal-input" 
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
           </div>
        </div>

        <div className="detail-section">
           <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}><Icons.Truck /> Dados Profissionais</h3>
           <div className="detail-grid">
              <div className="form-group">
                <label>Número da CNH</label>
                <input 
                  name="cnh" 
                  value={formData.cnh} 
                  onChange={handleChange} 
                  required 
                  className="modal-input" 
                />
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <select name="categoria_cnh" value={formData.categoria_cnh} onChange={handleChange} className="modal-input">
                  <option value="B">B (Carro/Utilitário)</option>
                  <option value="C">C (Caminhão)</option>
                  <option value="D">D (Ônibus/Van)</option>
                  <option value="E">E (Carreta)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Validade CNH</label>
                <input 
                  type="date" 
                  name="validade_cnh" 
                  value={formData.validade_cnh} 
                  onChange={handleChange} 
                  required 
                  className="modal-input" 
                />
              </div>
              
              <div className="form-group">
                <label>Veículo Padrão (Da Frota)</label>
                <select 
                  name="veiculo_padrao" 
                  value={formData.veiculo_padrao} 
                  onChange={handleChange} 
                  className="modal-input"
                >
                  <option value="">Selecione um veículo...</option>
                  {veiculos.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.modelo} - {v.placa}
                    </option>
                  ))}
                </select>
                <small style={{color: '#888', fontSize: '0.75rem'}}>O motorista verá este veículo na área dele.</small>
              </div>
           </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary-full" 
          style={{ maxWidth: '300px', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Motorista'}
        </button>
      </form>
    </div>
  );
}
export default CadastrarMotorista;