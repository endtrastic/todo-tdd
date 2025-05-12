const express = require('express');
const TodoController = require('../controllers/todo.contoller');
const router = express.Router();

router.post('/', TodoController.createTodo);
router.get('/', TodoController.getTodos);
router.get('/:todoId', TodoController.getTodoById);
router.put('/:todoId', TodoController.updateTodo);
router.delete('/:todoId', TodoController.deleteTodo);

module.exports = router;