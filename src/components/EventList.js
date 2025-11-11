import React from 'react';

export default function EventList({ events, selectedDate }) {
  const filtered = events.filter(e => e.date === selectedDate);

  return (
    <div className="event-list">
      <h3>Events for {selectedDate || '...'}</h3>
      {filtered.length === 0 ? (
        <p>No events scheduled for this date</p>
      ) : (
        <ul>
          {filtered.map((e, i) => (
            <li key={i}>
              <strong>{e.title}</strong> - {e.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
