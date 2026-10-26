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

// ---------- AT-02 (TC-04): título vazio ----------
test('AT-02: não cadastra tarefa com título vazio', async ({ page }) => {
  await page.getByTestId('save-button').click();

  await expect(page.getByTestId('form-error')).toHaveText('O título é obrigatório.');
  await expect(page.getByTestId('task-item')).toHaveCount(0);
  await expect(page.getByTestId('empty-message')).toHaveText('Nenhuma tarefa cadastrada.');
});

// ---------- AT-03 (TC-05): título só com espaços ----------
test('AT-03: não cadastra tarefa com título só de espaços', async ({ page }) => {
  await addTask(page, { title: '     ' });

  await expect(page.getByTestId('form-error')).toHaveText('O título é obrigatório.');
  await expect(page.getByTestId('task-item')).toHaveCount(0);
});

// ---------- AT-04 (TC-06): valor-limite inválido ----------
test('AT-04: rejeita título com 101 caracteres', async ({ page }) => {
  await addTask(page, { title: 'A'.repeat(101) });

  await expect(page.getByTestId('form-error')).toHaveText(
    'O título deve ter no máximo 100 caracteres.'
  );
  await expect(page.getByTestId('task-item')).toHaveCount(0);
})
// ---------- AT-05 (TC-08): edição ----------
test('AT-05: edita título e descrição de uma tarefa', async ({ page }) => {
  await addTask(page, { title: 'Estudar SQL', description: 'Capítulo 1' });

  await taskByTitle(page, 'Estudar SQL').getByTestId('edit-button').click();

  // O formulário deve entrar em modo de edição com os dados atuais.
  await expect(page.getByTestId('form-title')).toHaveText('Editar tarefa');
  await expect(page.getByTestId('task-title-input')).toHaveValue('Estudar SQL');
  await expect(page.getByTestId('task-description-input')).toHaveValue('Capítulo 1');

  await page.getByTestId('task-title-input').fill('Estudar SQL avançado');
  await page.getByTestId('task-description-input').fill('Capítulo 2');
  await page.getByTestId('save-button').click();

  // Continua havendo uma única tarefa (editou, não duplicou).
  await expect(page.getByTestId('task-item')).toHaveCount(1);
  const item = taskByTitle(page, 'Estudar SQL avançado');
  await expect(item.getByTestId('task-description')).toHaveText('Capítulo 2');
  await expect(taskByTitle(page, 'Estudar SQL')).toHaveCount(0);
  await expect(page.getByTestId('form-title')).toHaveText('Nova tarefa');
});

// ---------- AT-06 (TC-11): exclusão confirmada ----------
test('AT-06: exclui uma tarefa ao confirmar o diálogo', async ({ page }) => {
  await addTask(page, { title: 'Tarefa para excluir' });

  // O diálogo precisa ser tratado ANTES do clique que o abre.
  let dialogMessage = '';
  page.once('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await taskByTitle(page, 'Tarefa para excluir').getByTestId('delete-button').click();

  expect(dialogMessage).toBe('Excluir a tarefa "Tarefa para excluir"?');
  await expect(page.getByTestId('task-item')).toHaveCount(0);
  await expect(page.getByTestId('empty-message')).toHaveText('Nenhuma tarefa cadastrada.');
});

// ---------- AT-07 (TC-12): exclusão cancelada ----------
test('AT-07: mantém a tarefa ao cancelar a exclusão', async ({ page }) => {
  await addTask(page, { title: 'Tarefa para manter' });

  page.once('dialog', (dialog) => dialog.dismiss());
  await taskByTitle(page, 'Tarefa para manter').getByTestId('delete-button').click();

  await expect(taskByTitle(page, 'Tarefa para manter')).toHaveCount(1);
  await expect(page.getByTestId('task-count')).toHaveText('Exibindo 1 de 1 tarefa(s)');
});

// ---------- AT-08 (TC-13): mudança de status ----------
test('AT-08: altera o status de uma tarefa pela lista', async ({ page }) => {
  await addTask(page, { title: 'Escrever testes', description: 'Parte 1' });
  const item = taskByTitle(page, 'Escrever testes');
  await expect(item.getByTestId('task-status')).toHaveText('A fazer');

  await item.getByTestId('task-status-change').selectOption('done');

  await expect(item.getByTestId('task-status')).toHaveText('Concluída');
  // Título e descrição não podem mudar.
  await expect(item.getByTestId('task-title')).toHaveText('Escrever testes');
  await expect(item.getByTestId('task-description')).toHaveText('Parte 1');
});

// ---------- AT-09 (TC-14): filtro por status ----------
test('AT-09: filtra tarefas por status', async ({ page }) => {
  await addTask(page, { title: 'Tarefa A', status: 'todo' });
  await addTask(page, { title: 'Tarefa B', status: 'doing' });
  await addTask(page, { title: 'Tarefa C', status: 'done' });
  await expect(page.getByTestId('task-item')).toHaveCount(3);

  await page.getByTestId('filter-status').selectOption('doing');
  await expect(page.getByTestId('task-title')).toHaveText(['Tarefa B']);
  await expect(page.getByTestId('task-count')).toHaveText('Exibindo 1 de 3 tarefa(s)');

  await page.getByTestId('filter-status').selectOption('done');
  await expect(page.getByTestId('task-title')).toHaveText(['Tarefa C']);

  await page.getByTestId('filter-status').selectOption('');
  await expect(page.getByTestId('task-title')).toHaveText(['Tarefa A', 'Tarefa B', 'Tarefa C']);
});