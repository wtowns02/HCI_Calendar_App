import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import EventList from './components/EventList';
import AddEventModal from './components/AddEventModal';
import { loadEvents, saveEvents } from './utils/storage';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const handleAddEvent = (event) => {
    setEvents([...events, event]);
  };

  return (
    <div className="App">
      <header>
        <h1>Personal Planner</h1>
        <p>Organize your events, tasks, and reminders in one place</p>
        <button onClick={() => setIsModalOpen(true)}>+ Add Event</button>
      </header>

      <main>
        <div className="left">
          <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
        <div className="right">
          <EventList events={events} selectedDate={selectedDate} />
        </div>
      </main>

      {isModalOpen && (
        <AddEventModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleAddEvent}
        />
      )}
    </div>
  );
}

export default App;
