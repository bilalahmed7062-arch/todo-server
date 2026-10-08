import { pool } from '../db.js';

export const getAllTodos = async () => {
  const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
  return result.rows;
};

export const createTodo = async (text, priority = 'Medium', dueDate = null) => {
  const result = await pool.query(
    'INSERT INTO todos (text, priority, due_date, completed) VALUES ($1, $2, $3, $4) RETURNING *',
    [text, priority, dueDate || null, false]
  );
  return result.rows[0];
};

export const updateTodo = async (id, fields) => {
  const { text, completed, priority, due_date } = fields;
  
  // Dynamically build the update query for provided fields
  const updates = [];
  const values = [];
  let index = 1;

  if (text !== undefined) {
    updates.push(`text = $${index++}`);
    values.push(text);
  }
  if (completed !== undefined) {
    updates.push(`completed = $${index++}`);
    values.push(completed);
  }
  if (priority !== undefined) {
    updates.push(`priority = $${index++}`);
    values.push(priority);
  }
  if (due_date !== undefined) {
    updates.push(`due_date = $${index++}`);
    values.push(due_date || null);
  }

  if (updates.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE todos 
    SET ${updates.join(', ')} 
    WHERE id = $${index} 
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const deleteTodoById = async (id) => {
  const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
};

export const clearCompletedTodos = async () => {
  const result = await pool.query('DELETE FROM todos WHERE completed = true RETURNING *');
  return result.rowCount;
};