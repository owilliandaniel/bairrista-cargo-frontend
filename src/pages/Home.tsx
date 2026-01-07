// Home.tsx - Landing page with TypeScript
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            BairristaCargo
            <span className="logo-dot"></span>
          </Link>
          <nav className="nav">
            <a href="#services">Serviços</a>
            <a href="#how-it-works">Como Funciona</a>
            <a href="#about">Sobre</a>
            <a href="/login">
              <button className="btn-secondary">Entrar</button>
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Conecte-se com Serviços Confiáveis de Transporte de Veículos</h1>
            <p>O marketplace que conecta quem precisa transportar veículos com transportadores e proprietários de confiança</p>
            <div className="hero-buttons">
              <a href="/dashboard">
                <button className="btn-primary">Buscar Transporte</button>
              </a>
              <a href="/cadastro-empresa">
                <button className="btn-secondary">Seja um Transportador</button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="container">
          <h2>Para Quem Servimos</h2>
          <div className="service-grid">
            <div className="service-card">
              <div className="icon">🚗</div>
              <h3>Precisa de Transporte?</h3>
              <p>Encontre transportadores confiáveis para levar seu veículo com segurança e eficiência</p>
              <button className="btn-link">Começar →</button>
            </div>
            <div className="service-card">
              <div className="icon">🚚</div>
              <h3>Empresas de Transporte</h3>
              <p>Expanda seu negócio conectando-se com clientes que precisam dos seus serviços</p>
              <a href="/cadastro-empresa">
                <button className="btn-link">Cadastrar Empresa →</button>
              </a>
            </div>
            <div className="service-card">
              <div className="icon">👤</div>
              <h3>Transportadores Autônomos</h3>
              <p>Maximize seus ganhos oferecendo seus serviços de transporte em nossa plataforma</p>
              <a href="/cadastro-empresa">
                <button className="btn-link">Registrar Agora →</button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2>Como Funciona</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Publique sua Solicitação</h3>
              <p>Compartilhe suas necessidades de transporte com detalhes sobre o veículo e destino</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Receba Orçamentos</h3>
              <p>Obtenha ofertas competitivas de transportadores e empresas verificadas</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Escolha e Reserve</h3>
              <p>Selecione a melhor opção e confirme sua reserva com segurança</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Rastreie e Receba</h3>
              <p>Monitore seu envio em tempo real até a entrega segura</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>BairristaCargo</h4>
              <p>Conectando necessidades de transporte com soluções confiáveis</p>
            </div>
            <div className="footer-section">
              <h4>Plataforma</h4>
              <a href="#services">Serviços</a>
              <a href="#how-it-works">Como Funciona</a>
              <a href="#pricing">Preços</a>
            </div>
            <div className="footer-section">
              <h4>Suporte</h4>
              <a href="#help">Central de Ajuda</a>
              <a href="#contact">Fale Conosco</a>
              <a href="#faq">Perguntas Frequentes</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 BairristaCargo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
