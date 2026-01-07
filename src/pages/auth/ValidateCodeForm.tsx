// ValidateCodeForm.tsx - Email validation code form with TypeScript
import { useState } from 'react';
import { authService } from '../../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AuthForms.css';
import { AxiosError } from 'axios';

interface LocationState {
  email?: string;
}

function ValidateCodeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { validateCode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: (location.state as LocationState)?.email || '',
    codigo: '',
  });
  const [codigoRecebido, setCodigoRecebido] = useState('');

  const handleSolicitarCodigo = async () => {
    setError('');
    setCodigoRecebido('');
    try {
      const codigo = await (authService as any).solicitarCodigoValidacao(formData.email);
      setCodigoRecebido(codigo);
    } catch {
      setError('Erro ao solicitar código');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Limitar código a 6 dígitos
    if (name === 'codigo' && value.length > 6) return;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.codigo.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    setLoading(true);

    try {
      const response = await validateCode(formData.email, formData.codigo);
      setSuccess('Conta ativada com sucesso! Redirecionando...');
      
      setTimeout(() => {
        // Redirecionar baseado no tipo de usuário
        if (response.tipo_usuario === 'E') {
          navigate('/area-empresa');
        } else {
          navigate('/area-usuario');
        }
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof AxiosError
        ? err.response?.data?.erro || err.response?.data?.detail || 'Código inválido ou expirado'
        : 'Código inválido ou expirado';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Validar Código</h2>
          <p>Digite o código de 6 dígitos enviado para seu email</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigo">Código de Validação</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              placeholder="000000"
              maxLength={6}
              className="code-input"
            />
            <button type="button" className="btn-secondary" onClick={handleSolicitarCodigo} style={{marginTop: '8px'}}>
              Solicitar código para teste
            </button>
            {codigoRecebido && (
              <div style={{marginTop: '8px', color: 'green'}}>
                Código recebido: <strong>{codigoRecebido}</strong>
              </div>
            )}
            <small>Verifique o código no console do backend ou solicite para teste</small>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Validando...' : 'Validar Código'}
          </button>

          <div className="auth-footer">
            <p>
              Não recebeu o código? <a href="/cadastro-empresa">Cadastrar novamente</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ValidateCodeForm;
