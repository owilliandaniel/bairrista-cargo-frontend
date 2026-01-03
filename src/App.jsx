import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import PrivateRoute from './pages/auth/PrivateRoute'
import LandingPage from './pages/LandingPage'
import LoginForm from './pages/auth/LoginForm'
import RegistrarEmpresa from './pages/RegistrarEmpresa'
import RegistrarUsuario from './pages/RegistrarUsuario'
import ValidateCodeForm from './pages/auth/ValidateCodeForm'
import AreaCliente_Empresa from './pages/clienteEmpresa/AreaCliente_Empresa'
import AreaUsuario from './pages/clienteUsuario/AreaCliente_Usuario'
import AreaCliente_Motorista from './pages/clienteMotorista/AreaCliente_Motorista'
import './App.css'
import './components/novos-componentes.css'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/cadastro-empresa" element={<RegistrarEmpresa />} />
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          <Route path="/validar-codigo" element={<ValidateCodeForm />} />

          {/* Rotas Privadas com Controle de Acesso (Roles) */}
          <Route
            path="/area-empresa"
            element={
              <PrivateRoute allowedTypes={['empresa', 'admin']}>
                <AreaCliente_Empresa />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/area-usuario"
            element={
              <PrivateRoute allowedTypes={['usuario', 'cliente', 'c']}>
                <AreaUsuario />
              </PrivateRoute>
            }
          />

          <Route
            path="/area-motorista"
            element={
              <PrivateRoute allowedTypes={['motorista', 'empresa']}>
                <AreaCliente_Motorista />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App