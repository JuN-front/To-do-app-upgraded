// js/storage.js
// LocalStorage keys
const TASKS_KEY = "todo.tasks.v1";
const HISTORY_KEY = "todo.history.v1";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function now() { return Date.now(); }
function uid() { return crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2); }

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// --- Tasks
export function getTasks() { return read(TASKS_KEY); }
export function setTasks(tasks){ write(TASKS_KEY, tasks); }
export function addTask(name){
  const trimmed = name.trim();
  if (!trimmed) return null;
  const tasks = getTasks();
  const t = { id: uid(), name: trimmed, createdAt: now() };
  tasks.unshift(t);
  setTasks(tasks);
  return t;
}
export function renameTask(id, newName){
  const tasks = getTasks();
  const t = tasks.find(x => x.id === id);
  if (!t) return false;
  const trimmed = newName.trim();
  if (!trimmed) return false;
  t.name = trimmed;
  setTasks(tasks);
  return true;
}
export function completeTask(id){
  // remove from tasks and push to history with completedAt timestamp
  const tasks = getTasks();
  const idx = tasks.findIndex(x => x.id === id);
  if (idx === -1) return null;
  const [t] = tasks.splice(idx, 1);
  setTasks(tasks);

  const history = getHistory();
  history.unshift({ ...t, completedAt: now() });
  write(HISTORY_KEY, history);
  return t;
}

export function deleteTask(id){
  // pure delete without history (not used, but handy)
  const tasks = getTasks().filter(t => t.id !== id);
  setTasks(tasks);
}

// --- History
export function getHistory() {
  // purge on read
  const list = read(HISTORY_KEY);
  const cutoff = now() - THIRTY_DAYS_MS;
  const fresh = list.filter(item => (item.completedAt ?? 0) >= cutoff);
  if (fresh.length !== list.length) write(HISTORY_KEY, fresh);
  return fresh;
}

export function recoverFromHistory(id){
  const hist = getHistory();
  const idx = hist.findIndex(h => h.id === id);
  if (idx === -1) return null;
  const [h] = hist.splice(idx, 1);
  write(HISTORY_KEY, hist);
  // Return the task to active list
  const tasks = getTasks();
  const recovered = { id: h.id, name: h.name, createdAt: now() };
  tasks.unshift(recovered);
  setTasks(tasks);
  return recovered;
}
export function removeFromHistory(id){
  const hist = getHistory().filter(h => h.id !== id);
  write(HISTORY_KEY, hist);
}