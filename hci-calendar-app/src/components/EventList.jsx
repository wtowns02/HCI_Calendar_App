
export default function EventList({ events, selectedDate }) {
  const filteredEvents = events.filter(e => e.date === selectedDate);

  if (filteredEvents.length === 0) {
    return (
      <div className="empty-state">
        No events scheduled for this date
      </div>
    );
  }

  return (
    <ul className="event-list">
      {filteredEvents.map((event, index) => (
        <li key={index} className="event-item">
          <h3 className="event-title">{event.title}</h3>
          {event.time && <p className="event-time">🕒 {event.time}</p>}
          {event.description && <p className="event-desc">{event.description}</p>}
        </li>
      ))}
    </ul>
  );
}
