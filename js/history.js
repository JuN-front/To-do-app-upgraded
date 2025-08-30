// js/history.js
import { $ } from './dom.js';
import { getHistory, recoverFromHistory, removeFromHistory } from './storage.js';

const list = $('#historyList');
render();

/* ---------- Programmatic Confirm Modal ---------- */
function confirmDeleteModal(taskName) {
  return new Promise((resolve) => {
    // Build elements
    const overlay = document.createElement('div');
    overlay.className = 'modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const box = document.createElement('div');
    box.className = 'modal-content';
    box.innerHTML = `
      <h2>Delete Task?</h2>
      <p>This will permanently remove "${escapeHtml(taskName)}" from history. Are you sure?</p>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" id="mCancel">Cancel</button>
        <button class="btn-danger" type="button" id="mDelete">Delete</button>
      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const cancelBtn = $('#mCancel', overlay);
    const deleteBtn = $('#mDelete', overlay);

    const close = (result) => {
      // cleanup listeners + DOM
      overlay.removeEventListener('click', onBackdrop);
      document.removeEventListener('keydown', onEsc);
      overlay.remove();
      resolve(result);
    };
    const onBackdrop = (e) => { if (e.target === overlay) close(false); };
    const onEsc = (e) => { if (e.key === 'Escape') close(false); };

    cancelBtn.addEventListener('click', () => close(false));
    deleteBtn.addEventListener('click', () => close(true));
    overlay.addEventListener('click', onBackdrop);
    document.addEventListener('keydown', onEsc);

    // Focus the destructive button for quick keyboard confirm
    deleteBtn.focus();
  });
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ---------- Render History ---------- */
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
    removeBtn.className = 'icon-btn icon-danger';
    removeBtn.textContent = 'Delete';
    removeBtn.title = 'Remove from history';

    li.append(title, meta, recoverBtn, removeBtn);
    list.appendChild(li);

    recoverBtn.addEventListener('click', () => {
      recoverFromHistory(item.id);
      render();
    });

    removeBtn.addEventListener('click', async () => {
      const ok = await confirmDeleteModal(item.name);
      if (ok) {
        removeFromHistory(item.id);
        render();
      }
    });
  });
}
