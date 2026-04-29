# To-do Administration App

A lightweight browser-based to-do application with task management, history tracking, and local persistence.

## Project Structure

- `index.html`
  - Main app page for active tasks.
  - Contains the task input form, task list, and status summary.
  - Loads `js/app.js` as a module.

- `history.html`
  - History page for completed tasks.
  - Allows recovering tasks to the active list or permanently deleting them.
  - Loads `js/history.js` as a module.

- `style.css`
  - Application styling for layout, buttons, cards, alerts, and responsive behavior.

- `js/`
  - `app.js`
    - Handles user interactions on `index.html`.
    - Adds tasks, edits task names, completes tasks, deletes tasks, and re-renders the active list.
    - Shows alerts for feedback.
  - `history.js`
    - Handles the completed-task history page.
    - Renders history items, recovers tasks, deletes individual history entries, and clears history.
    - Uses a confirmation modal for destructive actions.
  - `storage.js`
    - Manages `localStorage` persistence for active tasks and history.
    - Exposes APIs: `getTasks`, `addTask`, `renameTask`, `completeTask`, `deleteTask`, `getHistory`, `recoverFromHistory`, `removeFromHistory`, and `clearHistory`.
    - Automatically purges history older than 30 days.
  - `dom.js`
    - Provides minimal DOM helper utilities: `$(selector)` and `showAlert(element, message, duration)`.

## How It Works

### Active Tasks (`index.html`)

- Users type a task and click **Add Task**.
- Tasks are saved to `localStorage` and displayed immediately.
- Each task can be:
  - Edited inline.
  - Marked as completed, which moves it to history.
  - Deleted permanently.
- The active task count updates with every change.

### Completed Task History (`history.html`)

- Completed tasks appear in the history list.
- Tasks are preserved for up to **30 days** after completion.
- From history, users can:
  - Recover a task back to the active list.
  - Delete a history item permanently.
  - Clear the entire history.

## Notes

- Data is stored in the browser using `localStorage`, so tasks persist across refreshes and page reloads.
- Task history cleanup happens automatically when the history list is loaded.

## Running the App

Open `index.html` in a browser to use the task view, or open `history.html` to manage completed tasks.
