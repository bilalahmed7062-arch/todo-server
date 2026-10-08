import { Router } from 'express';
import {
  getTodos,
  createTodo,
  toggleTodo,
  removeTodo,
} from '../controllers/todoController.js';

const router = Router();

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', toggleTodo);
router.delete('/:id', removeTodo);

export default router;