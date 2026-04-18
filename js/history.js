// js/history.js
import { $ } from './dom.js';
import { getHistory, recoverFromHistory, removeFromHistory, clearHistory } from './storage.js';

const list = $('#historyList');
const clearHistoryBtn = $('#clearHistoryBtn');
const modal = $('#confirmModal');
const modalTitle = $('#modalTitle');
const modalMsg = $('#modalMsg');
const cancelBtn = $('#cancelDelete');
const confirmBtn = $('#confirmDelete');

clearHistoryBtn?.addEventListener('click', async () => {
  const confirmed = await openConfirm(
    'Clear history?','This will permanently remove all completed tasks. Continue?'
  );
  if (confirmed) {
    clearHistory();
    render();
  }
});

list.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const row = button.closest('li');
  const id = row?.dataset.id;
  if (!action || !id) return;

  if (action === 'recover') {
    recoverFromHistory(id);
    render();
    return;
  }

  if (action === 'delete') {
    const confirmed = await openConfirm(
      'Delete task?',
      `This will permanently remove "${row.querySelector('.title')?.textContent ?? 'this task'}" from history.`
    );
    if (confirmed) {
      removeFromHistory(id);
      render();
    }
  }
});

render();

function openConfirm(title, message) {
  return new Promise(resolve => {
    modalTitle.textContent = title;
    modalMsg.textContent = message;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    confirmBtn.focus();

    const close = result => {
      cleanup();
      modal.hidden = true;
      document.body.style.overflow = '';
      resolve(result);
    };

    const onBackdrop = e => { if (e.target === modal) close(false); };
    const onEsc = e => { if (e.key === 'Escape') close(false); };
    const onCancel = () => close(false);
    const onConfirm = () => close(true);

    modal.addEventListener('click', onBackdrop);
    document.addEventListener('keydown', onEsc);
    cancelBtn.addEventListener('click', onCancel);
    confirmBtn.addEventListener('click', onConfirm);

    function cleanup() {
      modal.removeEventListener('click', onBackdrop);
      document.removeEventListener('keydown', onEsc);
      cancelBtn.removeEventListener('click', onCancel);
      confirmBtn.removeEventListener('click', onConfirm);
    }
  });
}

function render(){
  const items = getHistory();
  list.innerHTML = '';

  if (!items.length){
    const empty = document.createElement('li');
    empty.className = 'card muted';
    empty.textContent = 'No items in history.';
    list.appendChild(empty);
    return;
  }

  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'card';
    li.dataset.id = item.id;

    const title = document.createElement('span');
    title.className = 'title done';
    title.textContent = item.name;

    const meta = document.createElement('span');
    meta.className = 'small muted';
    meta.textContent = `Completed: ${new Date(item.completedAt).toLocaleString()}`;

    const recoverBtn = document.createElement('button');
    recoverBtn.className = 'icon-btn';
    recoverBtn.type = 'button';
    recoverBtn.textContent = 'Recover';
    recoverBtn.title = 'Recover to active tasks';
    recoverBtn.dataset.action = 'recover';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'icon-btn icon-danger';
    removeBtn.type = 'button';
    removeBtn.textContent = 'Delete';
    removeBtn.title = 'Remove from history';
    removeBtn.dataset.action = 'delete';

    li.append(title, meta, recoverBtn, removeBtn);
    list.appendChild(li);
  });
}
