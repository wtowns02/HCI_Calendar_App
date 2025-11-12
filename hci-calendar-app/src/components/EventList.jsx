
export default function EventList({ events, selectedDate, onToggleTodo }) {
  // events is expected to be an array of items (kind: event|todo|reminder)
  const filtered = (events || []).filter(e => e.date === selectedDate);

  if (!filtered || filtered.length === 0) {
    return <div className="empty-state">No items for this date</div>;
  }

  return (
    <ul className="event-list">
      {filtered.map((item) => (
        <li key={item.id} className={`event-item ${item.kind} ${item.completed ? 'completed' : ''}`}>
          {item.kind === 'todo' ? (
            <div className="todo-item-wrapper">
              <button 
                className="todo-checkbox"
                onClick={() => onToggleTodo && onToggleTodo(item.id)}
                aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {item.completed ? '✓' : ''}
              </button>
              <div className="todo-content">
                <h3 className="event-title">{item.title}</h3>
                {item.time && <p className="event-time">🕒 {item.time}</p>}
                {item.description && <p className="event-desc">{item.description}</p>}
              </div>
            </div>
          ) : (
            <>
              <h3 className="event-title">{item.title}</h3>
              {item.time && <p className="event-time">🕒 {item.time}</p>}
              {item.description && <p className="event-desc">{item.description}</p>}
              {item.kind === 'reminder' && <p className="reminder-note">🔔 Will notify at scheduled time</p>}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
