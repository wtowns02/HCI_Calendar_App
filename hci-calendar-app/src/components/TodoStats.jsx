export default function TodoStats({ todos }) {
  const total = todos.length;
  const pending = todos.filter(t => !t.completed).length;
  const completed = todos.filter(t => t.completed).length;
  const highPriority = todos.filter(t => t.priority === 'High').length;

  return (
    <div className="todo-dashboard">
      <div className="todo-box">
        <div className="num">{total}</div>
        <p>Total Tasks</p>
      </div>

      <div className="todo-box">
        <div className="num orange">{pending}</div>
        <p>Pending</p>
      </div>

      <div className="todo-box">
        <div className="num green">{completed}</div>
        <p>Completed</p>
      </div>

      <div className="todo-box">
        <div className="num red">{highPriority}</div>
        <p>High Priority</p>
      </div>
    </div>
  );
}
