import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css'; // Certifique-se que o CSS global está importado

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // Lógica de Scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lógica de clicar fora do menu (Mantida do seu original)
  useEffect(() => {
    function handleClickOutside(event) {
      const menu = document.getElementById('cadastre-se-menu');
      const btn = document.getElementById('cadastre-se-btn');
      if (menu && btn && menu.style.display === 'block') {
        if (!menu.contains(event.target) && !btn.contains(event.target)) {
          menu.style.display = 'none';
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header" style={{
      transform: scrollY > 100 ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'transform 0.3s ease',
      display: 'flex',           // Garante alinhamento
      justifyContent: 'center'   // Centraliza o container
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%' 
      }}>
        
        {/* LOGO */}
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#fff' }}>BairristaCargo</span>
          <span className="logo-dot"></span>
        </Link>

        {/* NAV - AQUI ESTÁ A CORREÇÃO PRINCIPAL */}
        <nav className="nav" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '30px' 
        }}>
          
          {/* Grupo de Links da Esquerda */}
          <div style={{ display: 'flex', gap: '25px' }}>
            <a href="#services" style={{ color: '#fff', textDecoration: 'none' }}>Serviços</a>
            <a href="#how-it-works" style={{ color: '#fff', textDecoration: 'none' }}>Como Funciona</a>
            <a href="#about" style={{ color: '#fff', textDecoration: 'none' }}>Sobre</a>
          </div>

          {/* Grupo de Botões da Direita */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {!user ? (
              <>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button
                    style={{ 
                      padding: '0.6rem 1.5rem',
                      fontSize: '0.85rem',
                      borderRadius: '50px',
                      background: 'transparent',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                  >Entrar</button>
                </Link>
                
                <div style={{ display: 'inline-block', position: 'relative' }}>
                  <button
                    id="cadastre-se-btn"
                    style={{ 
                      padding: '0.6rem 1.5rem',
                      fontSize: '0.85rem',
                      borderRadius: '50px',
                      background: '#fff',
                      color: '#000',
                      border: 'none',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}
                    onClick={() => {
                      const menu = document.getElementById('cadastre-se-menu');
                      if (menu) menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                    onMouseOut={e => e.currentTarget.style.background = '#fff'}
                  >Cadastre-se</button>
                  
                  {/* Dropdown Menu (Mantido original) */}
                  <div
                    id="cadastre-se-menu"
                    style={{
                      display: 'none',
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      background: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      borderRadius: '0.5rem',
                      zIndex: 10,
                      minWidth: '320px',
                      padding: '1.2rem 0',
                      border: 'none'
                    }}
                  >
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', width: '100%', padding: '1rem 2rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '0.7rem', transition: 'background 0.2s' }}
                        onClick={() => { document.getElementById('cadastre-se-menu').style.display = 'none'; navigate('/cadastro-empresa'); }}
                        onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                      >
                        <span style={{ fontSize: '2rem', color: '#3f51b5', marginTop: '2px' }}>🏢</span>
                        <span>
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#222' }}>Empresa de Transporte</span><br />
                          <span style={{ color: '#888', fontSize: '0.95rem' }}>Cadastre sua transportadora</span>
                        </span>
                      </button>
                      <button
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', width: '100%', padding: '1rem 2rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '0.7rem', transition: 'background 0.2s' }}
                        onClick={() => { document.getElementById('cadastre-se-menu').style.display = 'none'; navigate('/registrar-usuario'); }}
                        onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                      >
                        <span style={{ fontSize: '2rem', color: '#2196f3', marginTop: '2px' }}>👤</span>
                        <span>
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#222' }}>Usuário</span><br />
                          <span style={{ color: '#888', fontSize: '0.95rem' }}>Contrate um serviço</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/area-empresa" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ borderRadius: '0.5rem' }}>Área do Cliente</button>
                </Link>
                <button className="btn-secondary" onClick={handleLogout}>
                  Sair
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;