import React, { useState, useEffect } from 'react';

// Modal to create an item: event, todo, or reminder
export default function AddEventModal({ onClose, onCreate, defaultDate, defaultKind = 'event' }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate || '');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [kind, setKind] = useState(defaultKind);
  // priority for the to-do list
  const [priority, setPriority] = useState(`Medium`);

  useEffect(() => {
    if (defaultDate) setDate(defaultDate);
  }, [defaultDate]);

  useEffect(() => {
    setKind(defaultKind);
  }, [defaultKind]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      kind,
      title,
      date,
      time: time || undefined,
      description
    };
    if (kind === 'todo') item.completed = false;
    item.priority = priority;
    onCreate(item);
    onClose();
  };

  const kindLabels = {
    event: 'Calendar Event',
    todo: 'To-Do Item',
    reminder: 'Reminder'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create {kindLabels[kind]}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Type</label>
            <div className="kind-selector">
              <button
                type="button"
                className={`kind-option ${kind === 'event' ? 'active' : ''}`}
                onClick={() => setKind('event')}
              >
                <span className="kind-icon">📅</span>
                <span className="kind-label">Event</span>
              </button>
              <button
                type="button"
                className={`kind-option ${kind === 'todo' ? 'active' : ''}`}
                onClick={() => setKind('todo')}
              >
                <span className="kind-icon">📝</span>
                <span className="kind-label">To-Do</span>
              </button>
              <button
                type="button"
                className={`kind-option ${kind === 'reminder' ? 'active' : ''}`}
                onClick={() => setKind('reminder')}
              >
                <span className="kind-icon">🔔</span>
                <span className="kind-label">Reminder</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder={`What's your ${kindLabels[kind].toLowerCase()}?`}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="form-input" />
            </div>

            <div className="form-group">
              <label>Time (optional)</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add more details..."
              className="form-textarea"
              rows={3}
            />
          </div>

          {kind === 'todo' && (
            <div className='form-group'>
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className='form-input'
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-submit">Create {kindLabels[kind]}</button>
          </div>
        </form>
      </div>
    </div>
  );
}