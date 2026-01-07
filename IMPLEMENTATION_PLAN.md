# 🚀 BairristaCargo Frontend - Implementation Plan
**Status:** Based on Mapa_API_Bairrista.md (Authoritative Backend Documentation)  
**Date:** January 7, 2026

---

## 📊 Current Status Analysis

### ✅ What's Already Implemented

#### API Service Layer (`src/services/api.js`)
- ✅ Authentication endpoints (login, register, validate)
- ✅ Cliente endpoints (profile, mudancas, evaluation)
- ✅ Empresa endpoints (profile, frota, marketplace)
- ✅ Motorista endpoints (cadastro, PDS workflow)
- ✅ Pagamentos endpoints (bank accounts, webhook, payment processing)
- ✅ Fiscal endpoints (notas fiscais)
- ✅ IA endpoints (OCR, image analysis)
- ✅ Notifications endpoint
- ✅ Token refresh interceptor

#### Customer Dashboard (`src/pages/clienteUsuario/`)
- ✅ `AreaCliente_Usuario.jsx` - Main dashboard with navigation
- ✅ `Solicitacoes.jsx` - View mudanças (uses `getMinhasMudancas()`)
- ✅ `PropostasRecebidas.jsx` - View proposals & payment flow
- ✅ `Dashboard.jsx` - Overview stats
- ✅ `Pagamentos.jsx` - Payment history
- ✅ `Config.jsx` - Profile settings
- ✅ `AvaliacaoMudanca.jsx` - Service evaluation

#### Company Dashboard (`src/pages/clienteEmpresa/`)
- ✅ `AreaCliente_Empresa.tsx` - Main dashboard with section navigation
- ✅ `Marketplace.tsx` - View opportunities (uses `getMudancasDisponiveis()`)
- ✅ `VisualizarOfertas.tsx` - Proposal submission modal
- ✅ `EmpresaOverview.tsx` - Company stats
- ✅ `EmpresaOperacional.tsx` - Operations management
- ✅ `EmpresaFinanceiro.tsx` - Financial overview
- ✅ `EmpresaConfig.tsx` - Company settings
- ✅ `CadastrarMotorista.tsx` - Driver registration
- ✅ `CadastrarVeiculo.tsx` - Vehicle registration
- ✅ `CadastrarOferta.tsx` - Create offers

#### Driver Dashboard (`src/pages/clienteMotorista/`)
- ✅ `AreaCliente_Motorista.jsx` - Main dashboard
- ✅ `WorkflowMudanca.jsx` - Start/finish service workflow

---

## ❌ Missing Implementations

### 🔴 Critical Missing Features

#### 1. **API Endpoint Misalignment**
**Problem:** Some components use wrong/outdated endpoints

**Marketplace.tsx (Line 22)**
```typescript
// ❌ WRONG: Uses old endpoint
const dados = await getMudancasDisponiveis(); // calls 'mudancas/ofertas/'

// ✅ CORRECT: Should use official endpoint
const dados = await getOfertas(); // calls 'mudancas/empresa/marketplace/'
```

**api.js Functions to Update:**
- `getMudancasDisponiveis()` → Should be replaced with `getOfertas()`
- `getFuncionarios()` → Currently calls wrong endpoint for employee list

#### 2. **Missing API Functions**

Need to add to `api.js`:
```javascript
// GET mudancas sent by company (empresa view)
export const getMudancasEnviadas = async () => {
  const response = await api.get('mudancas/empresa/contratos/')
  return response.data
}

// GET proposals sent by company
export const getPropostasEnviadas = async () => {
  const response = await api.get('mudancas/propostas/')
  return response.data
}

// GET mudancas assigned to driver
export const getMudancasMotorista = async () => {
  const response = await api.get('mudancas/operacional/pds/')
  return response.data
}

// PATCH update mudanca status
export const updateMudancaStatus = async (mudancaId, status) => {
  const response = await api.patch(`mudancas/cliente/mudancas/${mudancaId}/`, { status })
  return response.data
}
```

#### 3. **Missing UI Components**

**NotificationCenter.jsx** (NEW)
- Display notifications from `GET /api/v1/usuarios/notificacoes/`
- Mark as read functionality
- Real-time updates (optional)

**ContasBancarias.jsx** (NEW)
- Bank account registration form for companies
- List registered accounts
- Uses `POST /api/v1/pagamentos/contas-bancarias/`

**NotasFiscais.jsx** (NEW)
- List invoices from `GET /api/v1/fiscal/notas-fiscais/`
- Download PDF functionality
- Integrate into `EmpresaFinanceiro.tsx`

**ProposalStatusTracker.jsx** (NEW)
- Track proposal lifecycle (sent → accepted/rejected → paid)
- Visual timeline component
- Integrate into company dashboard

#### 4. **Incomplete Workflows**

**Customer Journey (Cliente)**
```
✅ Register → ✅ Create Mudança → ✅ View Proposals → ✅ Payment → ✅ Evaluation
Status: COMPLETE ✅
```

**Company Journey (Empresa)**
```
✅ View Marketplace → ✅ Send Proposal → ⚠️ Track Proposal Status → ✅ Allocate Driver
Status: NEEDS TRACKING UI ⚠️
```

**Driver Journey (Motorista)**
```
✅ View Assigned Jobs → ✅ Start Service → ✅ Finish Service
Status: COMPLETE ✅
Note: Currently uses MOCK data, needs real API integration
```

---

## 🎯 Implementation Priority

### Phase 1: Critical Fixes (HIGH PRIORITY)
**Goal:** Make existing features work correctly with backend

1. ✅ **Fix Marketplace Endpoint** (`Marketplace.tsx`)
   - Replace `getMudancasDisponiveis()` with `getOfertas()`
   - Ensure data mapping handles response correctly

2. ✅ **Fix API Functions** (`api.js`)
   - Remove/deprecate `getMudancasDisponiveis()`
   - Add missing functions listed above

3. ✅ **Fix Driver Dashboard** (`AreaCliente_Motorista.jsx`)
   - Remove MOCK data
   - Integrate `getMudancasMotorista()` for real jobs

### Phase 2: Missing Features (MEDIUM PRIORITY)
**Goal:** Add components for uncovered endpoints

4. ✅ **Create NotificationCenter** 
   - New component in `src/components/NotificationCenter.jsx`
   - Add to all dashboards (usuario, empresa, motorista)

5. ✅ **Create ContasBancarias Component**
   - Add to `EmpresaFinanceiro.tsx`
   - Bank account registration form

6. ✅ **Create NotasFiscais Component**
   - Add to `EmpresaFinanceiro.tsx`
   - Invoice listing & download

### Phase 3: Enhanced UX (LOW PRIORITY)
**Goal:** Improve user experience

7. ✅ **Add Proposal Status Tracking**
   - Visual timeline in company dashboard
   - Show proposal lifecycle stages

8. ✅ **Add Real-time Notifications**
   - WebSocket integration (if backend supports)
   - Toast notifications for status changes

9. ✅ **Add Error Boundary Components**
   - Catch and display errors gracefully
   - Better error messages for users

---

## 🔧 Detailed Implementation Steps

### Step 1: Fix Marketplace.tsx

**File:** `src/pages/clienteEmpresa/Marketplace.tsx`

**Change:**
```typescript
// OLD
import { getMudancasDisponiveis } from '../../services/api';

const dados: any = await getMudancasDisponiveis();

// NEW
import { getOfertas } from '../../services/api';

const dados: any = await getOfertas();
```

**Why:** Backend officially uses `/mudancas/empresa/marketplace/` not `/mudancas/ofertas/`

---

### Step 2: Add Missing API Functions

**File:** `src/services/api.js`

**Add after existing empresa functions:**
```javascript
// === MUDANÇAS - EMPRESA VIEW ===
export const getMudancasEnviadas = async () => {
  const response = await api.get('mudancas/empresa/contratos/')
  return response.data
}

export const getPropostasEnviadas = async () => {
  const response = await api.get('mudancas/propostas/')
  return response.data
}

// === MUDANÇAS - MOTORISTA VIEW ===
export const getMudancasMotorista = async () => {
  const response = await api.get('mudancas/operacional/pds/')
  return response.data
}

// === MUDANÇAS - STATUS UPDATE ===
export const updateMudancaStatus = async (mudancaId, status) => {
  const response = await api.patch(`mudancas/cliente/mudancas/${mudancaId}/`, { status })
  return response.data
}
```

**Remove/Deprecate:**
```javascript
// ❌ DELETE - Wrong endpoint
export const getMudancasDisponiveis = async () => {
  const response = await api.get('mudancas/ofertas/')
  return response.data
}
```

---

### Step 3: Fix Driver Dashboard Data

**File:** `src/pages/clienteMotorista/AreaCliente_Motorista.jsx`

**Current Problem:**
```javascript
// Line 17-20: MOCK DATA
const MOCK_TRIPS = [
  { id: 101, origem: 'São Paulo, SP', ...},
];
```

**Solution:**
```javascript
import { getMudancasMotorista } from '../../services/api';

function AreaCliente_Motorista() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getMudancasMotorista();
        setTrips(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Erro ao carregar viagens:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);
  
  // Use 'trips' state instead of MOCK_TRIPS
}
```

---

### Step 4: Create NotificationCenter Component

**New File:** `src/components/NotificationCenter.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { getNotificacoes, marcarComoLida } from '../services/api';
import { useToast } from '../contexts/ToastContext';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotificacoes();
      const list = Array.isArray(data) ? data : data.results || [];
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.lida).length);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await marcarComoLida(notificationId);
      fetchNotifications();
      showToast('Notificação marcada como lida', 'success');
    } catch (err) {
      console.error('Erro ao marcar notificação:', err);
      showToast('Erro ao marcar notificação', 'error');
    }
  };

  return (
    <div className="notification-center">
      <button className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notificações</h4>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p>Nenhuma notificação</p>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${notif.lida ? 'read' : 'unread'}`}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <strong>{notif.titulo}</strong>
                  <p>{notif.mensagem}</p>
                  <small>{new Date(notif.criado_em).toLocaleString('pt-BR')}</small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
```

**Integration:** Add to all dashboard headers:
- `AreaCliente_Usuario.jsx`
- `AreaCliente_Empresa.tsx`
- `AreaCliente_Motorista.jsx`

---

### Step 5: Create ContasBancarias Component

**New File:** `src/pages/clienteEmpresa/ContasBancarias.tsx`

```typescript
import React, { useState } from 'react';
import { cadastrarContaBancaria } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export default function ContasBancarias() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    banco: '',
    agencia: '',
    conta: '',
    tipo_conta: 'CORRENTE',
    titular: '',
    cpf_cnpj: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastrarContaBancaria(formData);
      showToast('Conta bancária cadastrada com sucesso!', 'success');
      setFormData({
        banco: '', agencia: '', conta: '', 
        tipo_conta: 'CORRENTE', titular: '', cpf_cnpj: ''
      });
    } catch (err) {
      console.error('Erro ao cadastrar conta:', err);
      showToast('Erro ao cadastrar conta bancária', 'error');
    }
  };

  return (
    <div className="contas-bancarias-section">
      <h3>Dados Bancários para Recebimento</h3>
      <form onSubmit={handleSubmit} className="form-bank">
        <input 
          type="text" 
          placeholder="Banco (ex: 001 - Banco do Brasil)"
          value={formData.banco}
          onChange={(e) => setFormData({...formData, banco: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="Agência"
          value={formData.agencia}
          onChange={(e) => setFormData({...formData, agencia: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="Conta"
          value={formData.conta}
          onChange={(e) => setFormData({...formData, conta: e.target.value})}
          required
        />
        <select 
          value={formData.tipo_conta}
          onChange={(e) => setFormData({...formData, tipo_conta: e.target.value})}
        >
          <option value="CORRENTE">Conta Corrente</option>
          <option value="POUPANCA">Conta Poupança</option>
        </select>
        <input 
          type="text" 
          placeholder="Titular da Conta"
          value={formData.titular}
          onChange={(e) => setFormData({...formData, titular: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="CPF/CNPJ do Titular"
          value={formData.cpf_cnpj}
          onChange={(e) => setFormData({...formData, cpf_cnpj: e.target.value})}
          required
        />
        <button type="submit" className="btn-primary">
          Cadastrar Conta Bancária
        </button>
      </form>
    </div>
  );
}
```

**Integration:** Import and render in `EmpresaFinanceiro.tsx`

---

### Step 6: Create NotasFiscais Component

**New File:** `src/pages/clienteEmpresa/NotasFiscais.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { getNotasFiscais, downloadNotaFiscal } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export default function NotasFiscais() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotas();
  }, []);

  const fetchNotas = async () => {
    try {
      const data = await getNotasFiscais();
      setNotas(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Erro ao carregar notas fiscais:', err);
      showToast('Erro ao carregar notas fiscais', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (notaId: number, numero: string) => {
    try {
      const blob = await downloadNotaFiscal(notaId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NF-${numero}.pdf`;
      link.click();
      showToast('Download iniciado!', 'success');
    } catch (err) {
      console.error('Erro ao baixar nota fiscal:', err);
      showToast('Erro ao baixar nota fiscal', 'error');
    }
  };

  if (loading) return <div>Carregando notas fiscais...</div>;

  return (
    <div className="notas-fiscais-section">
      <h3>Notas Fiscais Emitidas</h3>
      <table className="table-notas">
        <thead>
          <tr>
            <th>Número</th>
            <th>Data Emissão</th>
            <th>Valor</th>
            <th>Cliente</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {notas.length === 0 ? (
            <tr><td colSpan={5}>Nenhuma nota fiscal encontrada</td></tr>
          ) : (
            notas.map((nota: any) => (
              <tr key={nota.id}>
                <td>{nota.numero}</td>
                <td>{new Date(nota.data_emissao).toLocaleDateString('pt-BR')}</td>
                <td>R$ {parseFloat(nota.valor).toFixed(2)}</td>
                <td>{nota.cliente_nome}</td>
                <td>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload(nota.id, nota.numero)}
                  >
                    📥 Baixar PDF
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

**Integration:** Import and render in `EmpresaFinanceiro.tsx`

---

## 📝 Testing Checklist

### Customer Flow
- [ ] Register new account
- [ ] Create mudança request
- [ ] View mudança in "Minhas Solicitações"
- [ ] Receive proposals in "Propostas Recebidas"
- [ ] Complete payment flow
- [ ] Evaluate completed service

### Company Flow
- [ ] View marketplace opportunities
- [ ] Send proposal to customer
- [ ] Track proposal status
- [ ] Allocate driver after acceptance
- [ ] Register bank account
- [ ] View issued invoices

### Driver Flow
- [ ] View assigned jobs (real data, not mock)
- [ ] Start service workflow
- [ ] Finish service workflow
- [ ] View earnings/payments

### General
- [ ] Notifications display correctly
- [ ] Backend status indicator works
- [ ] Token refresh works on 401
- [ ] Error messages are user-friendly
- [ ] Loading states are shown

---

## 🚨 Critical Notes

1. **DO NOT MODIFY BACKEND** - This plan only modifies frontend code
2. **Use Mapa_API_Bairrista.md as source of truth** - All endpoints must match
3. **Test with real backend** - Ensure ngrok tunnel is running before testing
4. **Error handling** - Always wrap API calls in try-catch and show user-friendly messages
5. **Loading states** - Show loading indicators during API calls
6. **Data validation** - Validate forms before submitting to backend

---

## 📦 Files to Modify/Create

### Files to Modify
- ✅ `src/services/api.js` - Add missing functions, remove deprecated ones
- ✅ `src/pages/clienteEmpresa/Marketplace.tsx` - Fix endpoint usage
- ✅ `src/pages/clienteMotorista/AreaCliente_Motorista.jsx` - Replace mock data
- ✅ `src/pages/clienteEmpresa/EmpresaFinanceiro.tsx` - Add bank & invoice sections

### Files to Create
- ✅ `src/components/NotificationCenter.jsx` - New component
- ✅ `src/pages/clienteEmpresa/ContasBancarias.tsx` - New component
- ✅ `src/pages/clienteEmpresa/NotasFiscais.tsx` - New component

### Files Already Complete
- ✅ `src/services/authService.js` - Auth functions working
- ✅ `src/pages/clienteUsuario/*` - Customer dashboard complete
- ✅ `src/contexts/AuthContext.tsx` - Auth context working
- ✅ `src/contexts/ToastContext.tsx` - Toast notifications working

---

## ✅ Success Criteria

Implementation is complete when:
1. All API endpoints from Mapa_API_Bairrista.md are accessible via api.js
2. No mock data is used - all data comes from backend
3. All user flows work end-to-end without errors
4. Error handling provides clear user feedback
5. Backend status indicator shows real connectivity
6. All dashboards (cliente, empresa, motorista) are fully functional

---

**Next Step:** Begin Phase 1 implementations starting with Marketplace.tsx fix.
