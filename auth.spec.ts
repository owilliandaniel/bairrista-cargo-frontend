import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação e Segurança', () => {
  // Ajuste a porta se o seu Vite rodar em outra (padrão é 5173)
  const BASE_URL = 'http://localhost:5173'; 

  test('Deve realizar login como Empresa e redirecionar para dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // 1. Preencher credenciais
    await page.fill('input[type="email"]', 'transportadora@teste.com');
    await page.fill('input[type="password"]', 'senha123');

    // 2. Mock da API de Login
    await page.route('**/api/v1/usuarios/login/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'fake_access_token',
          refresh: 'fake_refresh_token',
          user: { id: 1, nome: 'Transp. Rápida', tipo_usuario: 'E' } // 'E' = Empresa
        })
      });
    });

    // 3. Clicar em entrar
    await page.click('button[type="submit"]');

    // 4. Verificar se o token foi salvo no LocalStorage
    await page.waitForFunction(() => {
      return localStorage.getItem('access_token') === 'fake_access_token';
    });

    // 5. Verificar redirecionamento (PrivateRoute manda 'E' para /area-empresa)
    await expect(page).toHaveURL(/\/area-empresa/);
  });

  test('Deve realizar Refresh Token automático ao receber erro 401', async ({ page }) => {
    // 1. Setup: Injetar um token expirado no localStorage
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'token_expirado');
      localStorage.setItem('refresh_token', 'refresh_valido');
      localStorage.setItem('user', JSON.stringify({ nome: 'Empresa Teste', tipo_usuario: 'E' }));
    });

    // 2. Mock: Rota protegida retorna 401 na primeira vez, depois 200
    let tentativas = 0;
    await page.route('**/api/v1/empresas/profile/**', async route => {
      if (tentativas === 0) {
        tentativas++;
        await route.fulfill({ status: 401, body: JSON.stringify({ detail: "Token invalid" }) });
      } else {
        await route.fulfill({ status: 200, body: JSON.stringify({ id: 1, razao_social: "Sucesso" }) });
      }
    });

    // 3. Mock: Endpoint de refresh retorna novo token
    await page.route('**/api/v1/usuarios/login/refresh/', async route => {
      await route.fulfill({ 
        status: 200, 
        body: JSON.stringify({ access: 'novo_token_recuperado' }) 
      });
    });

    // 4. Ação: Tentar acessar área protegida
    await page.goto(`${BASE_URL}/area-empresa`);

    // 5. Validação: O sistema deve ter trocado o token no localStorage automaticamente
    await page.waitForFunction(() => localStorage.getItem('access_token') === 'novo_token_recuperado');
    
    // E o usuário deve continuar na página (não foi deslogado)
    await expect(page).toHaveURL(/\/area-empresa/);
  });
});