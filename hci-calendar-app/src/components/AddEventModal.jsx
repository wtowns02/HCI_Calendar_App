import React, { useState } from 'react';

export default function AddEventModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    onCreate({ title, date, description });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Event</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}