// js/history.js
import { $, $$ } from './dom.js';
import { getHistory, recoverFromHistory, removeFromHistory } from './storage.js';

const list = $('#historyList');
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
    const when = new Date(item.completedAt).toLocaleString();
    meta.textContent = `Completed: ${when}`;

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
    removeBtn.addEventListener('click', () => {
      removeFromHistory(item.id);
      render();
    });
  });
}