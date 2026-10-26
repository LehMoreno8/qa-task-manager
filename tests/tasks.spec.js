// Testes automatizados do Gerenciador de Tarefas.
//
// Como cada teste do Playwright roda num contexto de navegador novo,
// o localStorage começa vazio em todos eles. Isso mantém os testes independentes.

const { test, expect } = require('@playwright/test');

// ---------- Funções auxiliares ----------

// Preenche o formulário e clica em "Adicionar tarefa".
async function addTask(page, { title, description = '', status } = {}) {
  await page.getByTestId('task-title-input').fill(title);
  if (description) {
    await page.getByTestId('task-description-input').fill(description);
  }
  if (status) {
    await page.getByTestId('task-status-select').selectOption(status);
  }
  await page.getByTestId('save-button').click();
}

// Encontra o cartão de uma tarefa pelo título exato (o título é um <h3>).
function taskByTitle(page, title) {
  return page
    .getByTestId('task-item')
    .filter({ has: page.getByRole('heading', { name: title, exact: true }) });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// ---------- AT-01 (TC-01): cadastro positivo ----------
test('AT-01: cadastra uma tarefa válida', async ({ page }) => {
  await addTask(page, {
    title: 'Estudar Playwright',
    description: 'Fazer o tutorial oficial',
    status: 'doing',
  });

  const item = taskByTitle(page, 'Estudar Playwright');
  await expect(page.getByTestId('task-item')).toHaveCount(1);
  await expect(item.getByTestId('task-description')).toHaveText('Fazer o tutorial oficial');
  await expect(item.getByTestId('task-status')).toHaveText('Em andamento');
  await expect(page.getByTestId('task-count')).toHaveText('Exibindo 1 de 1 tarefa(s)');

  // O formulário deve voltar ao estado inicial e não deve haver erro.
  await expect(page.getByTestId('form-error')).toBeHidden();
  await expect(page.getByTestId('task-title-input')).toHaveValue('');
  await expect(page.getByTestId('task-status-select')).toHaveValue('todo');
});