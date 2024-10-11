import axios from "axios";
import todoApi from "../todo-api";
import taskService from "../task-service";

// Setter basis-URL for Axios til å peke på localhost for API-kall.
axios.defaults.baseURL = "http://localhost:3001";

// Mocking av taskService for å simulere funksjonalitet uten å koble til en faktisk database.
jest.mock("../task-service");

// Testdata for oppgaver som brukes i testene.
const testData = [
    { id: 1, title: "Les leksjon", done: 1 },
    { id: 2, title: "Møt opp på forelesning", done: 0 },
    { id: 3, title: "Gjør øving", done: 0 },
];

let webServer;
// Starter serveren på port 3001 før alle testene.
beforeAll(() => (webServer = todoApi.listen(3001)));
// Lukker serveren etter at alle testene er ferdig.
afterAll(() => webServer.close());

describe("Fetch tasks (GET)", () => {
    // Test som sjekker at alle oppgaver hentes med statuskode 200.
    test("Fetch all tasks (200 OK)", async () => {
        // Mock taskService.getAll til å returnere testdataene.
        taskService.getAll = jest.fn(() => Promise.resolve(testData));

        // Sender en GET-forespørsel til API-et for å hente alle oppgavene.
        const response = await axios.get("/api/v1/tasks");

        // Sjekker at statuskoden er 200 og at dataene som returneres samsvarer med testdataene.
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testData);
    });

    // Test som sjekker at en spesifikk oppgave hentes med statuskode 200.
    test("Fetch task (200 OK)", async () => {
        // Mock taskService.get til å returnere den første oppgaven.
        taskService.get = jest.fn(() => Promise.resolve(testData[0]));

        // Sender en GET-forespørsel for å hente oppgave med ID 1.
        const response = await axios.get("/api/v1/tasks/1");

        // Sjekker at statuskoden er 200 og at dataene som returneres er korrekt oppgave.
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testData[0]);
    });

    // Test som simulerer en serverfeil (500) når alle oppgaver hentes.
    test("Fetch all tasks (500 Internal Server Error)", async () => {
        // Mock taskService.getAll til å kaste en feil.
        taskService.getAll = jest.fn(() => Promise.reject(new Error()));

        // Forventer at statuskoden 500 returneres når serveren feiler.
        expect.assertions(1);
        try {
            await axios.get("/api/v1/tasks");
        } catch (error) {
            expect(error.response.status).toEqual(500);
        }
    });

    // Test som sjekker at det returneres 404 når oppgaven ikke finnes.
    test("Fetch task (404 Not Found)", async () => {
        // Mock taskService.get til å returnere en tom liste (som betyr at oppgaven ikke finnes).
        taskService.get = jest.fn(() => Promise.resolve([]));

        // Forventer at statuskoden 404 returneres hvis oppgaven ikke eksisterer.
        expect.assertions(1);
        try {
            await axios.get("/api/v1/tasks/999"); // ID 999 forventes ikke å eksistere.
        } catch (error) {
            expect(error.response.status).toEqual(404);
        }
    });
});

describe("Create new task (POST)", () => {
    // Test som sjekker at en ny oppgave opprettes korrekt med statuskode 201.
    test("Create new task (201 Created)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false };
        // Mock taskService.create til å simulere en vellykket opprettelse.
        taskService.create = jest.fn(() => Promise.resolve());

        // Sender en POST-forespørsel for å opprette den nye oppgaven.
        const response = await axios.post("/api/v1/tasks", newTask);

        // Sjekker at statuskoden er 201 (Created) og at location-headeren er riktig.
        expect(response.status).toEqual(201);
        expect(response.headers.location).toEqual("tasks/4");
    });

    // Test som sjekker at det returneres 400 Bad Request når dataene er ugyldige.
    test("Create new task (400 Bad Request)", async () => {
        const newTask = { title: "Ny oppgave", done: false }; // Mangler 'id'.
        // Mock taskService.create til å simulere en feil ved opprettelse.
        taskService.create = jest.fn(() => Promise.reject(new Error()));

        // Forventer at statuskoden 400 returneres ved ugyldige data.
        expect.assertions(1);
        try {
            await axios.post("/api/v1/tasks", newTask);
        } catch (error) {
            expect(error.response.status).toEqual(400);
        }
    });

    // Test som sjekker at det returneres 500 Internal Server Error når serveren feiler.
    test("Create new task (500 Internal Server error)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false };
        // Mock taskService.create til å simulere en serverfeil.
        taskService.create = jest.fn(() => Promise.reject(new Error()));

        // Forventer at statuskoden 500 returneres hvis serveren feiler ved opprettelse.
        expect.assertions(1);
        try {
            await axios.post("/api/v1/tasks", newTask);
        } catch (error) {
            expect(error.response.status).toEqual(500);
        }
    });
});

describe("Delete task (DELETE)", () => {
    // Test som sjekker at en oppgave slettes korrekt med statuskode 200.
    test("Delete task (200 OK)", async () => {
        // Mock taskService.delete til å simulere en vellykket sletting.
        taskService.delete = jest.fn(() => Promise.resolve());

        // Sender en DELETE-forespørsel for å slette oppgaven med ID 1.
        const response = await axios.delete("/api/v1/tasks/1");

        // Sjekker at statuskoden er 200 og at slettingen er vellykket.
        expect(response.status).toEqual(200);
    });
});
