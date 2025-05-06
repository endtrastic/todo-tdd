const TodoController = require('../../controllers/todo.contoller')

describe ('TodoController', () => {
    it('should have a createTodo function', () => {
        expect(typeof TodoController.createTodo).toBe('function');
    })
})