//-- Her oppretter vi endepunktene "lists", altså /api/v1/lists
//-- Her er mye likt med tasks.js. Se der for flere forklaringer. 

//Importer avhengigheter
import express from 'express';
import { lists, tasks } from '../data.js';  // Importerer lists og tasks fra data.js

const router = express.Router();

// Hent alle lister: 
router.get('/', (request, response) => {
    response.json(lists);  // Returner alle lister som JSON
});

// A. Hent en bestemt liste, dvs: 
// Denne ruten lar deg hente en spesifikk liste basert på listId fra URL-en. 
// Hvis listen finnes, sendes den tilbake, og hvis ikke får du en 404-feilmelding.
router.get('/:listId', (request, response) => {
    const listId = request.params.listId;  // Hent 'listId' fra URL-en
    const list = lists.find(l => l.id == listId);  // Finn listen med denne 'listId' i listelisten
    
    if (list) {
        response.json(list);  // Hvis listen finnes, send den tilbake som JSON
    } else {
        response.status(404).send(`Liste med id '${listId}' ble ikke funnet.`);  // Hvis listen ikke finnes, send 404-feilmelding
    }
});

// B. Opprett en ny liste, dvs: 
// Denne ruten lar deg opprette en ny liste. Den sjekker om listen har nødvendig 
// informasjon, og om det allerede finnes en liste med samme id. 
// Hvis alt er i orden, legges den nye listen til, og en bekreftelse sendes tilbake.
router.post('/', (request, response) => {
    const list = request.body;  // Hent den nye listen fra forespørselens body
    
    // Sjekk om nødvendig informasjon (id og title) finnes
    if (!list.id || !list.title) {
        return response.status(400).send('En liste må ha id og tittel.');
    }
    
    // Sjekk om en liste med samme id allerede finnes
    if (lists.find(l => l.id == list.id)) {
        response.status(400).send(`En liste med id '${list.id}' finnes allerede.`);
    } else {
        lists.push(list);  // Legg til den nye listen i listen over lister
        response.status(201).location('lists/' + list.id).send();  // Send 201-status og plasseringen av den nye listen
    }
});

// C. Slett en liste og dens oppgaver, dvs: 
// Denne ruten lar deg slette en spesifikk liste samt alle oppgaver knyttet til den. 
// Hvis listen finnes, fjernes den sammen med oppgavene, og den oppdaterte listen sendes tilbake. 
// Hvis listen ikke finnes, får du en 404-feilmelding.
router.delete('/:listId', (request, response) => {
    const listId = request.params.listId;  // Henter 'listId' fra URL-en
    const index = lists.findIndex(l => l.id == listId);  // Finn indeksen til listen med denne 'listId'

    if (index != -1) {  // Sjekk om listen finnes (indeksen er gyldig)
        lists.splice(index, 1);  // Fjern listen fra listen over lister
        // Fjerner oppgaver knyttet til listen
        const remainingTasks = tasks.filter(t => t.listId != listId);  // Filtrer bort oppgaver med samme 'listId'
        response.json(lists);  // Send oppdatert liste over lister tilbake som svar
    } else {
        response.status(404).send(`Liste med id '${listId}' ble ikke funnet.`);  // Send 404-feilmelding hvis listen ikke finnes
    }
});

// D. Hent alle oppgaver for en gitt liste, dvs: 
// Denne ruten henter alle oppgaver som er knyttet til en spesifikk liste, 
// basert på listId. Oppgavene sendes tilbake som JSON-data.
router.get('/:listId/tasks', (request, response) => {
    const listId = request.params.listId;  // Henter 'listId' fra URL-en
    const listTasks = tasks.filter(t => t.listId == listId);  // Finn alle oppgaver som tilhører denne listen ved å filtrere oppgavene
    
    response.json(listTasks);  // Send tilbake oppgavene som JSON
});

// E. Hent en bestemt oppgave for en gitt liste, dvs: 
// Denne ruten lar deg hente en spesifikk oppgave fra en bestemt liste, 
// basert på både liste-ID og oppgave-ID. 
// Hvis oppgaven finnes, sendes den tilbake, og hvis ikke, får du en 404-feilmelding.
router.get('/:listId/tasks/:taskId', (request, response) => {
    const { listId, taskId } = request.params;  // Henter 'listId' og 'taskId' fra URL-en
    const task = tasks.find(t => t.listId == listId && t.id == taskId);  // Finn oppgaven som tilhører den spesifikke listen og har riktig id

    if (task) {
        response.json(task);  // Hvis oppgaven finnes, send den tilbake som JSON
    } else {
        response.status(404).send(`Oppgave med id '${taskId}' i liste '${listId}' ble ikke funnet.`);  // Hvis oppgaven ikke finnes, send 404-feilmelding
    }
});

// F. Legg til en ny oppgave i en bestemt liste, dvs: 
// Denne ruten lar deg legge til en ny oppgave i en spesifikk liste. 
// Den sjekker om oppgaven har nødvendig informasjon, og om det allerede 
// finnes en oppgave med samme id i listen. 
// Hvis alt er i orden, legges den nye oppgaven til, og en bekreftelse sendes tilbake.
router.post('/:listId/tasks', (request, response) => {
    const listId = request.params.listId;  // Henter 'listId' fra URL-en
    const task = request.body;  // Henter den nye oppgaven fra forespørselens body

    // Sjekk om nødvendig informasjon (id, title, done) finnes
    if (!task.id || !task.title || task.done === undefined) {
        return response.status(400).send('En oppgave må ha id, tittel og done-status.');
    }

    // Sjekk om en oppgave med samme id allerede finnes i listen
    if (tasks.find(t => t.id == task.id && t.listId == listId)) {
        response.status(400).send(`En oppgave med id '${task.id}' finnes allerede i liste '${listId}'.`);
    } else {
        task.listId = listId;  // Sett oppgavens 'listId' til den spesifikke listen
        tasks.push(task);  // Legg til den nye oppgaven i oppgavelisten
        response.status(201).location(`lists/${listId}/tasks/${task.id}`).send();  // Send 201-status og plasseringen av den nye oppgaven
    }
});

// G. Slett en bestemt oppgave i en bestemt liste, dvs: 
// Denne ruten lar deg slette en spesifikk oppgave fra en bestemt liste, 
// basert på både liste-ID og oppgave-ID. Hvis oppgaven finnes, fjernes den, 
// og den oppdaterte oppgavelisten sendes tilbake. 
// Hvis oppgaven ikke finnes, får du en 404-feilmelding.
router.delete('/:listId/tasks/:taskId', (request, response) => {
    const { listId, taskId } = request.params;  // Henter 'listId' og 'taskId' fra URL-en
    const index = tasks.findIndex(t => t.id == taskId && t.listId == listId);  // Finn indeksen til oppgaven som matcher både 'taskId' og 'listId'
    
    if (index != -1) {  // Sjekk om oppgaven finnes (indeksen er gyldig)
        tasks.splice(index, 1);  // Fjern oppgaven fra oppgavelisten
        response.json(tasks);  // Send oppdatert oppgaveliste tilbake som svar
    } else {
        response.status(404).send(`Oppgave med id '${taskId}' i liste '${listId}' ble ikke funnet.`);  // Send 404-feilmelding hvis oppgaven ikke finnes
    }
});

export default router;  // Eksporterer routeren
