// Configuração do Playwright Test.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15000,
  retries: 0, // sem retentativas: uma falha deve aparecer, não ser escondida
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure', // captura de tela só quando um teste falha
    trace: 'retain-on-failure',
  },

  // O Playwright sobe o servidor da aplicação antes dos testes
  // e reaproveita um servidor que já esteja rodando na mesma porta.
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 30000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});