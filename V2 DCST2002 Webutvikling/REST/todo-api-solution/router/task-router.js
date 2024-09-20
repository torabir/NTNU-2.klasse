import express from 'express';
import taskService from '../service/task-service';

const taskRouter = express.Router();

// Get all tasks in a list
taskRouter.get('/lists/:listId/tasks', (request, response) => {
    const listId = request.params.listId;
    response.json(taskService.getTasksInList(listId));
});

// Get a specific task in a list
taskRouter.get('/lists/:listId/tasks/:taskId', (request, response) => {
    const listId = request.params.listId;
    const taskId = request.params.taskId;
    const task = taskService.getTask(listId, taskId);

    if (task) {
        response.json(task);
    } else {
        response.status(404).send(`Task with id '${taskId}' not found.`);
    }
});

// Create a new task in a list
taskRouter.post('/lists/:listId/tasks', (request, response) => {
    const task = request.body;

    if (!task.hasOwnProperty('id') ||
        !task.hasOwnProperty('title') || 
        !task.hasOwnProperty('done') ||
        !task.hasOwnProperty('listId')) {
            response.status(400).send('A task needs the following properties: id, title, done and listId.');
    } else {
        if (taskService.addTask(task)) {
            response.status(201);
            response.location('lists/' + task.listId + '/tasks/' + task.id);
            response.send();
        } else {
            response.status(400).send(`A task with id '${task.id}' already exists.`);
        }
    }
});

// Delete a specific task in a list
taskRouter.delete('/lists/:listId/tasks/:taskId', (request, response) => {
    const listId = request.params.listId;
    const taskId = request.params.taskId;
    if (!taskService.deleteTask(listId, taskId)) {
        response.status(404).send(`Failed to delete task with id '${taskId}'. Task not found.`);
    } else {
        response.json(taskService.getTasksInList(listId));
    }
});

export default taskRouter;