import { useState, useEffect, type FormEvent } from 'react';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Todo {
  id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  created_at?: string;
}

const API_BASE = 'http://localhost:5000/api/todos';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to load tasks');
      const data: Todo[] = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cannot reach backend server');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText.trim(), priority }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      const newTodo: Todo = await res.json();
      setTodos((prev) => [newTodo, ...prev]);
      setInputText('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error adding task');
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated: Todo = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating task');
    }
  };

  const deleteTodo = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting task');
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.length - completedCount;

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  const getPriorityBadge = (p: Priority): string => {
    switch (p) {
      case 'High':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-600">
            {completedCount} / {todos.length} Done
          </span>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-center">
            <span className="block text-xl font-bold text-emerald-600">{completedCount}</span>
            <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Completed</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-center">
            <span className="block text-xl font-bold text-amber-600">{pendingCount}</span>
            <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Pending</span>
          </div>
        </div>

        {/* Input Form with Priority Selector */}
        <form onSubmit={handleAddTodo} className="space-y-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition shrink-0 text-sm shadow-sm"
            >
              Add
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Priority:</span>
            {(['Low', 'Medium', 'High'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-2.5 py-1 rounded-md border font-medium transition ${
                  priority === p
                    ? 'bg-blue-50 border-blue-500 text-blue-600 font-semibold'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </form>

        {/* Filter Navigation */}
        <div className="flex border-b border-slate-200 mb-4 gap-4 text-xs font-medium">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-2 capitalize transition border-b-2 -mb-[1px] ${
                filter === tab
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs text-center mb-4">
            {error}
          </div>
        )}

        {/* Task List */}
        <ul className="space-y-2">
          {loading ? (
            <li className="text-center py-6 text-slate-400 text-sm">Loading tasks...</li>
          ) : filteredTodos.length === 0 ? (
            <li className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
              {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks.`}
            </li>
          ) : (
            filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition gap-2"
              >
                <button
                  type="button"
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className="flex items-center gap-3 cursor-pointer select-none flex-1 text-left overflow-hidden bg-transparent border-0 p-0"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    readOnly
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer pointer-events-none accent-blue-600"
                  />
                  <span
                    className={`truncate text-sm ${
                      todo.completed ? 'line-through text-slate-400' : 'text-slate-700'
                    }`}
                  >
                    {todo.text}
                  </span>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getPriorityBadge(
                      todo.priority || 'Medium'
                    )}`}
                  >
                    {todo.priority || 'Medium'}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-slate-400 hover:text-red-500 text-sm px-1.5 py-0.5 transition"
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

      </div>
    </main>
  );
}