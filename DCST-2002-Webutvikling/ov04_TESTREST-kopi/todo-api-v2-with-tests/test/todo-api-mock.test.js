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
    // A. Test som sjekker at alle oppgaver hentes riktig (200 OK).
    test("Fetch all tasks (200 OK)", async () => {
        taskService.getAll = jest.fn(() => Promise.resolve(testData)); // Mock taskService.getAll til å returnere testdataene.

        const response = await axios.get("/api/v1/tasks");

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testData);
    });

    // B. Test som sjekker at en spesifikk oppgave hentes riktig (200 OK).
    test("Fetch task (200 OK)", async () => {
        const expected = [testData[0]]; // Forventet data er første oppgave i testData.
        taskService.get = jest.fn(() => Promise.resolve(expected)); // Mock taskService.get til å returnere forventet oppgave.

        const response = await axios.get("/api/v1/tasks/1");

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);
    });

    // C. Test som sjekker at serverfeil (500) håndteres riktig når alle oppgaver hentes.
    test.skip("Fetch all tasks (500 Internal Server Error)", async () => {
        taskService.getAll = jest.fn(() => Promise.reject()); // Mock taskService.getAll til å kaste en feil.

        await expect(axios.get("/api/v1/tasks"))
        .rejects
        .toThrow("Request failed with status code 500");
    });

    // D. Test som sjekker at 404 Not Found returneres når en oppgave ikke finnes.
    test("Fetch task (404 Not Found)", async () => {
        taskService.get = jest.fn(() => Promise.resolve([])); // Mock taskService.get til å returnere en tom array.

        expect.assertions(1);

        try {
            await axios.get("/api/v1/tasks/1");
        } catch (error) {
            expect(error.response.status).toEqual(404);
        }
    });

    // E. Test som sjekker at serverfeil (500) håndteres riktig når en spesifikk oppgave hentes.
    test.skip("Fetch task (500 Internal Server error)", async () => {
        taskService.get = jest.fn(() => Promise.reject()); // Mock taskService.get til å kaste en feil.

        await expect(axios.get("/api/v1/tasks/1"))
        .rejects
        .toThrow("Request failed with status code 500");
    });
});

describe("Create new task (POST)", () => {
    // F. Test som sjekker at en ny oppgave opprettes riktig (201 Created).
    test("Create new task (201 Created)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false }; // Ny oppgave å opprette.
        taskService.create = jest.fn(() => Promise.resolve()); // Mock taskService.create til å returnere en vellykket opprettelse.

        const response = await axios.post("/api/v1/tasks", newTask);

        expect(response.status).toEqual(201);
        expect(response.headers.location).toEqual("tasks/4");
    });

    // G. Test som sjekker at 400 Bad Request returneres når en oppgave mangler nødvendige felter.
    test("Create new task (400 Bad Request)", async () => {
        const newTaskMissingId = { title: "Ny oppgave", done: false }; // Oppgave uten ID.
        taskService.create = jest.fn(() => Promise.resolve()); // Mock taskService.create til å returnere en respons.

        expect.assertions(1);

        try {
            await axios.post("/api/v1/tasks", newTaskMissingId);
        } catch (error) {
            expect(error.response.status).toEqual(400);
        }
    });

    // H. Test som sjekker at serverfeil (500) håndteres riktig ved opprettelse av ny oppgave.
    test("Create new task (500 Internal Server error)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false }; // Ny oppgave å opprette.
        taskService.create = jest.fn(() => Promise.reject()); // Mock taskService.create til å kaste en feil.

        await expect(axios.post("/api/v1/tasks", newTask))
        .rejects
        .toThrow("Request failed with status code 500");
    });
});

describe("Delete task (DELETE)", () => {
    // I. Test som sjekker at en oppgave slettes riktig (200 OK).
    test("Delete task (200 OK)", async () => {
        taskService.delete = jest.fn(() => Promise.resolve()); // Mock taskService.delete til å returnere en vellykket sletting.

        const response = await axios.delete("/api/v1/tasks/1");

        expect(response.status).toEqual(200);
    });

    // J. Test som sjekker at serverfeil (500) håndteres riktig ved sletting av oppgave.
    test("Delete task (500 Internal Server error)", async () => {
        taskService.delete = jest.fn(() => Promise.reject()); // Mock taskService.delete til å kaste en feil.

        await expect(axios.delete("/api/v1/tasks/2"))
        .rejects
        .toThrow("Request failed with status code 500");
    });
});
