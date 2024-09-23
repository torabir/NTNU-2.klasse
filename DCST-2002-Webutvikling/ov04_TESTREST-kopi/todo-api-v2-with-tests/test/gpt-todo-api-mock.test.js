import axios from "axios";
import todoApi from "../todo-api";
import taskService from "../task-service";

// Setter baseURL for axios til lokalhost for å simulere API-kall.
axios.defaults.baseURL = "http://localhost:3001";

// Mocker taskService for å kontrollere responsene til funksjonene
jest.mock("../task-service");

// Testdata som simulerer oppgaver i systemet
const testData = [
    { id: 1, title: "Les leksjon", done: 1 },
    { id: 2, title: "Møt opp på forelesning", done: 0 },
    { id: 3, title: "Gjør øving", done: 0 },
];

// Starter API-serveren på port 3001 før testene kjøres
let webServer;
beforeAll(() => webServer = todoApi.listen(3001));
// Stopper serveren etter at alle testene er ferdig
afterAll(() => webServer.close());

describe("Fetch tasks (GET)", () => {
    test("Fetch all tasks (200 OK)", async () => {
        // Mocker taskService.getAll til å returnere testData
        taskService.getAll = jest.fn(() => Promise.resolve(testData));

        // Sender GET-request for å hente alle oppgaver
        const response = await axios.get("/api/v1/tasks");
        expect(response.status).toEqual(200); // Sjekker om statuskoden er 200 OK
        expect(response.data).toEqual(testData); // Sjekker om dataen er lik testData
    });

    test("Fetch task (200 OK)", async () => {
        // Mocker taskService.get til å returnere en spesifikk oppgave basert på ID
        taskService.get = jest.fn((id) => Promise.resolve(testData.find(task => task.id === id)));

        // Sender GET-request for å hente en spesifikk oppgave med ID 1
        const response = await axios.get("/api/v1/tasks/1");
        expect(response.status).toEqual(200); // Sjekker om statuskoden er 200 OK
        expect(response.data).toEqual(testData[0]); // Sjekker om dataen er riktig oppgave
    });

    // Ny test lagt til:
    test("Fetch all tasks (500 Internal Server Error)", async () => {
        // Mocker taskService.getAll til å kaste en feil (simulerer serverfeil)
        taskService.getAll = jest.fn(() => Promise.reject());

        try {
            await axios.get("/api/v1/tasks");
        } catch (error) {
            expect(error.response.status).toEqual(500); // Sjekker om statuskoden er 500
        }
    });

    // Ny test lagt til:
    test("Fetch task (404 Not Found)", async () => {
        // Mocker taskService.get til å returnere null for en oppgave som ikke finnes
        taskService.get = jest.fn((id) => Promise.resolve(null));

        try {
            await axios.get("/api/v1/tasks/999"); // Forsøker å hente oppgave som ikke finnes
        } catch (error) {
            expect(error.response.status).toEqual(404); // Sjekker om statuskoden er 404
        }
    });

    // Ny test lagt til:
    test("Fetch task (500 Internal Server error)", async () => {
        // Mocker taskService.get til å kaste en feil (simulerer serverfeil)
        taskService.get = jest.fn(() => Promise.reject());

        try {
            await axios.get("/api/v1/tasks/1");
        } catch (error) {
            expect(error.response.status).toEqual(500); // Sjekker om statuskoden er 500
        }
    });
});

describe("Create new task (POST)", () => {
    test("Create new task (201 Created)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false };
        // Mocker taskService.create til å returnere den nye oppgaven
        taskService.create = jest.fn(() => Promise.resolve(newTask));

        // Sender POST-request for å opprette en ny oppgave
        const response = await axios.post("/api/v1/tasks", newTask);
        expect(response.status).toEqual(201); // Sjekker om statuskoden er 201 Created
        expect(response.headers.location).toEqual("tasks/4"); // Sjekker om Location-headeren er riktig
    });

    // Ny test lagt til:
    test("Create new task (400 Bad Request)", async () => {
        const invalidTask = { title: "" }; // Ugyldig oppgave (mangler nødvendig informasjon)
        // Mocker taskService.create til å kaste en feil med status 400
        taskService.create = jest.fn(() => Promise.reject({ status: 400 }));

        try {
            await axios.post("/api/v1/tasks", invalidTask); // Forsøker å opprette ugyldig oppgave
        } catch (error) {
            expect(error.response.status).toEqual(400); // Sjekker om statuskoden er 400
        }
    });

    // Ny test lagt til:
    test("Create new task (500 Internal Server error)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false };
        // Mocker taskService.create til å kaste en feil (simulerer serverfeil)
        taskService.create = jest.fn(() => Promise.reject());

        try {
            await axios.post("/api/v1/tasks", newTask); // Forsøker å opprette ny oppgave
        } catch (error) {
            expect(error.response.status).toEqual(500); // Sjekker om statuskoden er 500
        }
    });
});

describe("Delete task (DELETE)", () => {
    test("Delete task (200 OK)", async () => {
        // Mocker taskService.delete til å slette en oppgave uten feil
        taskService.delete = jest.fn((id) => Promise.resolve());

        // Sender DELETE-request for å slette oppgave med ID 2
        const response = await axios.delete("/api/v1/tasks/2");
        expect(response.status).toEqual(200); // Sjekker om statuskoden er 200 OK
    });

    // Ny test lagt til:
    test("Delete task (500 Internal Server Error)", async () => {
        // Mocker taskService.delete til å kaste en feil (simulerer serverfeil)
        taskService.delete = jest.fn(() => Promise.reject());

        try {
            await axios.delete("/api/v1/tasks/2"); // Forsøker å slette oppgave med serverfeil
        } catch (error) {
            expect(error.response.status).toEqual(500); // Sjekker om statuskoden er 500
        }
    });
});
