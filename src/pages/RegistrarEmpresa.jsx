import { useRegistration } from '../hooks/useRegistration'
import { validators, masks } from '../utils/validators'
import AuthCard from '../pages/auth/AuthCard'
import AIFileUpload from '../pages/auth/AIFileUpload'

const initialFormData = {
	email: '',
	senha: '',
	confirmarSenha: '',
	razao_social: '',
	nome_fantasia: '',
	cnpj: '',
	telefone_comercial: '',
	tipo_atuacao: 'M',
};

function validate(formData) {
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

	const handleDataExtracted = (data) => {
		setFormData(prev => ({
			...prev,
			razao_social: data.razao_social || data.nome || prev.razao_social,
			nome_fantasia: data.nome_fantasia || data.nome_comercial || prev.nome_fantasia,
			cnpj: data.cnpj ? masks.cnpj(data.cnpj) : (data.documento ? masks.cnpj(data.documento) : prev.cnpj),
			email: data.email || prev.email,
			telefone_comercial: data.telefone ? masks.telefone(data.telefone) : prev.telefone_comercial,
		}));
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		let processedValue = value

		if (name === 'cnpj') {
			processedValue = masks.cnpj(value)
		} else if (name === 'telefone_comercial') {
			processedValue = masks.telefone(value)
		}

		setFormData((prev) => ({ ...prev, [name]: processedValue }))
	}

	return (
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
	);
}

export default RegistrarEmpresa