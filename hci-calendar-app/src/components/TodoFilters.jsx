export default function TodoFilters({ todos, todoFilter, setTodoFilter }) {
  const total = todos.length;
  const pending = todos.filter(t => !t.completed).length;
  const completed = todos.filter(t => t.completed).length;
  const highPriority = todos.filter(t => t.priority === 'High').length;

  return (
    <div className="todo-filters">
      <button
        className={todoFilter === 'all' ? 'active' : ''}
        onClick={() => setTodoFilter('all')}
      >
        All <span>{total}</span>
      </button>

      <button
        className={todoFilter === 'pending' ? 'active' : ''}
        onClick={() => setTodoFilter('pending')}
      >
        Pending <span>{pending}</span>
      </button>

      <button
        className={todoFilter === 'completed' ? 'active' : ''}
        onClick={() => setTodoFilter('completed')}
      >
        Completed <span>{completed}</span>
      </button>

      <button
        className={todoFilter === 'high' ? 'active' : ''}
        onClick={() => setTodoFilter('high')}
      >
        High Priority <span>{highPriority}</span>
      </button>
    </div>
  );
}
