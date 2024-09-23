import axios from "axios";
import pool from "../mysql-pool"; // Importerer MySQL-pool for å håndtere databasen.
import todoApi from "../todo-api"; // Importerer API-et vi skal teste.
import taskService from "../task-service"; // Importerer tjenestelaget som håndterer oppgaver.

// Setter opp Axios for å bruke HTTP-adapteren som fungerer i Node.js.
axios.defaults.adapter = require("axios/lib/adapters/http");
// Setter basis-URL for Axios til localhost for å simulere API-kall.
axios.defaults.baseURL = "http://localhost:3000";

// Testdata som representerer en liste av oppgaver vi vil bruke i testene.
const testData = [
    { id: 1, title: "Les leksjon", done: 1 },
    { id: 2, title: "Møt opp på forelesning", done: 0 },
    { id: 3, title: "Gjør øving", done: 0 } 
];

// Starter API-serveren på port 3000 før alle testene kjøres.
let webServer;
beforeAll(() => webServer = todoApi.listen(3000));

// Denne funksjonen kjører før hver test. Den sørger for at databasen er tilbakestilt
// ved å slette eksisterende oppgaver og opprette testdataene på nytt.
beforeEach(async () => {
    // Sletter alle eksisterende oppgaver i testData.
    const deleteActions = testData.map(task => taskService.delete(task.id));
    await Promise.all(deleteActions); // Venter på at alle slettinger skal fullføres.

    // Oppretter alle oppgavene i testData.
    const createActions = testData.map(task => taskService.create(task));
    await Promise.all(createActions); // Venter på at alle opprettelser skal fullføres.
});

// Denne funksjonen kjører etter at alle testene er ferdige. Den sørger for at
// alle oppgavene er slettet og lukker MySQL-poolen og webserveren.
afterAll(async () => {
    // Sletter oppgaver med id 1, 2, 3 og 4.
    const deleteActions = [1, 2, 3, 4].map(id => taskService.delete(id));
    await Promise.all(deleteActions); // Venter på at alle slettinger skal fullføres.
    
    pool.end(); // Lukker MySQL-poolen.
    webServer.close(); // Stopper webserveren.
});

describe("Fetch tasks (GET)", () => {
    // Test som sjekker at alle oppgaver hentes riktig (200 OK).
    test("Fetch all tasks (200 OK)", async () => {
        // Sender GET-forespørsel for å hente alle oppgaver.
        const response = await axios.get("/api/v1/tasks");

        // Sjekker at statuskoden er 200 (OK).
        expect(response.status).toEqual(200);
        // Sjekker at dataen som returneres er den samme som testData.
        expect(response.data).toEqual(testData);
    });

    // Test som sjekker at en spesifikk oppgave hentes riktig (200 OK).
    test("Fetch task (200 OK)", async () => {
        const expected = [testData[0]]; // Forventet data er første oppgave i testData.
        // Sender GET-forespørsel for å hente oppgave med ID 1.
        const response = await axios.get("/api/v1/tasks/1");

        // Sjekker at statuskoden er 200 (OK).
        expect(response.status).toEqual(200);
        // Sjekker at dataen som returneres er lik forventet oppgave.
        expect(response.data).toEqual(expected);
    });

    // Test som sjekker at serverfeil (500) håndteres riktig når alle oppgaver hentes.
    test("Fetch all tasks (500 Internal Server Error)", async () => {
        // Lagre den opprinnelige funksjonen før vi mocker den.
        let actualGetAll = taskService.getAll;
        // Mock taskService.getAll til å kaste en feil for å simulere serverfeil.
        taskService.getAll = () => Promise.reject();

        // Forvent at GET-forespørselen skal kaste en feil med statuskode 500.
        await expect(() => axios.get("/api/v1/tasks"))
        .rejects
        .toThrow("Request failed with status code 500");

        // Gjenopprett den opprinnelige funksjonen etter testen.
        taskService.getAll = actualGetAll;
    });

    // Test som sjekker at 404 Not Found returneres når en oppgave ikke finnes.
    test("Fetch task (404 Not Found)", async () => {
        // Prøv å hente en oppgave med en ugyldig ID (-1).
        try {
            const response = await axios.get("/api/v1/tasks/-1");
        } catch(error) {
            // Sjekker at statuskoden er 404 (Not Found).
            expect(error.response.status).toEqual(404);
        }
    });

    // Test som sjekker at serverfeil (500) håndteres riktig når en spesifikk oppgave hentes.
    test("Fetch task (500 Internal Server error)", async () => {
        // Lagre den opprinnelige funksjonen før vi mocker den.
        let actualGet = taskService.get;
        // Mock taskService.get til å kaste en feil for å simulere serverfeil.
        taskService.get = () => Promise.reject();

        // Forvent at GET-forespørselen skal kaste en feil med statuskode 500.
        await expect(() => axios.get("/api/v1/tasks/1"))
        .rejects
        .toThrow("Request failed with status code 500");

        // Gjenopprett den opprinnelige funksjonen etter testen.
        taskService.get = actualGet;
    });
});

describe("Create new task (POST)", () => {
    // Test som sjekker at en ny oppgave opprettes riktig (201 Created).
    test("Create new task (201 Created)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false }; // Ny oppgave å opprette.
        // Sender POST-forespørsel for å opprette en ny oppgave.
        const response = await axios.post("/api/v1/tasks", newTask);

        // Sjekker at statuskoden er 201 (Created).
        expect(response.status).toEqual(201);
        // Sjekker at Location-headeren inneholder riktig URL for den nye oppgaven.
        expect(response.headers.location).toEqual("tasks/4");
    });

    // Test som sjekker at 400 Bad Request returneres når en oppgave mangler nødvendig informasjon.
    test("Create new task (400 Bad Request)", async () => {
        const newTaskMissingId = { title: 'Ny oppgave', done: false }; // Oppgave uten ID.
        // Prøv å opprette en ugyldig oppgave og sjekk om statuskoden er 400 (Bad Request).
        try {
            const response = await axios.post("/api/v1/tasks", newTaskMissingId);
        } catch(error) {
            // Sjekker at statuskoden er 400 (Bad Request).
            expect(error.response.status).toEqual(400);
        }
    });

    // Test som sjekker at serverfeil (500) håndteres riktig ved opprettelse av ny oppgave.
    test("Create new task (500 Internal Server error)", async () => {
        const newTaskMissingId = { id: null, title: 'Ny oppgave', done: false }; // Oppgave med ugyldig ID.
        // Prøv å opprette en ugyldig oppgave og sjekk om statuskoden er 500 (Internal Server Error).
        try {
            const response = await axios.post("/api/v1/tasks", newTaskMissingId);
        } catch(error) {
            // Sjekker at statuskoden er 500 (Internal Server Error).
            expect(error.response.status).toEqual(500);
        }
    });
});

describe("Delete task (DELETE)", () => {
    // Test som sjekker at en oppgave slettes riktig (200 OK).
    test("Delete task (200 OK)", async () => {
        // Sender DELETE-forespørsel for å slette oppgave med ID 2.
        const response = await axios.delete("/api/v1/tasks/2");

        // Sjekker at statuskoden er 200 (OK).
        expect(response.status).toEqual(200);
    });

    // Test som sjekker at serverfeil (500) håndteres riktig ved sletting av oppgave.
    test("Delete task (500 Internal Server error)", async () => { 
        // Lagre den opprinnelige funksjonen før vi mocker den.
        let actualDelete = taskService.delete;
        // Mock taskService.delete til å kaste en feil for å simulere serverfeil.
        taskService.delete = () => Promise.reject();

        // Forvent at DELETE-forespørselen skal kaste en feil med statuskode 500.
        await expect(() => axios.delete("/api/v1/tasks/2"))
        .rejects
        .toThrow("Request failed with status code 500");

        // Gjenopprett den opprinnelige funksjonen etter testen.
        taskService.delete = actualDelete
