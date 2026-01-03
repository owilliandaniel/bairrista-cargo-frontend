import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { validators } from '../../utils/validators'
import './AuthForms.css'

function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validações básicas
    if (!validators.email(formData.email)) {
      setError('Por favor, insira um email válido.')
      return
    }

    if (!formData.senha) {
      setError('A senha é obrigatória.')
      return
    }

    setLoading(true)

    try {
      const res = await login(formData.email, formData.senha)
      
      // Roteamento baseado no Tipo de Usuário
      // C = Cliente/Usuário Comum
      // E = Empresa de Transporte
      // M = Motorista Autônomo (Assumindo 'M' para o futuro)
      
      switch (res?.tipo_usuario) {
        case 'C':
          navigate('/area-usuario')
          break
        case 'E':
          navigate('/area-empresa')
          break
        case 'M':
          // Caso tenha uma área específica para motorista no futuro
          navigate('/area-empresa') 
          break
        default:
          // Fallback seguro
          navigate('/')
      }

    } catch (err) {
      console.error(err)
      let errorMsg = 'Email ou senha incorretos.';
      
      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      }

      // Tratamento específico para contas não ativadas
      const msgLower = errorMsg.toLowerCase();
      if (msgLower.includes('inactive') || msgLower.includes('não validada') || msgLower.includes('inativo')) {
        errorMsg = 'Sua conta ainda não foi validada.';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 className="brand-title" style={{ color: '#333', marginBottom: '0.5rem' }}>BairristaCargo<span style={{ color: '#e53935' }}>.</span></h2>
          </Link>
          <p>Bem-vindo de volta! Acesse sua conta.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            {error.includes('não foi validada') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                <Link to="/validar-codigo" style={{ fontWeight: 'bold' }}>
                  Clique aqui para validar seu código
                </Link>
              </div>
            )}
          </div>
        )}

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
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="senha" style={{ marginBottom: 0 }}>Senha</label>
              <Link to="/esqueci-senha" style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'none' }}>
                Esqueceu a senha?
              </Link>
            </div>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-full" 
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>

          <div className="auth-footer" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <p style={{ marginBottom: '0.5rem' }}>Ainda não tem conta?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.9rem' }}>
              <Link to="/registrar-usuario" style={{ fontWeight: '600' }}>
                Criar conta Usuário
              </Link>
              <span style={{ color: '#ccc' }}>|</span>
              <Link to="/cadastro-empresa" style={{ fontWeight: '600' }}>
                Sou Transportador
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm