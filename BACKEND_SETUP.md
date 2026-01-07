# 🔧 BACKEND SETUP - Bairrista Cargo

## ✅ Status Atual
**Backend está rodando em:** `https://untragic-afterwards-caroline.ngrok-free.dev/`

## 🧪 Verificação Imediata

### **1. Teste no Frontend (Mais Fácil)**
- Inicie o frontend: `npm run dev`
- Procure o **ícone de status** no canto inferior direito da tela
- Deve mostrar: 🟢 Backend acessível

### **2. Teste Manual**
```bash
# Teste básico
curl -I https://untragic-afterwards-caroline.ngrok-free.dev/

# Teste da API
curl -I https://untragic-afterwards-caroline.ngrok-free.dev/api/v1/
```

## 🚨 Se Ainda Não Funcionar

### **Possíveis Problemas:**
1. **Ngrok expirou** - O tunnel gratuito expira após 8 horas
2. **Backend parado** - Verifique se o servidor Django ainda está rodando
3. **CORS não configurado** - Backend precisa permitir requests do frontend

### **Soluções:**

#### **1. Reiniciar Ngrok**
```bash
# No terminal onde o backend está rodando:
ngrok http 8000

# Copie a nova URL e atualize o .env
```

#### **2. Verificar Backend**
```bash
# Verifique se o servidor Django está rodando
ps aux | grep python  # Linux/Mac
# ou
tasklist | findstr python  # Windows

# Se não estiver rodando, reinicie:
python manage.py runserver 8000
```

#### **3. Configurar CORS (se necessário)**
No Django settings.py, certifique-se de ter:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Ou para desenvolvimento:
CORS_ALLOW_ALL_ORIGINS = True
```

## 📋 Checklist de Verificação

- [ ] Backend Django está rodando (`python manage.py runserver 8000`)
- [ ] Ngrok está ativo (`ngrok http 8000`)
- [ ] URL no `.env` está atualizada com a URL do ngrok
- [ ] CORS está configurado no backend
- [ ] Firewall permite conexões na porta 8000

## 🚀 Teste do Frontend

Após confirmar que o backend está funcionando:

```bash
# Inicie o frontend
npm run dev

# Teste o registro em http://localhost:3000
```

---
**Data:** Janeiro 2026
**Status:** Backend configurado para ngrok</content>
<parameter name="filePath">c:\Users\User\Documents\Codes\BairristaCargo\frontend\BACKEND_SETUP.md