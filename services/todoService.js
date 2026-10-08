import { pool } from '../db.js';

export const getAllTodos = async () => {
  const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
  return result.rows;
};

export const createTodo = async (text, priority = 'Medium') => {
  const result = await pool.query(
    'INSERT INTO todos (text, priority, completed) VALUES ($1, $2, $3) RETURNING *',
    [text, priority, false]
  );
  return result.rows[0];
};

export const updateTodoStatus = async (id, completed) => {
  const result = await pool.query(
    'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
    [completed, id]
  );
  return result.rows[0] || null;
};

export const deleteTodoById = async (id) => {
  const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
};