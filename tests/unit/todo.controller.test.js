const TodoController = require('../../controllers/todo.contoller')
const TodoModel = require('../../models/todo.model')
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/todo-create.json');
const allTodos = require('../mock-data/todo-get.json');



TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();



const todoId = '6819bf760cf0ddbfc9d373c7';

let req, res, next
beforeEach (() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
})


describe ('TodoController', () => {
    beforeEach(() => {
        req.body = newTodo;
    })
    it('should have a createTodo function', () => {
        expect(typeof TodoController.createTodo).toBe('function');
    })
    it('should call TodoModel.create', () => {
        req.body = newTodo;
        TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    })
    it('should return 201 response code', async () => {
        await TodoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    })
    it('should return json body in response', async () => {
        await TodoModel.create.mockReturnValue(newTodo);
        TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })
    it('should handle errors', async () => {
        const errorMessage = {message: 'Done property missing'};
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
    
})

describe('TodoController.getTodos', () => {
    it('should have a getTodos function', () => {
        expect(typeof TodoController.getTodos).toBe('function');
    })
    it('should call TodoModel.find({})', async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({});
    })
    it('should return respomse with status 200 and all todos', async () => {
        TodoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    })
    it('should handle errors in getTodos', async () => {
        const errorMessage = {message: 'Error in getTodos'};
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.find.mockReturnValue(rejectedPromise);
        await TodoController.getTodos(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
    
})
describe('TodoController.getTodoById', () => {
    it('should have a getTodoById function', () => {
        expect(typeof TodoController.getTodoById).toBe('function');
    })
    it('should call TodoModel.findById with route parameters', async () => {
        req.params.todoId = '6819bf760cf0ddbfc9d373c7';
        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toBeCalledWith(req.params.todoId);
    })
    it('should return json body and response code 200', async () => {
        TodoModel.findById.mockReturnValue(newTodo);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })
    it('should handle errors', async () => {
        const errorMessage = {message: 'Error finding getTodoById'};
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findById.mockReturnValue(rejectedPromise);
        await TodoController.getTodoById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
    it('should return 404 if no todo found', async () => {
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
})

describe('TodoController.updateTodo', () => {
    it('should have a updateTodo function', () => {
        expect(typeof TodoController.updateTodo).toBe('function');
    })
    it('should update with TodoModel.findByIdAndUpdate', async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        await TodoController.updateTodo(req, res, next);
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo,{
            new: true,
            useFindAndModify: false});
    });
    it('should return a response with json data and http code 200', async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    });

    it('should handle errors', async () => {
        const errorMessage = {message: "Error"}
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await TodoController.updateTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage)
    });
    it('should handle error 404', async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    });
})
describe('TodoController.deleteTodo', () => {
    it('should have a deleteTodo function', () => {
        expect(typeof TodoController.deleteTodo).toBe('function');
    })
    it('should call TodoModel.findByIdAndDelete', async () => {
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next);
        expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
    })
    it('should return a response with json data and http code 200', async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
        await TodoController.deleteTodo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    });
    it('should handle errors', async () => {
        const errorMessage = {message: 'Error in deleteTodo'};
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await TodoController.deleteTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
    it('should return 404 if no todo found', async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(null);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
})