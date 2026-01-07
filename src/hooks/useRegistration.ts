// useRegistration.ts - Generic registration hook with TypeScript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegistrationData } from '../types';
import { AxiosError } from 'axios';

interface UseRegistrationReturn<T> {
  loading: boolean;
  analyzing: boolean;
  error: string;
  formData: T;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  setAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const useRegistration = <T extends Record<string, any>>(
  initialFormData: T,
  userType: 'C' | 'E' | 'M',
  validationFunction: (data: T) => string | null
): UseRegistrationReturn<T> => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<T>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validationFunction(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, tipo_usuario: userType } as RegistrationData;
      await register(payload);
      
      // Navigate to validation, assuming success
      alert('Cadastro realizado com sucesso! Verifique seu email para o código de validação.');
      navigate('/validar-codigo', { state: { email: formData.email } });

    } catch (err) {
      let errorMsg = 'Erro ao realizar o cadastro.';
      
      if (err instanceof AxiosError && err.response?.data) {
        const errorDetail = err.response.data.detail;
        
        if (typeof errorDetail === 'object' && errorDetail !== null) {
          const firstErrorKey = Object.keys(errorDetail)[0];
          const firstErrorMsg = errorDetail[firstErrorKey];
          errorMsg = `${firstErrorKey}: ${Array.isArray(firstErrorMsg) ? firstErrorMsg[0] : firstErrorMsg}`;
        } else if (typeof errorDetail === 'string') {
          errorMsg = errorDetail;
        }
      }
      
      console.error('Erro no registro:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    analyzing,
    setAnalyzing,
    error,
    setError,
    handleChange,
    handleSubmit,
  };
};
