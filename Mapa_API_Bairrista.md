🗺️ Mapa da API Bairrista Cargo (V1)
🔐 Autenticação & Usuário

POST /api/v1/usuarios/registrar/ (Cria conta)

POST /api/v1/usuarios/validar-codigo/ (Valida SMS/Email)

POST /api/v1/usuarios/login/ (Pega Token JWT)

GET /api/v1/usuarios/notificacoes/ (Central de avisos)

👤 Cliente

GET/PATCH /api/v1/clientes/ (Perfil Pessoal)

POST /api/v1/mudancas/cliente/mudancas/ (Solicita Mudança)

POST /api/v1/mudancas/cliente/mudancas/{id}/avaliar/ (Avalia serviço)

🏢 Empresa

GET/PUT /api/v1/empresas/perfil/ (Dados da Empresa - Singleton)

POST /api/v1/empresas/frota/ (Gestão de Veículos)

POST /api/v1/pagamentos/contas-bancarias/ (Conta para receber $)

GET /api/v1/mudancas/empresa/marketplace/ (Feed de Oportunidades)

POST /api/v1/mudancas/{id}/enviar-proposta/ (Envia Orçamento)

PATCH /api/v1/mudancas/empresa/contratos/{id}/alocar-motorista/ (Define Motorista)

🚚 Motorista

POST /api/v1/motoristas/cadastro/ (Vínculo com Empresa)

GET /api/v1/mudancas/operacional/pds/ (Agenda de Mudanças)

POST /api/v1/mudancas/operacional/pds/{id}/iniciar-servico/

POST /api/v1/mudancas/operacional/pds/{id}/finalizar-servico/

💰 Financeiro & Fiscal

POST /api/v1/mudancas/propostas/{id}/pagamento/ (Cliente paga oferta)

POST /api/v1/pagamentos/webhook/ (Callback do Pagar.me)

GET /api/v1/fiscal/notas-fiscais/ (Download de NFs)

🤖 IA & Utilitários

POST /api/v1/mudancas/simular-preco/ (Lead Magnet público)

POST /api/v1/mudancas/analisar-imagem/ (Inventário via Foto)