// Gerenciador de Tarefas - JavaScript puro, dados salvos no localStorage.

const STORAGE_KEY = 'tasks';
const TITLE_MAX_LENGTH = 100;
const STATUS_LABELS = {
  todo: 'A fazer',
  doing: 'Em andamento',
  done: 'Concluída',
};

// ---------- Estado ----------
let tasks = loadTasks();
let editingId = null; // id da tarefa em edição (null = modo cadastro)

// ---------- Elementos da página ----------
const form = document.getElementById('task-form');
const formTitle = document.getElementById('form-title');
const titleInput = document.getElementById('task-title');
const descriptionInput = document.getElementById('task-description');
const statusSelect = document.getElementById('task-status');
const formError = document.getElementById('form-error');
const saveButton = document.getElementById('save-button');
const cancelEditButton = document.getElementById('cancel-edit-button');
const taskCount = document.getElementById('task-count');
const emptyMessage = document.getElementById('empty-message');
const taskList = document.getElementById('task-list');

// ---------- Persistência ----------
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---------- Validação ----------
function validateTitle(title) {
  if (title === '') {
    return 'O título é obrigatório.';
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return 'O título deve ter no máximo ' + TITLE_MAX_LENGTH + ' caracteres.';
  }
  return '';
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function clearError() {
  formError.textContent = '';
  formError.hidden = true;
}

// ---------- Ações ----------
function createTask(title, description, status) {
  tasks.push({
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    title: title,
    description: description,
    status: status,
  });
  saveTasks();
}

// ---------- Renderização ----------

  function createButton(text, className, testId, ariaLabel, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  if (className) button.className = className;
  button.setAttribute('data-testid', testId);
  button.setAttribute('aria-label', ariaLabel);
  button.addEventListener('click', onClick);
  return button;
}

function createTaskElement(task) {
  const item = document.createElement('li');
  item.className = 'task-item';
  item.setAttribute('data-testid', 'task-item');
  item.setAttribute('data-status', task.status);

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'task-title');
  title.textContent = task.title; // textContent evita injeção de HTML
  item.appendChild(title);

  if (task.description) {
    const description = document.createElement('p');
    description.setAttribute('data-testid', 'task-description');
    description.textContent = task.description;
    item.appendChild(description);
  }

  const badge = document.createElement('span');
  badge.className = 'status-badge';
  badge.setAttribute('data-testid', 'task-status');
  badge.textContent = STATUS_LABELS[task.status];
  item.appendChild(badge);

    const actions = document.createElement('div');
  actions.className = 'task-actions';

   actions.appendChild(createButton('Excluir', 'danger', 'delete-button',
    'Excluir tarefa ' + task.title, function () { deleteTask(task.id); }));

  actions.appendChild(createButton('Editar', 'secondary', 'edit-button',
    'Editar tarefa ' + task.title, function () { startEdit(task.id); }));

  item.appendChild(actions);

  return item;
}

function render() {
  const visible = tasks;

  taskList.innerHTML = '';
  visible.forEach(function (task) {
    taskList.appendChild(createTaskElement(task));
  });

  taskCount.textContent = 'Exibindo ' + visible.length + ' de ' + tasks.length + ' tarefa(s)';

  if (tasks.length === 0) {
    emptyMessage.textContent = 'Nenhuma tarefa cadastrada.';
    emptyMessage.hidden = false;
  } else if (visible.length === 0) {
    emptyMessage.textContent = 'Nenhuma tarefa encontrada com os filtros atuais.';
    emptyMessage.hidden = false;
  } else {
    emptyMessage.hidden = true;
  }
}

// ---------- Eventos ----------
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const status = statusSelect.value;

  const error = validateTitle(title);
  if (error) {
    showError(error);
    return;
  }

    if (editingId) {
    updateTask(editingId, title, description, status);
  } else {
    createTask(title, description, status);
  }

  resetForm();
   render();
});

function updateTask(id, title, description, status) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;
  task.title = title;
  task.description = description;
  task.status = status;
  saveTasks();
}

function deleteTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;
  const confirmed = window.confirm('Excluir a tarefa "' + task.title + '"?');
  if (!confirmed) return;

  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  if (editingId === id) {
    resetForm();
  }
  render();
}

function startEdit(id) { 
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;
  editingId = id;
  titleInput.value = task.title;
  descriptionInput.value = task.description;
  statusSelect.value = task.status;
  formTitle.textContent = 'Editar tarefa';
  saveButton.textContent = 'Salvar alterações';
  cancelEditButton.hidden = false;
  clearError();
  titleInput.focus();
}

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = 'Nova tarefa';
  saveButton.textContent = 'Adicionar tarefa';
  cancelEditButton.hidden = true;
  clearError();
}

cancelEditButton.addEventListener('click', resetForm);

render();