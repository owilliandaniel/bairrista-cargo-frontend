# 🚀 TypeScript Migration - Quick Start Guide

**⏱️ Time to Start:** 5 minutes  
**First Task:** Create TypeScript configuration  
**Status:** Ready to begin ✅

---

## ⚡ Immediate Actions (Copy & Paste)

### Step 1: Create `tsconfig.json` (1 minute)

Open PowerShell in project root and run:

```powershell
@'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "allowJs": true,
    "checkJs": false,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
'@ | Out-File -FilePath tsconfig.json -Encoding utf8
```

### Step 2: Create `tsconfig.node.json` (1 minute)

```powershell
@'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.js", "eslint.config.js"]
}
'@ | Out-File -FilePath tsconfig.node.json -Encoding utf8
```

### Step 3: Verify Setup (2 minutes)

```powershell
# Build should succeed
npm run build

# Lint should pass (all errors already fixed)
npm run lint

# TypeScript type check
npx tsc --noEmit
```

Expected output: ✅ No errors

---

## 📋 First File to Convert: `validators.js`

### Why Start Here?
- ✅ Simplest file (pure functions)
- ✅ No dependencies on other files
- ✅ Easy win to build confidence
- ✅ Only ~117 lines

### Steps (15 minutes):

```powershell
# 1. Navigate to utils folder
cd src/utils

# 2. Backup original
Copy-Item validators.js validators.js.backup

# 3. Rename to TypeScript
Rename-Item validators.js validators.ts

# 4. Open in editor and replace entire content with typed version
code validators.ts
```

**Paste this content:**

```typescript
// validators.ts

type ValidatorFunction = (value: string) => boolean

export const validators: Record<string, ValidatorFunction> = {
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  cnpj: (cnpj: string): boolean => {
    cnpj = cnpj.replace(/[^\d]/g, '')
    if (cnpj.length !== 14) return false
    if (/^(\d)\1+$/.test(cnpj)) return false

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

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    return resultado === parseInt(digitos.charAt(1))
  },

  cpf: (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]/g, '')
    if (cpf.length !== 11) return false
    if (/^(\d)\1+$/.test(cpf)) return false

    let soma = 0
    let resto: number

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }

    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(9, 10))) return false

    soma = 0
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }

    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    return resto === parseInt(cpf.substring(10, 11))
  },

  telefone: (telefone: string): boolean => {
    telefone = telefone.replace(/[^\d]/g, '')
    return telefone.length >= 10 && telefone.length <= 11
  },

  cep: (cep: string): boolean => {
    cep = cep.replace(/[^\d]/g, '')
    return cep.length === 8
  },
}

// Export individual validators for tree-shaking
export const validateEmail = validators.email
export const validateCNPJ = validators.cnpj
export const validateCPF = validators.cpf
export const validateTelefone = validators.telefone
export const validateCEP = validators.cep
```

### Test & Commit:

```powershell
# Navigate back to root
cd ../..

# Build
npm run build

# Lint
npm run lint

# Test in browser: Register form should still validate

# Commit
git add src/utils/validators.ts
git commit -m "feat: migrate validators to TypeScript - first conversion"

# Celebrate! 🎉 1 of 26 files complete
```

---

## 📊 Progress Tracker

After completing validators.ts, update your progress:

```
✅ Setup Complete (tsconfig.json, tsconfig.node.json)
✅ validators.ts converted (1/26 files)
⏳ 25 files remaining

Next: Expand types.ts with API interfaces
Then: Convert authService.js
```

---

## 🎯 Daily Goals

**Day 1 (Today):**
- ✅ Create TypeScript config files
- ✅ Convert `validators.js` → `validators.ts`
- Target: Expand `types.ts` with API interfaces

**Day 2-3:**
- Convert core services (authService, api, useRegistration)

**Day 4-10:**
- Follow priority order from TYPESCRIPT_MIGRATION_PLAN.md

---

## 📚 Full Documentation Reference

For detailed instructions, see:
1. **[TYPESCRIPT_MIGRATION_SUMMARY.md](TYPESCRIPT_MIGRATION_SUMMARY.md)** - Overall analysis
2. **[TYPESCRIPT_MIGRATION_PLAN.md](TYPESCRIPT_MIGRATION_PLAN.md)** - Strategic plan
3. **[TYPESCRIPT_IMPLEMENTATION_GUIDE.md](TYPESCRIPT_IMPLEMENTATION_GUIDE.md)** - Step-by-step details

---

## ❓ Common Questions

**Q: Can I skip files and convert out of order?**  
A: No - follow priority order to avoid breaking dependencies.

**Q: What if build fails after conversion?**  
A: Revert the file, review error message, check types.ts for missing interfaces.

**Q: Should I use `any` type?**  
A: Only as last resort, always prefer proper typing.

**Q: Can I convert multiple files at once?**  
A: Not recommended - commit each file individually for easy rollback.

---

## 🚨 Emergency Rollback

If something breaks:

```powershell
# Revert last commit
git reset HEAD~1

# Or restore backup
Copy-Item src/utils/validators.ts.backup src/utils/validators.js
```

---

## ✅ Checklist Before Starting

- ✅ ESLint errors fixed (already done)
- ✅ Git working directory clean
- ✅ Node modules installed
- ✅ Read this quick start guide
- ⏳ Create tsconfig.json (do it now!)
- ⏳ Convert first file

---

**Ready? Start with Step 1 above! 🚀**

Good luck with the migration! Each file converted is progress toward a fully type-safe codebase.
