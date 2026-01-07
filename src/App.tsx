import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import LandingPage from './pages/LandingPage'
import LoginForm from './pages/auth/LoginForm'
import RegistrarEmpresa from './pages/RegistrarEmpresa'
import RegistrarUsuario from './pages/RegistrarUsuario'
import SimularPreco from './pages/SimularPreco'
import PrivateRoute from './pages/auth/PrivateRoute'
import AreaCliente_Empresa from './pages/clienteEmpresa/AreaCliente_Empresa'
import AreaCliente_Usuario from './pages/clienteUsuario/AreaCliente_Usuario'
import AreaCliente_Motorista from './pages/clienteMotorista/AreaCliente_Motorista'
import BackendStatus from './components/BackendStatus'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/cadastro-empresa" element={<RegistrarEmpresa />} />
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          <Route path="/simular-preco" element={<SimularPreco />} />

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
              <PrivateRoute allowedTypes={['usuario', 'cliente', 'admin']}>
                <AreaCliente_Usuario />
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
        <BackendStatus />
      </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
