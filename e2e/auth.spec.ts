import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação e Segurança', () => {
  const BASE_URL = 'http://localhost:3000';

  test('Deve realizar login como Empresa e redirecionar para dashboard', async ({ page }) => {
    // Mock da API de login para simular backend até ter usuários de teste
    await page.route('**/api/v1/usuarios/login/', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          access: 'mock_access_token_123',
          refresh: 'mock_refresh_token_456',
          user_id: 1,
          email: 'empresa@teste.com',
          nome: 'Empresa Teste',
          tipo_usuario: 'E',
          empresa_id: 1,
          nome_fantasia: 'Empresa Teste Ltda',
          tipo_atuacao: 'M'
        })
      });
    });

    await page.goto(`${BASE_URL}/login`);

    // 1. Preencher credenciais
    await page.fill('input[type="email"]', 'empresa@teste.com');
    await page.fill('input[type="password"]', 'senha123');

    // 2. Clicar em entrar
    await page.click('button[type="submit"]');

    // 3. Aguardar redirecionamento
    await page.waitForURL('**/area-empresa', { timeout: 10000 });

    // 4. Verificar se estamos na área da empresa
    await expect(page).toHaveURL(/.*area-empresa/);

    // 5. Verificar elementos da dashboard - usar seletor mais específico
    await expect(page.getByRole('main').getByText('Marketplace', { exact: true })).toBeVisible();

    // 6. Verificar se os tokens foram salvos no localStorage
    const accessToken = await page.evaluate(() => localStorage.getItem('access_token'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refresh_token'));
    expect(accessToken).toBe('mock_access_token_123');
    expect(refreshToken).toBe('mock_refresh_token_456');
  });

  test('Deve rejeitar login com credenciais inválidas', async ({ page }) => {
    // Mock da API para simular erro de autenticação
    await page.route('**/api/v1/usuarios/login/', async route => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({
          detail: 'Credenciais inválidas'
        })
      });
    });

    await page.goto(`${BASE_URL}/login`);

    // 1. Tentar fazer login com credenciais inválidas
    await page.fill('input[type="email"]', 'invalido@teste.com');
    await page.fill('input[type="password"]', 'senhaerrada');
    await page.click('button[type="submit"]');

    // 2. Verificar que permanece na página de login
    await expect(page).toHaveURL(/.*login/);

    // 3. Verificar que não há tokens salvos
    const accessToken = await page.evaluate(() => localStorage.getItem('access_token'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refresh_token'));
    expect(accessToken).toBeNull();
    expect(refreshToken).toBeNull();
  });
});