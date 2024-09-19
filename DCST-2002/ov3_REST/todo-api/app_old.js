//Importer avhengigheter
import express from 'express';
import {tasks, lists} from './data';
import routes from './routes';

// Initialiserer appen vår
const app = express();
// Gjør det mulig å tolke json i body-elementet til en forespørsel
app.use(express.json());


// Forteller oss at webtjeneren skal lytte på port 3000. 
// Startpunktet for vår lokale webtjener blir da http://localhost:3000
const PORT = 3000;
app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
});


// Første endepunkt. 
// Her definerer vi et endepunkt (app.get) som henter ut alle opppgavene 
// fra listen tasks. 
// Rute: /api/v1/tasks. 
// Responsen vil inneholde oppgavene i json-format.
app.get('/api/v1/tasks', (request, response) => {
    response.json(tasks);
});

// Utvider for å kunne hente ut en bestemt oppgave basert på id
app.get('/api/v1/tasks/:id', (request, response) => {
    const id = request.params.id;
    const task = tasks.find(t => t.id == id);
    
    if (task) {
        response.json(task);
    } else {
        response.status(404).send(`Task with id '${id}' not found.`);
    }
});

// Denne route-handleren håndterer POST-forespørsler til '/api/v1/tasks', 
// og legger til en ny oppgave i 'tasks'-listen hvis
// den har de nødvendige egenskapene ('id', 'title' og 'done'), 
// og hvis det ikke allerede finnes en oppgave med samme id.

app.post('/api/v1/tasks', (request, response) => {
    const task = request.body; // Henter oppgave-objektet fra forespørselens body
    
    // Sjekker om oppgaveobjektet inneholder de nødvendige egenskapene: 
    // 'id', 'title' og 'done'
    if (!task.hasOwnProperty('id') ||
        !task.hasOwnProperty('title') || 
        !task.hasOwnProperty('done')) {
            // Returnerer en 400 Bad Request hvis en av egenskapene mangler, 
            // med en beskrivelse av problemet
            return response.status(400).send('A task needs the following properties: id, title and done.');
    }
    
    // Sjekker om en oppgave med samme id allerede eksisterer
    if (tasks.find(t => t.id == task.id)) {
        // Returnerer en 400 Bad Request hvis en oppgave med samme id allerede finnes
        response.status(400).send(`A task with id '${task.id}' already exists.`);
    } else {
        // Legger til den nye oppgaven i tasks-listen hvis id-en er unik
        tasks.push(task);
        // Angir statuskode 201 Created
        response.status(201);
        // Angir Location-headeren med URL-en til den nye oppgaven
        response.location('tasks/' + task.id);
        // Sender en tom respons for å fullføre forespørselen
        response.send();
    }
});

// Denne route-handleren håndterer DELETE-forespørsler til '/api/v1/tasks/:id', 
// og sletter en oppgave med en spesifikk id fra 'tasks'-listen hvis den finnes.
app.delete('/api/v1/tasks/:id', (request, response) => {
    const id = request.params.id; // Henter id fra URL-parametrene
    
    // Finner indeksen til oppgaven med gitt id i 'tasks'-listen
    const index = tasks.findIndex(t => t.id == id); 
    
    // Hvis oppgaven med gitt id finnes
    if (index != -1) {
        // Fjerner oppgaven fra 'tasks'-listen
        tasks.splice(index, 1);
        // Returnerer den oppdaterte listen med oppgaver i JSON-format
        response.json(tasks);
    } else {
        // Hvis oppgaven ikke finnes, returneres en 404 Not Found med en feilmelding
        response.status(404).send(`Failed to delete task with id '${id}'. Task not found.`);
    }
});

