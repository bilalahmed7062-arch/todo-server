import { Router } from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  removeTodo,
  clearCompleted,
} from '../controllers/todoController.js';

const router = Router();

router.get('/', getTodos);
router.post('/', createTodo);
router.delete('/completed', clearCompleted);
router.put('/:id', updateTodo);
router.patch('/:id', updateTodo);
router.delete('/:id', removeTodo);

export default router;