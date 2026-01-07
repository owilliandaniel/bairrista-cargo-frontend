import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SimularPreco from './SimularPreco'
import Header from '../components/Header' 
import landingPageImg from '../assets/landingPage_img.jpg';
import '../App.css'

function LandingPage() {
  // Estados
  const [showSearch, setShowSearch] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Efeito para capturar o scroll (Usado para o efeito Parallax do Hero)
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      {/* O Header refatorado entra aqui, substituindo todo o código antigo de navegação */}
      <Header />

      {/* Hero Section - Rejouice inspired */}
      <section style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: '12vh',
        background: '#0a0a0a',
        color: '#fff',
        position: 'relative',
        overflow: 'visible'
      }}>
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.4,
          zIndex: 0
        }}>
          <img 
            src={landingPageImg}
            alt="BairristaCargo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(30%)'
            }}
          />
        </div>

        <div className="container" style={{ 
          position: 'relative', 
          zIndex: 1, 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 5%'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(3rem, 10vw, 8rem)', 
            fontWeight: '400',
            lineHeight: '0.95',
            marginBottom: '0',
            letterSpacing: '-0.04em',
            maxWidth: '1200px'
          }}>
           {/* Título vazio mantido conforme original */}
          </h1>

          <div>
            <p style={{ 
              fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', 
              color: '#fff',
              maxWidth: '600px',
              marginBottom: '2.5rem',
              fontWeight: '400',
              lineHeight: '1.5',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              fontStyle: 'italic',
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Conectando quem precisa transportar com os melhores transportadores do Brasil.
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              flexWrap: 'wrap', 
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translateY(${scrollY * 0.15}px)`,
              transition: 'transform 0.1s ease-out'
            }}>
            {!showSearch ? (
              <>
                <button 
                  onClick={() => setShowSearch(true)}
                  style={{
                    padding: '1.2rem 2.5rem',
                    fontSize: '0.95rem',
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
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ↗ Simular Mudança ↗
                </button>
                
                <Link to="/cadastro-empresa" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '1.2rem 2.5rem',
                    fontSize: '0.95rem',
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
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    Seja Transportador
                  </button>
                </Link>
              </>
            ) : (
              <SimularPreco onClose={() => setShowSearch(false)} />
            )}
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '3rem',
            left: '5%',
            display: 'flex',
            gap: '3rem',
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {/* Conteúdo do rodapé do Hero mantido vazio conforme original */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        background: '#fff',
        padding: '8rem 5%',
        color: '#000'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 5rem)', 
            fontWeight: '400',
            lineHeight: '1.1',
            marginBottom: '5rem',
            letterSpacing: '-0.03em',
            maxWidth: '900px'
          }}>
            Logística que conecta.
            <br />
            <span style={{ fontStyle: 'italic', fontWeight: '300', color: '#666' }}>Transporte que transforma.</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '4rem',
            marginTop: '5rem'
          }}>
            <div>
              <div style={{ fontSize: '4rem', fontWeight: '300', marginBottom: '1rem' }}>500+</div>
              <div style={{ fontSize: '1rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Transportes realizados</div>
            </div>
            <div>
              <div style={{ fontSize: '4rem', fontWeight: '300', marginBottom: '1rem' }}>98%</div>
              <div style={{ fontSize: '1rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Taxa de satisfação</div>
            </div>
            <div>
              <div style={{ fontSize: '4rem', fontWeight: '300', marginBottom: '1rem' }}>150+</div>
              <div style={{ fontSize: '1rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Transportadores verificados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ 
        background: '#0a0a0a',
        padding: '8rem 5%',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
            fontWeight: '400',
            lineHeight: '1.2',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Nossa abordagem.
          </h2>
          
          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '5rem',
            maxWidth: '600px'
          }}>
            Conectamos diferentes necessidades com soluções sob medida.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem'
          }}>
            <div style={{
              padding: '2.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🚗</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '400', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Precisa de Transporte?</h3>
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                lineHeight: '1.6',
                marginBottom: '1.5rem',
                fontSize: '1rem'
              }}>
                Simule o preço da sua mudança e encontre transportadores confiáveis.
              </p>
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setShowSearch(true);
                }}
                style={{
                  fontSize: '0.9rem',
                  color: '#fff',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '500',
                  padding: '0',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                ↗ Começar ↗
              </button>
            </div>

            <div style={{
              padding: '2.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🚚</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '400', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Empresas de Transporte</h3>
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                lineHeight: '1.6',
                marginBottom: '1.5rem',
                fontSize: '1rem'
              }}>
                Expanda seu negócio conectando-se com clientes que precisam dos seus serviços.
              </p>
              <Link to="/cadastro-empresa" style={{ textDecoration: 'none' }}>
                <button style={{
                  fontSize: '0.9rem',
                  color: '#fff',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '500',
                  padding: '0',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  ↗ Cadastrar Empresa ↗
                </button>
              </Link>
            </div>

            <div style={{
              padding: '2.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>👤</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '400', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Transportadores Autônomos</h3>
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                lineHeight: '1.6',
                marginBottom: '1.5rem',
                fontSize: '1rem'
              }}>
                Maximize seus ganhos oferecendo seus serviços de transporte em nossa plataforma.
              </p>
              <Link to="/cadastro-empresa" style={{ textDecoration: 'none' }}>
                <button style={{
                  fontSize: '0.9rem',
                  color: '#fff',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '500',
                  padding: '0',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  ↗ Registrar Agora ↗
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" style={{ 
        background: '#fff',
        padding: '8rem 5%',
        color: '#000'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 5rem)', 
            fontWeight: '400',
            lineHeight: '1.1',
            marginBottom: '5rem',
            letterSpacing: '-0.03em',
            maxWidth: '900px'
          }}>
            Como funciona.
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '4rem'
          }}>
            {[
              {
                number: '01',
                title: 'Publique sua Solicitação',
                desc: 'Compartilhe suas necessidades de transporte com detalhes sobre o veículo e destino.'
              },
              {
                number: '02',
                title: 'Receba Orçamentos',
                desc: 'Obtenha ofertas competitivas de transportadores e empresas verificadas.'
              },
              {
                number: '03',
                title: 'Escolha e Reserve',
                desc: 'Selecione a melhor opção e confirme sua reserva com segurança.'
              },
              {
                number: '04',
                title: 'Rastreie e Receba',
                desc: 'Monitore seu envio em tempo real até a entrega segura.'
              }
            ].map((step, index) => (
              <div key={index}>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: '300', 
                  color: '#ddd',
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.02em'
                }}>
                  {step.number}
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '400', 
                  marginBottom: '1rem',
                  letterSpacing: '-0.01em'
                }}>{step.title}</h3>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.7',
                  fontSize: '1.05rem'
                }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" style={{
        background: '#0a0a0a',
        color: '#fff',
        padding: '5rem 5% 3rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            <div>
              <h4 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '400', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>BairristaCargo</h4>
              <p style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>
              </p>
            </div>
            <div>
              <h4 style={{ 
                fontSize: '0.85rem', 
                fontWeight: '500', 
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'rgba(255,255,255,0.5)'
              }}>Plataforma</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <a href="#services" style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  transition: 'color 0.3s'
                }}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >Serviços</a>
                <a href="#how-it-works" style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  transition: 'color 0.3s'
                }}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >Como Funciona</a>
              </div>
            </div>
            <div>
              <h4 style={{ 
                fontSize: '0.85rem', 
                fontWeight: '500', 
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'rgba(255,255,255,0.5)'
              }}>Suporte</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <a href="#help" style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  transition: 'color 0.3s'
                }}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >Central de Ajuda</a>
                <a href="#contact" style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  transition: 'color 0.3s'
                }}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >Fale Conosco</a>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '2rem',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center'
          }}>
            © 2025 BairristaCargo. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage