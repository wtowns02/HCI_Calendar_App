import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import EventList from './components/EventList';
import AddEventModal from './components/AddEventModal';
import TodoStats from './components/TodoStats';
import TodoFilters from './components/TodoFilters';
import { loadItems, saveItems } from './utils/storage';
import './App.css';

// get today's date in year/month/day format and set as default instead of blank
function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// format selected date to "month day, year" (easier to read)
function formatDateLong(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  // create local date (prevents 1-day shift from UTC)
  const localDate = new Date(y, m - 1, d);
  return localDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function App() {
  const [items, setItems] = useState(() => loadItems() ?? []);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [isModalOpen, setIsModalOpen] = useState(false);
  // keep track of which tab user is viewing
  const [tab, setTab] = useState(`calendar`);
  const [todoFilter, setTodoFilter] = useState(`all`)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    saveItems(items);
  }, [items]);

  // close modal when tab changes
  useEffect(() => {
    setIsModalOpen(false);
  }, [tab]);

  const handleAddEvent = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const handleToggleTodo = (id) => {
    setItems((prev) => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  // dynamic button label
  const createButtonLabel = {
    calendar: '+ Create Calendar Event',
    todo: '+ Create To-Do Item',
    reminders: '+ Create Reminder'
  }[tab] || '+ Create';

  // reminder handling
  const [currentReminder, setCurrentReminder] = useState(null);

  // play beep using WebAudio
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 700);
    } catch (e) { console.warn('beep failed', e); }
  };

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const due = items.filter(i => i.kind === 'reminder' && i.date).filter(i => {
        // compute reminder datetime
        const [y,m,d] = i.date.split('-').map(Number);
        const t = i.time ? i.time : '00:00';
        const [hh,mm] = t.split(':').map(Number);
        const dt = new Date(y, m - 1, d, hh || 0, mm || 0, 0);
        return dt <= now && (!i._notified);
      });
      if (due.length > 0 && !currentReminder) {
        // pick first due
        const r = due[0];
        setCurrentReminder(r);
        playBeep();
        // mark as notified in-memory until user acts
        setItems(prev => prev.map(it => it.id === r.id ? { ...it, _notified: true } : it));
      }
    };

    const id = setInterval(checkReminders, 30 * 1000); // every 30s
    // run immediately
    checkReminders();
    return () => clearInterval(id);
  }, [items, currentReminder]);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>EasyPlan</h1>
          <p>Organize your events, tasks, and reminders in one place</p>
        </div>
        <button
          className="btn-primary"
          type="button"
          onClick={() => {
            setIsModalOpen(true)
            setEditingItem(null)
          }}
        >
          {createButtonLabel}
        </button>
      </header>

      <nav
        className="tabs"
        role="tablist"
      >
        <button
          role="tab"
          className={`tab ${tab === `calendar` ? `active` : ``}`}
          onClick={() => setTab('calendar')}
        >
          Calendar
        </button>

        <button
          role="tab"
          className={`tab ${tab === `todo` ? `active` : ``}`}
          onClick={() => setTab('todo')}
        >
          To-Do List
        </button>

        <button
          role="tab"
          className={`tab ${tab === `reminders` ? `active` : ``}`}
          onClick={() => setTab('reminders')}
        >
          Reminders
        </button>
      </nav>

      {tab === 'calendar' && (
        <main className="grid-2">
          {/*left calendar section*/}
          <section className="card">
            <h2 className="card-title">Calendar</h2>
            <div className="card-body">
              <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} items={items} />
            </div>
          </section>

          {/*right section with events for selected date*/}
          <section className="card">
            <h2 className="card-title">
              Events for {formatDateLong(selectedDate) ?? 'selected date'}
            </h2>
            <div className="card-body">
              <EventList 
                events={items} 
                selectedDate={selectedDate} 
                onToggleTodo={handleToggleTodo}
                onDelete={(id) => setItems(prev => prev.filter(i => i.id !== id))}
                setEditingItem={setEditingItem} 
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          </section>
        </main>
      )}

      {/*To-do list tab with date selector*/}
      {tab === 'todo' && (() => {

  const todos = items.filter(i => 
  i.kind === 'todo' && i.date === selectedDate
);

  // filtered output
  const filteredTodos = (() => {
    if (todoFilter === 'pending') return todos.filter(i => !i.completed);
    if (todoFilter === 'completed') return todos.filter(i => i.completed);
    if (todoFilter === 'high') return todos.filter(i => i.priority === 'High');
    return todos;
  })();

  return (
    <section className="card mt">

      {/* Stats */}
      <TodoStats todos={todos} />

      {/* Filter buttons */}
      <TodoFilters
        todos={todos}
        todoFilter={todoFilter}
        setTodoFilter={setTodoFilter}
      />

      {/* Date selector */}
      <div className="card-header-with-date">
        <h2 className="card-title">To-Do List</h2>
        <div className="date-selector">
          <label htmlFor="todo-date">Date:</label>
          <input 
            id="todo-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      {/* To-do list */}
      <div className="card-body">
        <EventList
          events={filteredTodos}
          selectedDate={selectedDate}
          onToggleTodo={handleToggleTodo}
          onDelete={(id) => setItems(prev => prev.filter(i => i.id !== id))}
          setEditingItem={setEditingItem} 
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </section>
  );
})()}

      {tab === `reminders` && (
        <section className="card mt">
          <div className="card-header-with-date">
            <h2 className="card-title">Reminders</h2>
            <div className="date-selector">
              <label htmlFor="reminder-date">Date:</label>
              <input 
                id="reminder-date"
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
          <div className="card-body">
            <p className="date-display">Items for {formatDateLong(selectedDate)}</p>
            <EventList 
              events={items.filter(i => i.kind === 'reminder')} 
              selectedDate={selectedDate} 
              onToggleTodo={handleToggleTodo}
              onDelete={(id) => setItems(prev => prev.filter(i => i.id !== id))}
              setEditingItem={setEditingItem} 
              setIsModalOpen={setIsModalOpen} 
            />
          </div>
        </section>
      )}

    {isModalOpen && (
      <AddEventModal
        onClose={() => {
          setEditingItem(null);            
          setIsModalOpen(false);
        }}
        existingItem={editingItem}         
        onCreate={handleAddEvent}
        onUpdate={(updated) => {           
          setItems(prev => prev.map(item =>
            item.id === updated.id ? updated : item
          ));
        }}
        defaultDate={selectedDate}
        defaultKind={
          editingItem 
            ? editingItem.kind 
            : (tab === 'calendar' ? 'event' : tab === 'todo' ? 'todo' : 'reminder')
        }                   
/>

    )}        {/* Reminder popup */}
        {currentReminder && (
          <div className="reminder-popup">
            <div className="reminder-inner">
              <h3>Reminder</h3>
              <p><strong>{currentReminder.title}</strong></p>
              {currentReminder.description && <p className="muted">{currentReminder.description}</p>}
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <button onClick={() => {
                  // dismiss -> remove reminder
                  setItems(prev => prev.filter(i => i.id !== currentReminder.id));
                  setCurrentReminder(null);
                }}>
                  Dismiss
                </button>
                <button onClick={() => {
                  // snooze 1 hour
                  setItems(prev => prev.map(i => {
                    if (i.id !== currentReminder.id) return i;
                    // compute new date/time +1 hour
                    const [y,m,d] = i.date.split('-').map(Number);
                    const [hh,mm] = (i.time || '00:00').split(':').map(Number);
                    const dt = new Date(y, m-1, d, hh, mm);
                    dt.setHours(dt.getHours() + 1);
                    const newDate = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
                    const newTime = `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
                    return { ...i, date: newDate, time: newTime, _notified: false };
                  }));
                  setCurrentReminder(null);
                }}>
                  Snooze 1h
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
