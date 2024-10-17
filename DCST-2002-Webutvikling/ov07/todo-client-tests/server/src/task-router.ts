import express from 'express';
import taskService from './task-service';
import childProcess from 'child_process'; // Legg til import for å kjøre kommandoer

/**
 * Express router containing task methods.
 */
const router = express.Router();


router.get('/tasks', (_request, response) => {
  taskService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/tasks/:id', (request, response) => {
  const id = Number(request.params.id);
  taskService
    .get(id)
    .then((task) => (task ? response.send(task) : response.status(404).send('Task not found')))
    .catch((error) => response.status(500).send(error));
});

router.post('/tasks', (request, response) => {
  const data = request.body;
  if (data && data.title && data.title.length != 0)
    taskService
      .create(data.title)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing task title');
});

router.delete('/tasks/:id', (request, response) => {
  taskService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

// NYTT ENDPOINT for å kjøre kode i Docker-container

// Endepunkt for å kjøre kode
router.post('/run', (req, res) => {
  if (typeof req.body.language == 'string' && typeof req.body.source == 'string') {
    let stdout = '';
    let stderr = '';

    // Docker-kommando for å kjøre JavaScript-kode (Node.js-image)
    const process = childProcess.spawn('docker', [
      'run',
      '--rm',
      'node:latest',  // Bruk det nyeste Node.js image
      'node',
      '-e',  // Kjør inline JavaScript-kode
      req.body.source,
    ]);

    process.stdout.on('data', (data) => {
      stdout += data;
    });

    process.stderr.on('data', (data) => {
      stderr += data;
    });

    process.on('close', (exitStatus: number) => {
      res.send({ exitStatus: exitStatus, stdout: stdout, stderr: stderr });
    });
  } else {
    res.status(400).send('Missing properties');
  }
});

export default router;