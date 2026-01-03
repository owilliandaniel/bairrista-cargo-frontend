import { useRegistration } from '../hooks/useRegistration'
import { validators, masks } from '../utils/validators'
import AuthCard from '../pages/auth/AuthCard'
import AIFileUpload from '../pages/auth/AIFileUpload'

const initialFormData = {
	nome: '',
	email: '',
	senha: '',
	confirmarSenha: '',
	telefone: '',
	cpf: '',
	telefone_celular: '',
	endereco_padrao: '',
};

function validate(formData) {
	if (!formData.nome.trim()) return 'Nome é obrigatório';
	if (!validators.email(formData.email)) return 'Email inválido';
	if (!validators.senha(formData.senha)) return 'A senha deve ter no mínimo 6 caracteres';
	if (formData.senha !== formData.confirmarSenha) return 'As senhas não coincidem';
	if (!validators.cpf(formData.cpf)) return 'CPF inválido';
	return null;
}

function RegistrarUsuario() {
	const {
		formData,
		setFormData,
		loading,
		analyzing,
		setAnalyzing,
		error,
		setError,
		handleSubmit,
	} = useRegistration(initialFormData, 'C', validate);

	const handleDataExtracted = (data) => {
		setFormData(prev => ({
			...prev,
			nome: data.nome || prev.nome,
			cpf: data.cpf ? masks.cpf(data.cpf) : (data.documento ? masks.cpf(data.documento) : prev.cpf),
			email: data.email || prev.email,
			telefone_celular: data.celular ? masks.telefone(data.celular) : (data.telefone ? masks.telefone(data.telefone) : prev.telefone_celular),
			endereco_padrao: data.endereco || prev.endereco_padrao,
		}));
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		let val = value;
		if (name === 'cpf') val = masks.cpf(value);
		if ((name === 'telefone' || name === 'telefone_celular')) val = masks.telefone(value);

		setFormData((prev) => ({ ...prev, [name]: val }));
	};

	return (
		<AuthCard
			title="Registrar Usuário"
			subtitle="Preencha os dados ou use a IA para agilizar"
			error={error}
		>
			<AIFileUpload
				documentType="CNH"
				onDataExtracted={handleDataExtracted}
				uploadId="user-doc-upload"
				labelIcon="🤖📄"
				labelText="Preencher automaticamente com IA"
				labelHint="Tire uma foto da sua CNH ou RG"
				analyzingText="Lendo CNH ou RG..."
				analyzing={analyzing}
				setAnalyzing={setAnalyzing}
				setError={setError}
			/>

			<form onSubmit={handleSubmit} className="auth-form">
				<div className="form-group">
					<label htmlFor="nome">Nome</label>
					<input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
				</div>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input type="email" name="email" value={formData.email} onChange={handleChange} required />
				</div>
				<div className="form-group">
					<label htmlFor="cpf">CPF</label>
					<input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required placeholder="000.000.000-00" />
				</div>
				<div className="form-group">
					<label htmlFor="telefone_celular">Celular</label>
					<input type="text" name="telefone_celular" value={formData.telefone_celular} onChange={handleChange} required />
				</div>
				<div className="form-group">
					<label htmlFor="endereco_padrao">Endereço Padrão</label>
					<input type="text" name="endereco_padrao" value={formData.endereco_padrao} onChange={handleChange} required />
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
					{loading ? 'Registrando...' : 'Registrar'}
				</button>
			</form>
		</AuthCard>
	);
}

export default RegistrarUsuario;