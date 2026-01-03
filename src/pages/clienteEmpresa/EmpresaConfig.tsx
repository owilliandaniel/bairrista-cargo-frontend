import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Icons } from '../../components/EmpresaIcons';
import { User } from '../../types';

interface EmpresaConfigProps {
  user: User | null;
}

function EmpresaConfig({ user }: EmpresaConfigProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [tipoAtuacao, setTipoAtuacao] = useState<'M' | 'C' | 'A'>(user?.tipo_atuacao || 'A');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    razao_social: user?.nome || 'Transportadora Exemplo Ltda',
    nome_fantasia: user?.nome_fantasia || 'TransExemplo',
    cnpj: user?.cnpj || '12.345.678/0001-90',
    telefone: user?.telefone || '(11) 99999-0000',
    email: user?.email || 'contato@transexemplo.com.br',
    senha: '',
    nova_senha: '',
    confirmar_senha: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (showPassword && formData.nova_senha !== formData.confirmar_senha) {
        alert("A nova senha e a confirmação não conferem.");
        setLoading(false);
        return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Dados atualizados com sucesso!');
      setShowPassword(false);
      setFormData(prev => ({ ...prev, senha: '', nova_senha: '', confirmar_senha: '' }));
    } catch (error) {
      alert('Erro ao atualizar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-panel fade-in">
      <div className="panel-header">
        <div>
          <h1>Configurações da Conta</h1>
          <p>Gerencie dados cadastrais, acesso e preferências de negócio.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="content-box mb-2">
            <div className="box-header-simple">
                <h3><Icons.Users /> Dados da Empresa</h3>
            </div>
            
            <div className="detail-grid mt-4">
                <div className="form-group">
                    <label>Razão Social</label>
                    <input 
                        name="razao_social" 
                        value={formData.razao_social} 
                        onChange={handleChange} 
                        className="modal-input" 
                    />
                </div>
                <div className="form-group">
                    <label>Nome Fantasia (Nome Público)</label>
                    <input 
                        name="nome_fantasia" 
                        value={formData.nome_fantasia} 
                        onChange={handleChange} 
                        className="modal-input" 
                    />
                </div>
                <div className="form-group">
                    <label>CNPJ (Somente Leitura)</label>
                    <input 
                        name="cnpj" 
                        value={formData.cnpj} 
                        readOnly 
                        className="modal-input" 
                        style={{ background: '#f5f5f5', cursor: 'not-allowed' }} 
                    />
                </div>
                <div className="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input 
                        name="telefone" 
                        value={formData.telefone} 
                        onChange={handleChange} 
                        className="modal-input" 
                    />
                </div>
            </div>
        </div>

        <div className="content-box mb-2">
            <div className="box-header-simple">
                <h3><Icons.Settings /> Segurança e Acesso</h3>
            </div>

            <div className="detail-grid mt-4">
                <div className="form-group">
                    <label>E-mail de Login</label>
                    <input 
                        type="email"
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="modal-input" 
                    />
                </div>

                {!showPassword ? (
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button 
                            type="button" 
                            className="btn-secondary-sm" 
                            onClick={() => setShowPassword(true)}
                            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                        >
                            Alterar Senha
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Nova Senha</label>
                            <input 
                                type="password"
                                name="nova_senha" 
                                value={formData.nova_senha} 
                                onChange={handleChange} 
                                className="modal-input" 
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirmar Nova Senha</label>
                            <input 
                                type="password"
                                name="confirmar_senha" 
                                value={formData.confirmar_senha} 
                                onChange={handleChange} 
                                className="modal-input" 
                            />
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                             <button 
                                type="button" 
                                className="btn-action outline" 
                                onClick={() => setShowPassword(false)}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Cancelar Alteração
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>

        <div className="content-box mb-2">
            <div className="box-header-simple">
                <h3><Icons.Truck /> Ramo de Atuação Principal</h3>
            </div>
            
            <p style={{ color: '#666', marginBottom: '1.5rem', marginTop: '1rem' }}>
                Selecione quais tipos de serviço sua empresa oferece. Isso altera como você aparece nas buscas.
            </p>

            <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div 
                    onClick={() => setTipoAtuacao('M')}
                    className={`selection-card ${tipoAtuacao === 'M' ? 'selected' : ''}`}
                >
                    <div className="card-radio">{tipoAtuacao === 'M' && <div className="radio-inner"></div>}</div>
                    <div className="card-icon"><Icons.Box /></div>
                    <h4>Mudanças</h4>
                    <p>Foco em mudanças residenciais e comerciais.</p>
                </div>

                <div 
                    onClick={() => setTipoAtuacao('C')}
                    className={`selection-card ${tipoAtuacao === 'C' ? 'selected' : ''}`}
                >
                    <div className="card-radio">{tipoAtuacao === 'C' && <div className="radio-inner"></div>}</div>
                    <div className="card-icon"><Icons.Truck /></div>
                    <h4>Cargas e Fretes</h4>
                    <p>Transporte de mercadorias e cargas gerais.</p>
                </div>

                <div 
                    onClick={() => setTipoAtuacao('A')}
                    className={`selection-card ${tipoAtuacao === 'A' ? 'selected' : ''}`}
                >
                    <div className="card-radio">{tipoAtuacao === 'A' && <div className="radio-inner"></div>}</div>
                    <div className="card-icon"><Icons.Map /></div>
                    <h4>Ambos</h4>
                    <p>Aceita tanto mudanças quanto fretes de carga.</p>
                </div>
            </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', paddingBottom: '2rem' }}>
            <button 
                type="submit"
                className="btn-primary-full" 
                style={{ maxWidth: '250px', fontSize: '1.1rem' }}
                disabled={loading}
            >
                {loading ? 'Salvando Alterações...' : 'Salvar Tudo'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default EmpresaConfig;