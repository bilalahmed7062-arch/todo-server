import * as todoService from '../services/todoService.js';

export const getTodos = async (req, res) => {
  try {
    const todos = await todoService.getAllTodos();
    res.json(todos);
  } catch (err) {
    console.error('getTodos error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { text, priority, due_date } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Task text is required' });
    }

    const newTodo = await todoService.createTodo(text.trim(), priority, due_date);
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('createTodo error:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await todoService.updateTodo(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: 'Task not found or no changes made' });
    }

    res.json(updated);
  } catch (err) {
    console.error('updateTodo error:', err.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const removeTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await todoService.deleteTodoById(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('removeTodo error:', err.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const clearCompleted = async (req, res) => {
  try {
    const count = await todoService.clearCompletedTodos();
    res.json({ message: `Cleared ${count} completed tasks`, count });
  } catch (err) {
    console.error('clearCompleted error:', err.message);
    res.status(500).json({ error: 'Failed to clear completed tasks' });
  }
};