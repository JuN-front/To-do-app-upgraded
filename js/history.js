import { $, $$ } from './dom.js';
import { getHistory, recoverFromHistory, removeFromHistory } from './storage.js';

const list = $('#historyList');
const modal = $('#confirmModal');
const cancelBtn = $('#cancelDelete');
const confirmBtn = $('#confirmDelete');

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

    const removeBtn = document.createElement('button');
    removeBtn.className = 'icon-btn icon-danger';
    removeBtn.textContent = 'Delete';

    li.append(title, meta, recoverBtn, removeBtn);
    list.appendChild(li);

    recoverBtn.addEventListener('click', () => {
      recoverFromHistory(item.id);
      render();
    });
    removeBtn.addEventListener('click', () => {
      pendingDeleteId = item.id;
      modal.hidden = false;
    });
  });
}

// --- Modal controls ---
cancelBtn.addEventListener('click', () => {
  pendingDeleteId = null;
  modal.hidden = true;
});
confirmBtn.addEventListener('click', () => {
  if (pendingDeleteId) {
    removeFromHistory(pendingDeleteId);
    pendingDeleteId = null;
    render();
  }
  modal.hidden = true;
});

// Optional: close modal on background click
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.hidden = true;
    pendingDeleteId = null;
  }
});
