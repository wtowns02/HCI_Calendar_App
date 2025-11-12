
import React, { useState, useMemo } from 'react';

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function formatISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function Calendar({ selectedDate, onSelectDate, items = [] }) {
  const [view, setView] = useState('month'); // month | week | day
  const cur = useMemo(() => {
    // Parse ISO date string properly to avoid timezone issues
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDate]);

  const monthStart = startOfMonth(cur);
  const monthEnd = endOfMonth(cur);

  const days = useMemo(() => {
    const firstWeekday = monthStart.getDay();
    const total = monthEnd.getDate();
    const arr = [];
    // pad start
    for (let i = 0; i < firstWeekday; i++) arr.push(null);
    for (let d = 1; d <= total; d++) arr.push(new Date(cur.getFullYear(), cur.getMonth(), d));
    return arr;
  }, [cur]);

  const goPrev = () => {
    if (view === 'month') {
      const newDate = new Date(cur.getFullYear(), cur.getMonth() - 1, 1);
      onSelectDate(formatISO(newDate));
    } else if (view === 'week') {
      const newDate = new Date(cur.getTime());
      newDate.setDate(newDate.getDate() - 7);
      onSelectDate(formatISO(newDate));
    } else {
      const newDate = new Date(cur.getTime());
      newDate.setDate(newDate.getDate() - 1);
      onSelectDate(formatISO(newDate));
    }
  };
  
  const goNext = () => {
    if (view === 'month') {
      const newDate = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
      onSelectDate(formatISO(newDate));
    } else if (view === 'week') {
      const newDate = new Date(cur.getTime());
      newDate.setDate(newDate.getDate() + 7);
      onSelectDate(formatISO(newDate));
    } else {
      const newDate = new Date(cur.getTime());
      newDate.setDate(newDate.getDate() + 1);
      onSelectDate(formatISO(newDate));
    }
  };

  const eventsByDate = useMemo(() => {
    const map = {};
    (items || []).forEach(i => {
      if (!i.date) return;
      map[i.date] = map[i.date] || [];
      map[i.date].push(i);
    });
    return map;
  }, [items]);

  return (
    <div className="calendar-widget">
      <div className="calendar-controls">
        <div>
          <button onClick={goPrev} className="icon-btn">◀</button>
          <strong className="month-label">{cur.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</strong>
          <button onClick={goNext} className="icon-btn">▶</button>
        </div>
        <div className="view-switch">
          <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Month</button>
          <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Week</button>
          <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Day</button>
        </div>
      </div>

      {view === 'month' && (
        <div className="month-grid">
          <div className="weekdays">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="weekday">{d}</div>)}
          </div>
          <div className="days-grid">
            {days.map((d, idx) => (
              <div
                key={idx}
                className={`day-cell ${d && formatISO(d) === selectedDate ? 'selected' : ''}`}
                onClick={() => d && onSelectDate(formatISO(d))}
              >
                {d ? (
                  <>
                    <div className="day-number">{d.getDate()}</div>
                    <div className="day-events">
                      {(eventsByDate[formatISO(d)] || []).slice(0,3).map((ev, i) => (
                        <div key={ev.id || i} className={`pill ${ev.kind}`}>{ev.title}</div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="week-view">
          <div className="week-days-row">
            {[...Array(7)].map((_, i) => {
              const d = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() - cur.getDay() + i);
              const iso = formatISO(d);
              const isToday = iso === formatISO(new Date());
              return (
                <div 
                  key={iso} 
                  className={`week-day ${iso === selectedDate ? 'selected' : ''} ${isToday ? 'today' : ''}`} 
                  onClick={() => onSelectDate(iso)}
                >
                  <div className="week-day-head">
                    <div className="week-day-name">{d.toLocaleDateString(undefined, {weekday:'short'})}</div>
                    <div className="week-day-date">{d.getDate()}</div>
                  </div>
                  <div className="week-day-body">
                    {(eventsByDate[iso] || []).length > 0 ? (
                      (eventsByDate[iso] || []).map(ev => (
                        <div key={ev.id} className={`week-pill ${ev.kind}`}>
                          <span className="week-pill-time">{ev.time || '—'}</span>
                          <span className="week-pill-title">{ev.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="week-empty">No items</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'day' && (
        <div className="day-view">
          <div className="day-title">{cur.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric', year:'numeric'})}</div>
          <div className="times">
            {Array.from({ length: 24 }).map((_, h) => {
              const hour = String(h).padStart(2, '0') + ':00';
              const iso = formatISO(cur);
              const events = (eventsByDate[iso] || []).filter(ev => ev.time && ev.time.startsWith(String(h).padStart(2,'0')));
              return (
                <div key={h} className="time-row">
                  <div className="time-label">{hour}</div>
                  <div className="time-slot">
                    {events.length > 0 ? (
                      events.map(ev => (
                        <div key={ev.id} className={`time-pill ${ev.kind}`}>
                          <span className="time-pill-time">{ev.time}</span>
                          <span className="time-pill-title">{ev.title}</span>
                        </div>
                      ))
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}