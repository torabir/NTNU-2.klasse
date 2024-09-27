// -- Steg for å flytte tasks fra app.js og hit: 
//1. Importer express og opprett en ny router med express.Router(). 
    // const router = express.Router();
//2. Bytt ut app.METHOD (som f.eks. app.get, app.post, etc.) med router.METHOD.
//3. Eksporter routeren med export default router; slik at den kan importeres og brukes i app.js.
    // export default router;  

//A. Importer avhengigheter
import express from 'express';
import { tasks } from '../data.js';  // Importerer tasks fra data.js

//B. Oppretter en "router", en mini-app for å håndtere ruter for en bestemt del 
// av applikasjonen, som her er tasks og lists 
// Det er denne "routeren" som defineres videre i denne filen. 
const router = express.Router();  

//C. Første endepunkt. Henter alle oppgaver, dvs: 
// - Når noen går til /api/v1/tasks/, vil serveren sende tilbake en liste over 
// alle oppgavene i JSON-format.
// - Her definerer vi altså et endepunkt (app.get) som henter ut alle opppgavene 
// fra listen tasks. 
// - Rute: /api/v1/tasks. 
// - Responsen vil inneholde oppgavene i json-format.
router.get('/', (request, response) => {
    response.json(tasks);
});

//D. Hent en bestemt oppgave, dvs: 
// Denne ruten lar deg hente en spesifikk oppgave ved å bruke id-en fra URL-en. 
// Hvis oppgaven finnes, blir den sendt tilbake, hvis ikke får du en feilmelding.
router.get('/:id', (request, response) => {
    const id = request.params.id;  // Hent 'id' fra URL-en
    const task = tasks.find(t => t.id == id);  // Finn oppgaven med denne 'id' i oppgavelisten
    
    if (task) {
        response.json(task);  // Hvis oppgaven finnes, send den tilbake som JSON
    } else {
        response.status(404).send(`Task with id '${id}' not found.`);  // Hvis oppgaven ikke finnes, send 404-feil
    }
});

//E. Legg til en ny oppgave, dvs: 
// Denne ruten lar deg legge til en ny oppgave. Den sjekker først om oppgaven 
// har nødvendig informasjon, og om det allerede finnes en oppgave med samme id. 
// Hvis alt er i orden, legges den nye oppgaven til, og en bekreftelse blir sendt tilbake.
router.post('/', (request, response) => {
    const task = request.body;  // Henter den nye oppgaven fra forespørselens body
    
    // Sjekk om nødvendig informasjon (id, title, done) finnes
    if (!task.id || !task.title || task.done === undefined) {
        return response.status(400).send('En oppgave må ha id, title og done.');
    }
    
    // Sjekk om en oppgave med samme id allerede finnes
    if (tasks.find(t => t.id == task.id)) {
        response.status(400).send(`En oppgave med id '${task.id}' finnes allerede.`);
    } else {
        tasks.push(task);  // Legger den nye oppgaven til oppgavelisten
        response.status(201).location('tasks/' + task.id).send();  // Sender 201-status og plassering av den nye oppgaven
    }
});

//F. Slett en oppgave, dvs: 
// Denne ruten lar deg slette en spesifikk oppgave basert på id. 
// Hvis oppgaven finnes, fjernes den fra listen og den oppdaterte listen sendes tilbake. Hvis oppgaven ikke finnes, får du en 404-feilmelding.
router.delete('/:id', (request, response) => {
    const id = request.params.id;  // Henter 'id' fra URL-en
    const index = tasks.findIndex(t => t.id == id);  // Finn indeksen til oppgaven med denne 'id'
    
    if (index != -1) {  // Sjekk om oppgaven finnes (indeksen er gyldig)
        tasks.splice(index, 1);  // Fjern oppgaven fra listen ved å bruke indeksen
        response.json(tasks);  // Send oppdatert liste tilbake som svar
    } else {
        response.status(404).send(`Oppgave med id '${id}' ble ikke funnet.`);  // Send 404-feilmelding hvis oppgaven ikke finnes
    }
});

export default router;  // Eksporterer routeren
