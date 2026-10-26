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

// ---------- Elementos da página ----------
const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descriptionInput = document.getElementById('task-description');
const statusSelect = document.getElementById('task-status');
const formError = document.getElementById('form-error');
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

  createTask(title, description, status);
  form.reset();
  clearError();
  render();
});