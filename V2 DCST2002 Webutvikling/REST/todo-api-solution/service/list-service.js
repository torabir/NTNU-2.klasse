import List from '../model/list';
import taskService from '../service/task-service';

class ListService {

    constructor() {
        //populate with test data.
        this.lists = [
            new List("school", "School"),
            new List("chores", "Chores")
        ];
    }

    getList(listId) {
        const index = this.lists.findIndex(list => list.id === listId);
        return this.lists[index];
    }

    // Returns true if the list was added, false otherwise.
    addList(list) {
        if (this.indexOf(list.id) !== -1) {
            return false;
        } else {
            this.lists.push(list);
            return true;
        }
    }

    // Returns true if the list was updated, false otherwise.
    updateList(list) {
        const index = this.indexOf(list.id);
        if (index !== -1) {
            this.lists[index] = list;
            return true;
        } else {
            return false;
        }
    }

    // Returns true if the list was deleted, false otherwise.
    deleteList(listId) {
        //delete tasks connected to list.
        taskService.deleteTasksInList(listId);

        //delete list
        const index = this.indexOf(listId); 
        if (index !== -1) {
            this.lists.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    // Returns the index if the task exists, -1 otherwise.
    indexOf(listId) {
        return this.lists.findIndex(list => list.id === listId);
    }
}

const listService = new ListService();
export default listService;