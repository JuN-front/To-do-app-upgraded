// js/app.js
import { $, $$, showAlert } from './dom.js';
import { getTasks, addTask, renameTask, completeTask } from './storage.js';

const input = $('#taskInput');
const addBtn = $('#addBtn');
const list = $('#taskList');
const alertBox = $('#alert');

render();

addBtn.addEventListener('click', onAdd);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') onAdd();
});

function onAdd(){
  const name = input.value;
  const created = addTask(name);
  if (!created){
    showAlert(alertBox, 'Task name cannot be empty.', 5000);
    return;
  }
  input.value = '';
  render();
}

function render(){
  const tasks = getTasks();
  list.innerHTML = '';
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

    // Title span
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.name;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.title = 'Edit name';
    editBtn.textContent = '✏️';

    // Complete/Delete -> move to history
    const doneBtn = document.createElement('button');
    doneBtn.className = 'icon-btn';
    doneBtn.title = 'Mark as done';
    doneBtn.textContent = '✅';

    li.append(title, editBtn, doneBtn);
    list.appendChild(li);

    // Handlers
    editBtn.addEventListener('click', () => startInlineEdit(li, title, task.id, task.name));
    doneBtn.addEventListener('click', () => {
      completeTask(task.id);
      render();
    });
  });
}

function startInlineEdit(row, titleEl, id, current){
  // Replace title with input
  const input = document.createElement('input');
  input.className = 'edit-input';
  input.value = current;
  input.setAttribute('aria-label', 'Edit task name');
  row.replaceChild(input, titleEl);

  const hint = document.createElement('div');
  hint.className = 'edit-hint';
  hint.textContent = 'Press Enter to save · Esc to cancel';
  row.appendChild(hint);

  input.focus();
  input.select();

  const commit = () => {
    const ok = renameTask(id, input.value);
    if (!ok){
      showAlert($('#alert'), 'Task name cannot be empty.', 5000);
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
  const cleanup = () => {
    input.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') cancel();
  };
  input.addEventListener('keydown', onKey);
}
