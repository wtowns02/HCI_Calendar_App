
export default function Calendar({ selectedDate, onSelectDate }) {
  return (
    <div className="calendar">
      <label>Select a date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onSelectDate(e.target.value)}
      />
    </div>
  );
}