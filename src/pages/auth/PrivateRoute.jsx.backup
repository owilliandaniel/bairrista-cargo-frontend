import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function PrivateRoute({ children, allowedTypes }) {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#666' }}>
        Carregando...
      </div>
    )
  }

  // 1. Se não estiver logado, manda pro login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // 2. Normalização do Tipo de Usuário (Role)
  const rawRole = user.tipo_usuario || user.tipo || user.role || '';
  let userRole = rawRole.toString().toLowerCase();

  // Mapeia códigos de uma letra para os nomes completos usados nas rotas
  const roleMap = {
    'e': 'empresa',
    'm': 'motorista',
    'c': 'usuario', 
    'u': 'usuario',
    'a': 'admin'
  };

  // Se o userRole for apenas uma letra, traduzimos ele
  if (roleMap[userRole]) {
    userRole = roleMap[userRole];
  }
  // ---------------------------------------

  // Se a rota exige permissão específica e o usuário não tem
  if (allowedTypes && allowedTypes.length > 0) {
    
    // Verifica se algum dos tipos permitidos bate com o role do usuário
    const temPermissao = allowedTypes.some(type => type.toLowerCase() === userRole);

    if (!temPermissao) {
      console.warn(`Acesso negado. Usuário (detectado): ${userRole}, Rota exige: ${allowedTypes}`);

      // Redirecionamento inteligente baseado no tipo real do usuário
      if (userRole === 'empresa') {
        if (location.pathname !== '/area-empresa') return <Navigate to="/area-empresa" replace />;
      }
      
      if (userRole === 'motorista') {
         if (location.pathname !== '/area-motorista') return <Navigate to="/area-motorista" replace />;
      }
      
      if (userRole === 'usuario' || userRole === 'cliente') {
        if (location.pathname !== '/area-usuario') return <Navigate to="/area-usuario" replace />;
      }

      // Se estiver na própria área e ainda assim der erro (loop), manda pra home
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default PrivateRoute