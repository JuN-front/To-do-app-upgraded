import { $ } from './dom.js';
import { getHistory, recoverFromHistory, removeFromHistory } from './storage.js';

const list = $('#historyList');

// Modal elements
const modal = $('#confirmModal');
const cancelBtn = $('#cancelDelete');
const confirmBtn = $('#confirmDelete');
const modalTitle = $('#modalTitle');
const modalMsg = $('#modalMsg');

let pendingDeleteId = null;

render();

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
    recoverBtn.textContent = 'Recover';
    recoverBtn.title = 'Recover to active tasks';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'icon-btn icon-danger btn-delete';
    removeBtn.textContent = 'Delete';
    removeBtn.title = 'Remove from history';

    li.append(title, meta, recoverBtn, removeBtn);
    list.appendChild(li);

    recoverBtn.addEventListener('click', () => {
      recoverFromHistory(item.id);
      render();
    });

    // Open modal only on delete click
    removeBtn.addEventListener('click', () => openModal(item.id, item.name));
  });
}

/* ---------- Modal control ---------- */
function openModal(id, name){
  pendingDeleteId = id;
  if (modalTitle) modalTitle.textContent = 'Delete Task?';
  if (modalMsg) modalMsg.textContent = `This will permanently remove "${name}" from history. Are you sure?`;
  modal.hidden = false;               // show
  confirmBtn?.focus();
}
function closeModal(){
  pendingDeleteId = null;
  modal.hidden = true;                // hide
}

cancelBtn?.addEventListener('click', closeModal);
confirmBtn?.addEventListener('click', () => {
  if (pendingDeleteId){
    removeFromHistory(pendingDeleteId);
    closeModal();
    render();
  }
});

// Close when clicking the dark backdrop
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Optional: Esc to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});
