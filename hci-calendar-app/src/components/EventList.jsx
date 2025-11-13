export default function EventList({ events, selectedDate, onToggleTodo, onDelete, setEditingItem, setIsModalOpen }) { 
  const filtered = (events || []).filter(e => e.date === selectedDate);

function formatTime12Hour(timeString) {
  if (!timeString) return '';
  const [hourStr, minuteStr] = timeString.split(':');
  let hour = parseInt(hourStr, 10);
  const minutes = minuteStr.padStart(2, '0');

  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${hour}:${minutes} ${ampm}`;
}

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

                <div className="todo-header-row">
                  <h3 className="event-title">{item.title}</h3>

                  {item.priority && (
                    <span className={`priority-pill ${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </span>
                  )}

                  <div className="todo-actions">
                    
                    <button 
                      className="icon-btn-small" 
                      aria-label="Edit"
                      onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                    >
                      <b>✏️</b>
                    </button>

                    <button 
                      className="icon-btn-small delete" 
                      aria-label="Delete"
                      onClick={() => onDelete && onDelete(item.id)}
                    >
                      <b>🗑</b>
                    </button>
                  </div>

                </div>

                {item.time && <p className="event-time">🕒 {formatTime12Hour(item.time)}</p>}
                {item.description && <p className="event-desc">{item.description}</p>}
              </div>
            </div>

          ) : (
            <>
              <div className="event-header-row">
                <h3 className="event-title">{item.title}</h3>

                <div className="todo-actions">
                  <button 
                    className="icon-btn-small" 
                    aria-label="Edit"
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                  >
                    <b>✏️</b>
                  </button>

                  <button 
                    className="icon-btn-small delete"
                    aria-label="Delete"
                    onClick={() => onDelete && onDelete(item.id)}
                  >
                    <b>🗑</b>
                  </button>
                </div>
              </div>

              {item.time && <p className="event-time">🕒 {formatTime12Hour(item.time)}</p>}
              {item.description && <p className="event-desc">{item.description}</p>}
              {item.kind === 'reminder' && (
                <p className="reminder-note">🔔 Will notify at scheduled time</p>
              )}
            </>
          )}

        </li>
      ))}
    </ul>
  );
}
