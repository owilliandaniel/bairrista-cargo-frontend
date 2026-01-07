import React, { useState } from 'react';
import { cadastrarContaBancaria } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import '../../components/AreaCliente.css';

export default function ContasBancarias() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    banco: '',
    agencia: '',
    conta: '',
    tipo_conta: 'CORRENTE',
    titular: '',
    cpf_cnpj: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.banco || !formData.agencia || !formData.conta || !formData.titular || !formData.cpf_cnpj) {
      showToast('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await cadastrarContaBancaria(formData);
      showToast('Conta bancária cadastrada com sucesso!', 'success');
      
      // Reset form
      setFormData({
        banco: '',
        agencia: '',
        conta: '',
        tipo_conta: 'CORRENTE',
        titular: '',
        cpf_cnpj: ''
      });
    } catch (err: any) {
      console.error('Erro ao cadastrar conta:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao cadastrar conta bancária';
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contas-bancarias-section">
      <div className="content-box">
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
          💳 Dados Bancários para Recebimento
        </h3>
        <p style={{ marginBottom: '2rem', color: '#666', fontSize: '0.95rem' }}>
          Cadastre uma conta bancária para receber os pagamentos das mudanças realizadas.
        </p>

        <form onSubmit={handleSubmit} className="form-bank">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="banco">Banco *</label>
              <input 
                type="text" 
                id="banco"
                name="banco"
                placeholder="Ex: 001 - Banco do Brasil"
                value={formData.banco}
                onChange={handleChange}
                required
                disabled={submitting}
              />
              <small style={{ color: '#999' }}>Código e nome do banco</small>
            </div>

            <div className="form-group">
              <label htmlFor="agencia">Agência *</label>
              <input 
                type="text" 
                id="agencia"
                name="agencia"
                placeholder="Ex: 1234"
                value={formData.agencia}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="conta">Número da Conta *</label>
              <input 
                type="text" 
                id="conta"
                name="conta"
                placeholder="Ex: 12345-6"
                value={formData.conta}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipo_conta">Tipo de Conta *</label>
              <select 
                id="tipo_conta"
                name="tipo_conta"
                value={formData.tipo_conta}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="CORRENTE">Conta Corrente</option>
                <option value="POUPANCA">Conta Poupança</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="titular">Titular da Conta *</label>
              <input 
                type="text" 
                id="titular"
                name="titular"
                placeholder="Nome completo do titular"
                value={formData.titular}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf_cnpj">CPF/CNPJ do Titular *</label>
              <input 
                type="text" 
                id="cpf_cnpj"
                name="cpf_cnpj"
                placeholder="CPF ou CNPJ do titular"
                value={formData.cpf_cnpj}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={submitting}
            style={{ marginTop: '1.5rem' }}
          >
            {submitting ? 'Cadastrando...' : '✓ Cadastrar Conta Bancária'}
          </button>
        </form>
      </div>

      <style>{`
        .form-bank {
          width: 100%;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          color: #444;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary-color, #0066cc);
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .form-group small {
          margin-top: 0.25rem;
          font-size: 0.8rem;
        }

        .btn-primary {
          background: var(--primary-color, #0066cc);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--primary-dark, #0052a3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
