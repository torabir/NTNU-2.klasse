import express from 'express';
import listService from '../service/list-service';

const listRouter = express.Router();

// Get all lists
listRouter.get('/lists', (request, response) => {
    response.json(listService.lists);
});

// Get a specific list
listRouter.get('/lists/:listId', (request, response) => {
    const listId = request.params.listId;
    const list = listService.getList(listId);

    if (list) {
        response.json(list);
    } else {
        response.status(404).send(`List with id '${listId}' not found.`);
    }
});

// Create a new list
listRouter.post('/lists', (request, response) => {
    const list = request.body;

    if (!list.hasOwnProperty('id') ||
        !list.hasOwnProperty('title')) {
            response.status(400).send('A list needs the following properties: id and title.');
    }

    if (listService.addList(list)) {
         response.status(201);
         response.location('lists/' + list.id);
         response.send();
    } else {
        response.status(400).send(`A list with id '${list.id}' already exists.`);
    }
});

// Delete a list
listRouter.delete('/lists/:listId', (request, response) => {
    const listId = request.params.listId;

    if (!listService.deleteList(listId)) {
        response.status(404).send(`Failed to delete list with id '${listId}'. List not found.`);
    } else {
        response.json(listService.lists);
    }
});

export default listRouter;