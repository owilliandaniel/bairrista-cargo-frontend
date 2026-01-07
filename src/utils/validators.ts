// validators.ts - Brazilian validation functions with TypeScript

type ValidatorFunction = (value: string) => boolean
type MaskFunction = (value: string) => string

export const validators: Record<string, ValidatorFunction> = {
  // Email validation
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  // CNPJ validation (Brazilian company ID)
  cnpj: (cnpj: string): boolean => {
    cnpj = cnpj.replace(/[^\d]/g, '')

    if (cnpj.length !== 14) return false

    // Eliminate known invalid CNPJs
    if (/^(\d)\1+$/.test(cnpj)) return false

    // First verification digit validation
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    const digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(0))) return false

    // Second verification digit validation
    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(1))) return false

    return true
  },

  // CPF validation (Brazilian personal ID)
  cpf: (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]/g, '')

    if (cpf.length !== 11) return false

    if (/^(\d)\1+$/.test(cpf)) return false

    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.charAt(9))) return false

    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i)
    }
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.charAt(10))) return false

    return true
  },

  // Phone validation (Brazilian format)
  telefone: (telefone: string): boolean => {
    const cleaned = telefone.replace(/[^\d]/g, '')
    return cleaned.length >= 10 && cleaned.length <= 11
  },

  // Password validation
  senha: (senha: string): boolean => {
    return senha.length >= 6
  },
}

// Formatting masks
export const masks: Record<string, MaskFunction> = {
  cnpj: (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18)
  },

  cpf: (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2')
      .slice(0, 14)
  },

  telefone: (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15)
  },
}

// Export individual validators for tree-shaking
export const validateEmail = validators.email
export const validateCNPJ = validators.cnpj
export const validateCPF = validators.cpf
export const validateTelefone = validators.telefone
export const validateSenha = validators.senha
