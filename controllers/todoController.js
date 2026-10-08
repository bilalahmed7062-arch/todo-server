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
    const { text, priority } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Task text is required' });
    }

    const newTodo = await todoService.createTodo(text.trim(), priority);
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('createTodo error:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be a boolean' });
    }

    const updated = await todoService.updateTodoStatus(id, completed);
    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('toggleTodo error:', err.message);
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