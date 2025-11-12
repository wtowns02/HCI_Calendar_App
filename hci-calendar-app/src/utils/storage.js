// Simple client-side storage for items (events, todos, reminders)
// Each item shape: { id, kind: 'event'|'todo'|'reminder', title, date: 'YYYY-MM-DD', time?: 'HH:MM', description?, completed?:bool }
const STORAGE_KEY = 'plannerItems_v1';

export const loadItems = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('loadItems error', e);
    return [];
  }
};

export const saveItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('saveItems error', e);
  }
};

// convenience helpers kept for backward compatibility
export const loadEvents = () => loadItems().filter(i => i.kind === 'event');
export const saveEvents = (events) => {
  // merge events back into items - but simplest is to replace all event-kind items
  const items = loadItems().filter(i => i.kind !== 'event');
  saveItems([...items, ...events.map(e => ({ ...e, kind: 'event' }))]);
};

export default { loadItems, saveItems };