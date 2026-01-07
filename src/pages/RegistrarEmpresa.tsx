// RegistrarEmpresa.tsx - Company registration with TypeScript
import { useRegistration } from '../hooks/useRegistration';
import { validators, masks } from '../utils/validators';
import { Link } from 'react-router-dom';
import AuthCard from '../pages/auth/AuthCard';
import AIFileUpload from '../pages/auth/AIFileUpload';

interface CompanyFormData {
  email: string;
  senha: string;
  confirmarSenha: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  telefone_comercial: string;
  tipo_atuacao: 'M' | 'C' | 'MC';
}

const initialFormData: CompanyFormData = {
  email: '',
  senha: '',
  confirmarSenha: '',
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  telefone_comercial: '',
  tipo_atuacao: 'M',
};

function validate(formData: CompanyFormData): string | null {
  if (!validators.email(formData.email)) return 'Email inválido';
  if (!validators.senha(formData.senha)) return 'A senha deve ter no mínimo 6 caracteres';
  if (formData.senha !== formData.confirmarSenha) return 'As senhas não coincidem';
  if (!validators.cnpj(formData.cnpj)) return 'CNPJ inválido';
  if (!validators.telefone(formData.telefone_comercial)) return 'Telefone inválido';
  if (!formData.razao_social.trim()) return 'Razão Social é obrigatória';
  if (!formData.nome_fantasia.trim()) return 'Nome Fantasia é obrigatório';
  return null;
}

function RegistrarEmpresa() {
  const {
    formData,
    setFormData,
    loading,
    analyzing,
    setAnalyzing,
    error,
    setError,
    handleSubmit,
  } = useRegistration(initialFormData, 'E', validate);

  const handleDataExtracted = (data: any) => {
    setFormData(prev => ({
      ...prev,
      razao_social: data.razao_social || data.nome || prev.razao_social,
      nome_fantasia: data.nome_fantasia || data.nome_comercial || prev.nome_fantasia,
      cnpj: data.cnpj ? masks.cnpj(data.cnpj) : (data.documento ? masks.cnpj(data.documento) : prev.cnpj),
      email: data.email || prev.email,
      telefone_comercial: data.telefone ? masks.telefone(data.telefone) : prev.telefone_comercial,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'cnpj') {
      processedValue = masks.cnpj(value);
    } else if (name === 'telefone_comercial') {
      processedValue = masks.telefone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  return (
    <>
      {/* Back to Home Navigation Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderBottom: '1px solid #eee',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <Link 
          to="/" 
          style={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#666',
            fontSize: '0.95rem',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#333'}
          onMouseOut={(e) => e.currentTarget.style.color = '#666'}
        >
          <span style={{ fontSize: '1.2rem' }}>←</span>
          <span>Voltar para o site</span>
        </Link>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>
              BairristaCargo<span style={{ color: '#e53935' }}>.</span>
            </span>
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '5rem' }}>
        <AuthCard
          title="Cadastro de Empresa de Transporte"
          subtitle="Preencha os dados ou faça upload do Cartão CNPJ/Contrato Social"
          error={error}
        >
          <AIFileUpload
            documentType="CNPJ"
            onDataExtracted={handleDataExtracted}
            uploadId="doc-upload"
            labelIcon="🤖📄"
            labelText="Toque para preencher automaticamente"
            labelHint="Envie uma foto do Cartão CNPJ ou Contrato Social"
            analyzing={analyzing}
            setAnalyzing={setAnalyzing}
            setError={setError}
          />

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="razao_social">Razão Social</label>
              <input type="text" name="razao_social" value={formData.razao_social} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="nome_fantasia">Nome Fantasia</label>
              <input type="text" name="nome_fantasia" value={formData.nome_fantasia} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required placeholder="00.000.000/0000-00" />
            </div>
            <div className="form-group">
              <label htmlFor="telefone_comercial">Telefone Comercial</label>
              <input type="text" name="telefone_comercial" value={formData.telefone_comercial} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading || analyzing}>
              {loading ? 'Registrando...' : 'Registrar Empresa'}
            </button>
          </form>
        </AuthCard>
      </div>
    </>
  );
}

export default RegistrarEmpresa;
