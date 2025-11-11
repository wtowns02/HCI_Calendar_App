import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import EventList from './components/EventList';
import AddEventModal from './components/AddEventModal';
import { loadEvents, saveEvents } from './utils/storage';
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
  const [events, setEvents] = useState(() => loadEvents() ?? []);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [isModalOpen, setIsModalOpen] = useState(false);
  // keep track of which tab user is viewing
  const [tab, setTab] = useState(`calendar`);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const handleAddEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

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
          onClick={() => setIsModalOpen(true)}
        >
          + Add Event
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
              <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>
          </section>

          {/*right section with events for selected date*/}
          <section className="card">
            <h2 className="card-title">
              Events for {formatDateLong(selectedDate) ?? 'selected date'}
            </h2>
            <div className="card-body">
              <EventList events={events} selectedDate={selectedDate} />
            </div>
          </section>
        </main>
      )}

      {/*Placeholder for To-do list tab*/}
      {tab === `todo` && (
        <section className="card mt">
          <h2 className="card-title">To-Do List</h2>
          <div className="card-body muted">Still not done</div>
        </section>
      )}

      {/*Placeholder for Reminders tab*/}
      {tab === `reminders` && (
        <section className="card mt">
          <h2 className="card-title">Reminders</h2>
          <div className="card-body muted">Still not done</div>
        </section>
      )}

      {isModalOpen && (
        <AddEventModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleAddEvent}
          defaultDate={selectedDate}
        />
      )}
    </div>
  );
}
