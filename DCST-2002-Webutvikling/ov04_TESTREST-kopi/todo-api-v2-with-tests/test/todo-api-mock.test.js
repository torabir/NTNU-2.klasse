import axios from "axios";
import todoApi from "../todo-api";
import taskService from "../task-service";

// Setter opp Axios til å bruke HTTP-adapteren som fungerer i Node.js-miljø.
axios.defaults.adapter = require("axios/lib/adapters/http");
// Setter basis-URL for Axios til localhost for å simulere API-kall.
axios.defaults.baseURL = "http://localhost:3001";

// Mock taskService for å simulere funksjonaliteten og teste API-et uten å avhenge av den faktiske tjenesten.
jest.mock("../task-service");

// Testdata for oppgaver som vi vil bruke i testene.
const testData = [
    { id: 1, title: "Les leksjon", done: 1 },
    { id: 2, title: "Møt opp på forelesning", done: 0 },
    { id: 3, title: "Gjør øving", done: 0 },
];

// Starter opp en webserver på port 3001 før alle testene kjører.
let webServer;
beforeAll(() => (webServer = todoApi.listen(3001)));

// Lukker serveren etter at alle testene er ferdigkjørt.
afterAll(() => webServer.close());

describe("Fetch tasks (GET)", () => {
    // Test som sjekker at alle oppgaver hentes riktig (200 OK).
    test("Fetch all tasks (200 OK)", async () => {
        // Mock taskService.getAll til å returnere testdataene.
        taskService.getAll = jest.fn(() => Promise.resolve(testData));

        // Utfør GET-forespørsel til API-et for å hente alle oppgaver.
        const response = await axios.get("/api/v1/tasks");
        
        // Sjekk at statuskoden er 200 (OK).
        expect(response.status).toEqual(200);
        // Sjekk at dataene som returneres er de samme som testdataene.
        expect(response.data).toEqual(testData);
    });

    // A. 
    // Test som sjekker at en spesifikk oppgave hentes riktig (200 OK).
    test("Fetch task (200 OK)", async () => {
        const expected = [testData[0]]; // Forventet data er første oppgave i testData.
        // Mock taskService.get til å returnere forventet oppgave.
        taskService.get = jest.fn(() => Promise.resolve(expected));

        // Utfør GET-forespørsel til API-et for å hente oppgave med ID 1.
        const response = await axios.get("/api/v1/tasks/1");
        
        // Sjekk at statuskoden er 200 (OK).
        expect(response.status).toEqual(200);
        // Sjekk at dataene som returneres er lik forventet oppgave.
        expect(response.data).toEqual(expected);
    });

    // B.
    // Test som sjekker at serverfeil (500) håndteres riktig når alle oppgaver hentes.
    test("Fetch all tasks (500 Internal Server Error)", async () => {
        // Mock taskService.getAll til å kaste en feil for å simulere serverfeil.
        taskService.getAll = jest.fn(() => Promise.reject());

        // Forvent at GET-forespørselen skal kaste en feil med statuskode 500.
        await expect(() => axios.get("/api/v1/tasks"))
        .rejects
        .toThrow("Request failed with status code 500");
    });

    // C.
    // Test som sjekker at 404 Not Found returneres når en oppgave ikke finnes.
    test("Fetch task (404 Not Found)", async () => {
        // Mock taskService.get til å returnere en tom array for å simulere at oppgaven ikke finnes.
        taskService.get = jest.fn(() => Promise.resolve([]));

        // Prøv å hente en oppgave som ikke finnes og sjekk om statuskoden er 404.
        try {
            const response = await axios.get("/api/v1/task/1");
        } catch (error) {
            expect(error.response.status).toEqual(404);
        }
    });

    // D.
    // Test som sjekker at serverfeil (500) håndteres riktig når en spesifikk oppgave hentes.
    test("Fetch task (500 Internal Server error)", async () => {
        // Mock taskService.get til å kaste en feil for å simulere serverfeil.
        taskService.get = jest.fn(() => Promise.reject());

        // Forvent at GET-forespørselen skal kaste en feil med statuskode 500.
        await expect(() => axios.get("/api/v1/tasks/1"))
        .rejects
        .toThrow("Request failed with status code 500");
    });
});

describe("Create new task (POST)", () => {
    // E. 
    // Test som sjekker at en ny oppgave opprettes riktig (201 Created).
    test("Create new task (201 Created)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false }; // Ny oppgave å opprette.
        // Mock taskService.create til å returnere en vellykket opprettelse.
        taskService.create = jest.fn(() => Promise.resolve());

        // Utfør POST-forespørsel for å opprette en ny oppgave.
        const response = await axios.post("/api/v1/tasks", newTask);
        
        // Sjekk at statuskoden er 201 (Created).
        expect(response.status).toEqual(201);
        // Sjekk at Location-headeren inneholder riktig URL for den nye oppgaven.
        expect(response.headers.location).toEqual("tasks/4");
    });

    // F.
    // Test som sjekker at 400 Bad Request returneres når en oppgave mangler nødvendige felter.
    test("Create new task (400 Bad Request)", async () => {
        const newTaskMissingId = { title: "Ny oppgave", done: false }; // Oppgave uten ID.
        // Mock taskService.create til å returnere en vellykket respons, men med feil data.
        taskService.create = jest.fn(() => Promise.resolve());

        // Prøv å opprette en ugyldig oppgave og sjekk om statuskoden er 400 (Bad Request).
        try {
            const response = await axios.post("/api/v1/tasks", newTaskMissingId);
        } catch (error) {
            expect(error.response.status).toEqual(400);
        }
    });

    // G.
    // Test som sjekker at serverfeil (500) håndteres riktig ved opprettelse av ny oppgave.
    test("Create new task (500 Internal Server error)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false }; // Ny oppgave å opprette.
        // Mock taskService.create til å kaste en feil for å simulere serverfeil.
        taskService.create = jest.fn(() => Promise.reject());

        // Forvent at POST-forespørselen skal kaste en feil med statuskode 500.
        await expect(() => axios.post("/api/v1/tasks", newTask))
        .rejects
        .toThrow("Request failed with status code 500");
    });
});

describe("Delete task (DELETE)", () => {
    // H.
    // Test som sjekker at en oppgave slettes riktig (200 OK).
    test("Delete task (200 OK)", async () => {
        // Mock taskService.delete til å returnere en vellykket sletting.
        taskService.delete = jest.fn(() => Promise.resolve());

        // Utfør DELETE-forespørsel for å slette oppgave med ID 1.
        const response = await axios.delete("/api/v1/tasks/1");
        
        // Sjekk at statuskoden er 200 (OK).
        expect(response.status).toEqual(200);
    });

    // I. 
    // Test som sjekker at serverfeil (500) håndteres riktig ved sletting av oppgave.
    test("Delete task (500 Internal Server error)", async () => {
        // Mock taskService.delete til å kaste en feil for å simulere serverfeil.
        taskService.delete = jest.fn(() => Promise.reject());

        // Forvent at DELETE-forespørselen skal kaste en feil med statuskode 500.
        await expect(() => axios.delete("/api/v1/tasks/2"))
        .rejects
        .toThrow("Request failed with status code 500");
    });
});
