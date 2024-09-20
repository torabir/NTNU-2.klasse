import Task from '../model/task';
import List from '../model/list';

class TaskService {

    constructor() {
        //populate with test data.
        this.tasks = [
            new Task(1, "Les leksjon", false, "school"),
            new Task(2, "Møt opp på forelesning", false, "school"),
            new Task(3, "Gjør øving", false, "school"),
            new Task(1, "Lag middag", false, "chores"),
            new Task(2, "Gjør husarbeid", false, "chores")
        ];
    }

    // Get single task in list
    getTask(listId, taskId) {
        return this.tasks[this.indexOf(listId, taskId)];
    }

    // Get all tasks in list
    getTasksInList(listId) {
        return this.tasks.filter(task => task.listId === listId);
    }

    // Returns true if the task was added, false otherwise.
    addTask(task) {
        if (this.indexOf(task.listId, task.id) !== -1) {
            return false;
        } else {
            this.tasks.push(task);
            return true;
        }
    }

    // Returns true if the task was updated, false otherwise.
    updateTask(task) {
        const index = this.indexOf(task.listId, task.id);
        if (index !== -1) {
            this.tasks[index] = task;
            return true;
        } else {
            return false;
        }
    }

    // Returns true if the task was removed, false otherwise.
    deleteTask(listId, taskId) {
        const index = this.indexOf(listId, taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    // Delete all tasks for a given list.
    deleteTasksInList(listId) {
        const tasksToBeDeleted = this.tasks.filter((task) => (task.listId === listId));
        tasksToBeDeleted.forEach((task) => this.deleteTask(listId, task.id));
    }

    // Returns the index if the task exists, -1 otherwise.
    indexOf(listId, taskId) {
        return this.tasks.findIndex(task => (task.listId === listId) && (task.id == taskId));
    }
}

const taskService = new TaskService();
export default taskService;