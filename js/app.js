// js/app.js
import { $, showAlert } from './dom.js';
import { getTasks, addTask, renameTask, completeTask, deleteTask } from './storage.js';

const form = $('#taskForm');
const input = $('#taskInput');
const addBtn = $('#addBtn');
const list = $('#taskList');
const alertBox = $('#alert');
const stats = $('#taskStats');

render();
addBtn.disabled = true;

form.addEventListener('submit', e => {
  e.preventDefault();
  onAdd();
});

input.addEventListener('input', () => {
  addBtn.disabled = input.value.trim() === '';
});

list.addEventListener('click', onListClick);

function onAdd(){
  const name = input.value;
  const created = addTask(name);
  if (!created){
    showAlert(alertBox, 'Task name cannot be empty.', 5000);
    return;
  }
  input.value = '';
  addBtn.disabled = true;
  showAlert(alertBox, 'Task added.', 3000);
  render();
}

function onListClick(event){
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  if (!action) return;

  const row = button.closest('li');
  const id = row?.dataset.id;
  if (!id) return;

  if (action === 'edit'){
    const titleEl = row.querySelector('.title');
    if (titleEl) startInlineEdit(row, titleEl, id, titleEl.textContent);
    return;
  }

  if (action === 'done'){
    completeTask(id);
    showAlert(alertBox, 'Task completed and moved to history.', 3000);
    render();
    return;
  }

  if (action === 'delete'){
    deleteTask(id);
    showAlert(alertBox, 'Task deleted.', 3000);
    render();
    return;
  }
}

function render(){
  const tasks = getTasks();
  list.innerHTML = '';
  updateStats(tasks);

  if (!tasks.length){
    const empty = document.createElement('li');
    empty.className = 'card muted';
    empty.textContent = 'No tasks yet — add one above.';
    list.appendChild(empty);
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'card';
    li.dataset.id = task.id;

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.name;

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.title = 'Edit name';
    editBtn.type = 'button';
    editBtn.dataset.action = 'edit';
    editBtn.textContent = '✏️';

    const doneBtn = document.createElement('button');
    doneBtn.className = 'icon-btn';
    doneBtn.title = 'Mark as done';
    doneBtn.type = 'button';
    doneBtn.dataset.action = 'done';
    doneBtn.textContent = '✅';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn icon-danger';
    deleteBtn.title = 'Delete task';
    deleteBtn.type = 'button';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.textContent = '🗑️';

    li.append(title, editBtn, doneBtn, deleteBtn);
    list.appendChild(li);
  });
}

function updateStats(tasks){
  const count = tasks.length;
  stats.innerHTML = `
    <div class="stats-card">
      <strong>${count}</strong> active task${count === 1 ? '' : 's'}
    </div>
  `;
}

function startInlineEdit(row, titleEl, id, current){
  const inputEl = document.createElement('input');
  inputEl.className = 'edit-input';
  inputEl.value = current;
  inputEl.setAttribute('aria-label', 'Edit task name');
  inputEl.type = 'text';
  row.replaceChild(inputEl, titleEl);

  const hint = document.createElement('div');
  hint.className = 'edit-hint';
  hint.textContent = 'Press Enter to save · Esc to cancel';
  row.appendChild(hint);

  inputEl.focus();
  inputEl.select();

  const commit = () => {
    const ok = renameTask(id, inputEl.value);
    if (!ok){
      showAlert(alertBox, 'Task name cannot be empty.', 5000);
      cancel();
      return;
    }
    cleanup();
    render();
  };

  const cancel = () => {
    cleanup();
    render();
  };

  const onKey = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') cancel();
  };

  const cleanup = () => {
    inputEl.removeEventListener('keydown', onKey);
  };

  inputEl.addEventListener('keydown', onKey);
}
