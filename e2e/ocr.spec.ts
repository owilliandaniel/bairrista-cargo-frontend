import { test, expect } from '@playwright/test';

test.describe('Funcionalidade de OCR e Cadastro', () => {
  const BASE_URL = 'http://localhost:3000';

  test('Deve processar upload de CNH e exibir sucesso', async ({ page }) => {
    // 1. Setup: Injetar sessão ANTES de carregar a página
    // Isso garante que o localStorage exista antes de qualquer script do React rodar
    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'token_mock_valido');
      window.localStorage.setItem('refresh_token', 'refresh_mock_valido');
      window.localStorage.setItem('user_data', JSON.stringify({ 
        id: 1, 
        nome: 'Transp. Rápida', 
        email: 'transportadora@teste.com',
        tipo_usuario: 'E' 
      }));
    });

    // 2. Mock da API (Unificado e Robusto)
    await page.route('**/api/v1/**', async route => {
      const url = route.request().url();
      
      if (url.includes('/empresas/profile/')) {
        await route.fulfill({ status: 200, body: JSON.stringify({ 
          id: 1, 
          razao_social: "Empresa Mock",
          nome_fantasia: "Empresa Fantasia",
          cnpj: "12345678000199",
          telefone: "51999999999"
        }) });
      } else if (url.includes('/ia/extrair-dados/')) {
        // Mock da IA com delay simulado
        await new Promise(r => setTimeout(r, 500));
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ nome: 'João Motorista', registro_cnh: '12345678900', categoria: 'E' })
        });
      } else {
        // Para qualquer outra chamada de API (ex: /notificacoes, /ofertas),
        // retornamos um array vazio para evitar que a UI quebre ao tentar
        // iterar sobre um objeto (ex: .map is not a function).
        await route.fulfill({ status: 200, body: '[]' });
      }
    });

    // 3. Agora navegamos para a área da empresa
    await page.goto(`${BASE_URL}/area-empresa`); 
    await expect(page).toHaveURL(/.*area-empresa/);

    // 4. Navegar para a seção "Equipe" clicando no menu
    await page.getByText('Equipe').click();

    // 5. Aguardar a seção "Equipe" carregar
    await page.waitForTimeout(2000); // Aguardar mudança de seção

    // 6. Verificar se estamos na seção correta
    await expect(page.getByText('Cadastre um funcionário')).toBeVisible();

    // 7. Clicar no botão para ativar OCR
    await page.getByText('🤖 Usar OCR (Foto da CNH)').click();

    // 8. Aguardar o componente OCR aparecer
    await page.waitForTimeout(1000);
    await expect(page.getByText('Upload de CNH')).toBeVisible();

    // 5. Realizar Upload no input de arquivo
    const fileInput = page.locator('input[type="file"]');
    
    const buffer = Buffer.from('conteudo-fake-imagem');
    await fileInput.setInputFiles({
      name: 'cnh_teste.jpg',
      mimeType: 'image/jpeg',
      buffer
    });

    // 6. Verificar se o Toast de sucesso apareceu
    await expect(page.getByText('Dados extraídos com sucesso!')).toBeVisible();
  });
});