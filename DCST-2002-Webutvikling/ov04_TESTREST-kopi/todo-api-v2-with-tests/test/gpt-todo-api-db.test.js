import axios from "axios";
import pool from "../mysql-pool";
import todoApi from "../todo-api";
import taskService from "../task-service";

// Setter baseURL for axios til lokalhost for å simulere API-kall.
axios.defaults.baseURL = "http://localhost:3000";

// Testdata som simulerer oppgaver i databasen
const testData = [
    { id: 1, title: "Les leksjon", done: 1 },
    { id: 2, title: "Møt opp på forelesning", done: 0 },
    { id: 3, title: "Gjør øving", done: 0 }
];

// Starter API-serveren før testene kjøres
let webServer;
beforeAll(() => webServer = todoApi.listen(3000));

// Sletter alle oppgaver og oppretter testdata på nytt før hver test
beforeEach(async () => {
    const deleteActions = testData.map(task => taskService.delete(task.id));
    await Promise.all(deleteActions);

    const createActions = testData.map(task => taskService.create(task));
    await Promise.all(createActions);
});

// Stopper serveren og avslutter databaseforbindelsen etter at alle testene er ferdige
afterAll(async () => {
    const deleteActions = [1, 2, 3, 4].map(id => taskService.delete(id));
    await Promise.all(deleteActions);

    pool.end();
    webServer.close();
});

describe("Fetch tasks (GET)", () => {
    test("Fetch all tasks (200 OK)", async () => {
        // Henter alle oppgaver fra API-et
        const response = await axios.get("/api/v1/tasks");

        expect(response.status).toEqual(200); // Sjekker om statuskoden er 200 OK
        expect(response.data).toEqual(testData); // Sjekker om dataen er lik testData
    });

    test("Fetch task (200 OK)", async () => {
        // Henter en spesifikk oppgave (ID 1)
        const expected = [testData[0]];
        const response = await axios.get("/api/v1/tasks/1");

        expect(response.status).toEqual(200); // Sjekker om statuskoden er 200 OK
        expect(response.data).toEqual(expected); // Sjekker om dataen er den riktige oppgaven
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
        try {
            // Forsøker å hente en oppgave som ikke eksisterer (ID 999)
            await axios.get("/api/v1/tasks/999");
        } catch (error) {
            expect(error.response.status).toEqual(404); // Sjekker om statuskoden er 404
        }
    });

    // Ny test lagt til:
    test("Fetch task (500 Internal Server error)", async () => {
        // Mocker taskService.get til å kaste en feil (simulerer serverfeil)
        taskService.get = jest.fn(() => Promise.reject());

        try {
            await axios.get("/api/v1/tasks/1"); // Forsøker å hente en oppgave med serverfeil
        } catch (error) {
            expect(error.response.status).toEqual(500); // Sjekker om statuskoden er 500
        }
    });
});

describe("Create new task (POST)", () => {
    test("Create new task (201 Created)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false };
        // Sender POST-request for å opprette en ny oppgave
        const response = await axios.post("/api/v1/tasks", newTask);
        expect(response.status).toEqual(201); // Sjekker om statuskoden er 201 Created
        expect(response.headers.location).toEqual("tasks/4"); // Sjekker om Location-headeren er riktig
    });

    // Ny test lagt til:
    test("Create new task (400 Bad Request)", async () => {
        const invalidTask = { title: "" }; // Ugyldig oppgave (mangler nødvendig informasjon)

        try {
            await axios.post("/api/v1/tasks", invalidTask); // Forsøker å opprette ugyldig oppgave
        } catch (error) {
            expect(error.response.status).toEqual(400); // Sjekker om statuskoden er 400
        }
    });

    // Ny test lagt til:
    test("Create new task (500 Internal Server error)", async () => {
        // Mocker taskService.create til å kaste en feil (simulerer serverfeil)
        taskService.create = jest.fn(() => Promise.reject());

        const newTask = { id: 4, title: "Ny oppgave", done: false };

        try {
            await axios.post("/api/v1/tasks", newTask); // Forsøker å opprette ny oppgave
        } catch (error) {
            expect(error.response.status).toEqual(500); // Sjekker om statuskoden er 500
        }
    });
});

describe("Delete task (DELETE)", () => {
    test("Delete task (200 OK)", async () => {
        // Sender DELETE-request for å slette en oppgave med ID 2
        const response = await axios.delete("/api/v1/tasks/2");
        expect(response.status).toEqual(200); // Sjekker om statuskoden er 200 OK
    });

    // Ny test lagt til:
    test("Delete task (404 Not Found)", async () => {
        try {
            // Forsøker å slette en oppgave som ikke finnes (ID 999)
            await axios.delete("/api/v1/tasks/999");
        } catch (error) {
            expect(error.response.status).toEqual(404); // Sjekker om statuskoden er 404
        }
    });

    // Ny test lagt til:
    test("Delete task (500 Internal Server Error)", async () => {
        // Mocker taskService.delete til å kaste en feil (simulerer serverfeil)
        taskService.delete = jest.fn(() => Promise.reject());

        try {
            await axios.delete("/api/v1/tasks/2"); // Forsøker å slette en oppgave med serverfeil
        } catch (error) {
            expect(error.response.status).toEqual(500); // Sjekker om statuskoden er 500
        }
    });
});
