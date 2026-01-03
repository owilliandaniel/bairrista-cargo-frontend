import { createContext, useContext, useState, useEffect } from 'react'
import { AuthContextType } from '../types'
import { authService } from '../services/authService'

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = authService.getCurrentUser()
    if (userData) {
      setUser(userData)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setUser({
      user_id: data.user_id,
      email: data.email,
      nome: data.nome,
      tipo_usuario: data.tipo_usuario,
      empresa_id: data.empresa_id,
      nome_fantasia: data.nome_fantasia,
      tipo_atuacao: data.tipo_atuacao,
    })
    return data
  }

  const register = async (data) => {
    return await authService.register(data)
  }

  const validateCode = async (email, codigo) => {
    const data = await authService.validateCode(email, codigo)
    // Se retornar tokens, fazer login automático
    if (data.access && data.refresh) {
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      
      const userData = {
        user_id: data.id_usuario,
        email: email,
        nome: data.nome,
        tipo_usuario: data.tipo_usuario,
      }
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    }
    return data
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    validateCode,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
