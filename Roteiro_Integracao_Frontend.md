Roteiro de Integração Front-End: Bairrista Cargo
Base URL: http://localhost:8000/api/v1 Auth Header: Authorization: Bearer <ACCESS_TOKEN>
________________________________________
🔐 Módulo 1: Autenticação & Onboarding
Comum a Clientes e Empresas.
1.1 Registro de Usuário
Tela: Cadastro Inicial (Email/Senha). Endpoint: POST /usuarios/registrar/ Payload:
JSON
{
    "email": "novo@usuario.com",
    "senha": "senhaforte123",
    "tipo_usuario": "C",  // "C" = Cliente, "E" = Empresa
    "nome": "Nome Completo"
}
Resposta Sucesso: { "mensagem": "...", "debug_codigo": "123456" }
Front: Redirecionar para tela de validação de código.
1.2 Validação de Token (MFA)
Tela: "Digite o código enviado ao seu e-mail". Endpoint: POST /usuarios/validar-codigo/ Payload:
JSON
{ "email": "novo@usuario.com", "codigo": "123456" }
Resposta Sucesso: { "access": "eyJ...", "refresh": "eyJ..." }
Front: Salvar Tokens no LocalStorage/Cookies.
1.3 Login
Tela: Login. Endpoint: POST /usuarios/login/ Payload:
JSON
{ "email": "novo@usuario.com", "senha": "senhaforte123" }
________________________________________
🚚 Módulo 2: Jornada do Cliente (Quem pede a mudança)
2.1 Completar Perfil (Primeiro Acesso)
Tela: "Complete seu cadastro para continuar". Endpoint: POST /clientes/ Payload:
JSON
{
    "cpf": "000.000.000-00",
    "telefone_celular": "51999999999",
    "nome": "Ana Cliente"
}
2.2 Criar Solicitação de Mudança (O Formulário Principal)
Tela: "Solicitar Mudança" (Wizard: Origem -> Destino -> Itens). Endpoint: POST /mudancas/solicitacoes/ Payload:
JSON
{
    "tipo_mudanca": "RES", // RESidencial, COMercial
    "data_mudanca": "2025-12-30",
    "cidade_origem": "Porto Alegre", "estado_origem": "RS", "endereco_origem": "Av Ipiranga, 100",
    "tipo_origem": "APT", "elevador_origem": true, "portaria_origem": true,
    
    "cidade_destino": "Canoas", "estado_destino": "RS", "endereco_destino": "Centro",
    "tipo_destino": "CAS",
    
    "precisa_empacotamento": true,
    "itens": [
        { "tipo_mobilia": 1, "quantidade": 1, "precisa_desmontar": true }
    ]
}
2.3 Ver Orçamentos Recebidos
Tela: "Minhas Mudanças > Detalhes > Propostas". Endpoint: GET /mudancas/orcamentos/ Resposta: Lista de orçamentos vinculados às mudanças do cliente.
Front: Exibir Card com valor_final_empresa, observacoes_empresa e botão "Aceitar".
2.4 Checkout (Aceitar e Pagar)
Tela: Checkout / Pagamento. Endpoint: POST /mudancas/orcamentos/{ID_ORCAMENTO}/pagamento/ Payload:
JSON
{ "metodo_pagamento": "pix" }
Resposta: { "qrcode_pix": "...", "pagarme_status": "pendente" }
Front: Gerar QR Code na tela usando lib (ex: qrcode.react) e polling para verificar status.
________________________________________
🏢 Módulo 3: Jornada da Empresa (Quem faz o serviço)
3.1 Perfil da Empresa
Tela: "Dados da Transportadora". Endpoint: POST /empresas/cadastro/ Payload:
JSON
{
    "razao_social": "Transportes LTDA", "nome_fantasia": "Bairrista Cargo",
    "cnpj": "14 digitos", "telefone": "51999999999"
}
3.2 Cadastro Financeiro (Obrigatório para receber)
Tela: "Dados Bancários". Endpoint: POST /pagamentos/contas-bancarias/ Payload:
JSON
{
    "banco_codigo": "001", "agencia": "1234", "conta": "54321", "conta_dv": "0",
    "tipo_conta": "conta_corrente", "documento_titular": "CNPJ_DA_EMPRESA",
    "nome_titular": "Razão Social", "periodicidade_transferencia": "daily"
}
3.3 Mural de Oportunidades (Leads)
Tela: Feed de Mudanças (Estilo Uber/iFood Entregador). Endpoint: GET /mudancas/ofertas/ Resposta: Lista de mudanças com status SOLICITADA.
Front: Mostrar distancia_km, volume_total_m3 e preco_sugerido_para_minha_empresa.
3.4 Enviar Orçamento (Dar o Lance)
Tela: Detalhe da Oportunidade > "Enviar Proposta". Endpoint: POST /mudancas/orcamentos/ Payload:
JSON
{
    "mudanca": 1, // ID da mudança selecionada
    "valor_final_empresa": "1800.00",
    "valor_desmontagem_montagem": "150.00",
    "valor_empacotamento": "200.00",
    "observacoes_empresa": "Caminhão baú fechado com equipe de 3."
}
________________________________________
🧠 Módulo 4: Funcionalidades "Wow" & Auxiliares (Não testados no fluxo principal)
Estes endpoints existem no código (ou foram planejados) e são essenciais para uma UX rica.
4.1 Inteligência Artificial (Inventário por Foto)
Tela: Solicitação de Mudança > "Adicionar Itens" > "Tirar Foto". Endpoint: POST /analisar-imagem/ (Configurado no urls.py) Header: Content-Type: multipart/form-data Payload:
•	imagem: (Arquivo binário/blob da imagem) Resposta Esperada:
JSON
{
    "itens_detectados": [
        { "nome": "Sofá", "quantidade": 1, "confianca": 0.98 },
        { "nome": "Mesa de Jantar", "quantidade": 1, "confianca": 0.85 }
    ],
    "volume_estimado_total": 2.5
}
Front: Receber o JSON e pré-popular a lista de itens para o usuário confirmar.
4.2 Catálogo de Mobília (Autocomplete)
Tela: Input de busca de itens ("Digitar nome do móvel"). Endpoint: GET /catalogo/buscar/?q=geladeira Resposta Esperada:
JSON
[
    { "id": 5, "nome": "Geladeira Duplex", "volume_m3": 1.2 },
    { "id": 6, "nome": "Geladeira Side-by-Side", "volume_m3": 1.8 }
]
4.3 Dashboard Financeiro (Empresa)
Tela: "Minha Carteira / Extrato". Endpoint: GET /empresas/meu-negocio/ (Inclui dados gerais) ou um endpoint específico de Transacoes (se implementarmos filtro por usuário).
Dica: O endpoint GET /mudancas/orcamentos/ filtrado por status ACEITO serve como histórico de vendas.
________________________________________
🛠️ Dicas Técnicas para o Front-End
1.	Tratamento de Erros: O backend retorna erros no formato { "detail": "..." } ou { "campo": ["erro"] }. Crie um interceptor no Axios/Fetch para mostrar "Toasts" (notificações) automáticos.
2.	Mock do Webhook: No front, enquanto estiver em localhost, você pode criar um botão secreto "Simular Pagamento" que chama o endpoint /webhook/ com o ID da transação atual, para não precisar abrir o Postman toda hora.
3.	Estados da Mudança:
o	SOL (Solicitada): Aparece para empresas.
o	ORC (Orçada): Cliente recebeu propostas.
o	AGE (Agendada/Paga): Negócio fechado. Use cores diferentes (Cinza, Azul, Verde) para esses badges.

