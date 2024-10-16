import express from 'express';
import taskService from './task-service';

/**
 * Express router containing task methods.
 */
const router = express.Router();

// Henter alle oppgaver
router.get('/tasks', (_request, response) => {
  taskService
    .getAll() // Kaller getAll service for å hente alle oppgaver
    .then((rows) => response.send(rows)) // Sender alle tasks som svar
    .catch((error) => response.status(500).send(error)); // Feilhåndtering
});

// Henter en spesifikk oppgave ved ID
router.get('/tasks/:id', (request, response) => {
  const id = Number(request.params.id); // Konverterer ID fra URL til et tall
  taskService
    .get(id) // Kaller get service for å hente oppgave med gitt ID
    .then((task) => (task ? response.send(task) : response.status(404).send('Task not found'))) // Sender tasken eller 404 hvis tasken ikke finnes
    .catch((error) => response.status(500).send(error)); // Feilhåndtering
});

// Oppretter en ny oppgave
router.post('/tasks', (request, response) => {
  const data = request.body; // Henter oppgave-data fra forespørselen
  if (data && data.title && data.title.length != 0) { // Sjekker at tittelen ikke er tom
    taskService
      .create(data.title) // Kaller create service for å opprette oppgaven
      .then((id) => response.send({ id: id })) // Sender tilbake ID-en til den opprettede tasken
      .catch((error) => response.status(500).send(error)); // Feilhåndtering
  } else {
    response.status(400).send('Missing task title'); // Returnerer feil hvis tittelen mangler
  }
});

// Sletter en oppgave med gitt ID
router.delete('/tasks/:id', (request, response) => {
  taskService
    .delete(Number(request.params.id)) // Kaller delete service for å slette oppgaven med gitt ID
    .then((_result) => response.sendStatus(200)) // Sender svar hvis sletting er vellykket
    .catch((error) => response.status(500).send(error)); // Feilhåndtering
});

      // A
/**
 * PUT-rute for å oppdatere oppgave basert på ID.
 * Forventet request body: { done: true/false }
 */ 

router.put('/tasks/:id', (request, response) => {
  const id = Number(request.params.id);
  const { done } = request.body;

  console.log('Received PUT request for task:', { id, done });  // Legg til logging her for å bekrefte dataen

  if (typeof done === 'boolean') {
    taskService
      .get(id)
      .then((task) => {
        if (!task) return response.status(404).send('Task not found');

        const updatedTask = { ...task, done: done };

        taskService.update(updatedTask)
          .then(() => response.sendStatus(200))
          .catch((error) => response.status(500).send(error));
      })
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Invalid data');
  }
});


// GAMMEL: 
// router.put('/tasks/:id', (request, response) => {
//   const id = Number(request.params.id);
//   const task = request.body;

//   taskService
//     .update(id, task)
//     .then(() => response.sendStatus(200))
//     .catch((error) => response.status(500).send(error));
// });

export default router;
