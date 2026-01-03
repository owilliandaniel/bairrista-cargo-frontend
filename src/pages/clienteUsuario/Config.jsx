import React, { useState } from 'react'
import '../../components/AreaCliente.css'

function Config({ user, formData, setFormData }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setIsEditingProfile(false)
  }

  return (
    <div className="fade-in content-box" style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Meus Dados</h2>
        <button 
          className={isEditingProfile ? "btn-secondary" : "btn-primary"}
          onClick={() => !isEditingProfile ? setIsEditingProfile(true) : setIsEditingProfile(false)}
        >
          {isEditingProfile ? 'Cancelar' : 'Editar Dados'}
        </button>
      </div>

      <form onSubmit={handleSaveProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Nome Completo</label>
          <input 
            type="text" 
            value={formData.nome} 
            disabled={!isEditingProfile}
            onChange={e => setFormData({...formData, nome: e.target.value})}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', background: isEditingProfile ? '#fff' : '#f9f9f9' }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>E-mail</label>
          <input 
            type="email" 
            value={formData.email} 
            disabled={true}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', background: '#eee', cursor: 'not-allowed' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>CPF</label>
          <input 
            type="text" 
            value={formData.cpf} 
            disabled={!isEditingProfile}
            onChange={e => setFormData({...formData, cpf: e.target.value})}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', background: isEditingProfile ? '#fff' : '#f9f9f9' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Telefone</label>
          <input 
            type="text" 
            value={formData.telefone} 
            disabled={!isEditingProfile}
            onChange={e => setFormData({...formData, telefone: e.target.value})}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', background: isEditingProfile ? '#fff' : '#f9f9f9' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
          <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Endereço Padrão</label>
          <input 
            type="text" 
            value={formData.endereco} 
            disabled={!isEditingProfile}
            onChange={e => setFormData({...formData, endereco: e.target.value})}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', background: isEditingProfile ? '#fff' : '#f9f9f9' }}
          />
        </div>

        {isEditingProfile && (
          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary">Salvar Alterações</button>
          </div>
        )}
      </form>
    </div>
  )
}

export default Config
