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

// Denne funksjonen kjører før hver test. Den sørger for at databasen er tilbakestilt.
beforeEach(async () => {
    const deleteActions = testData.map(task => taskService.delete(task.id));
    await Promise.all(deleteActions);

    const createActions = testData.map(task => taskService.create(task));
    await Promise.all(createActions);
});

// Denne funksjonen kjører etter at alle testene er ferdige. Den sørger for at
// alle oppgavene er slettet og lukker MySQL-poolen og webserveren.
afterAll(async () => {
    const deleteActions = [1, 2, 3, 4].map(id => taskService.delete(id));
    await Promise.all(deleteActions);

    pool.end(); // Lukker MySQL-poolen.
    webServer.close(); // Stopper webserveren.
});

describe("Fetch tasks (GET)", () => {
    // 1. Test som sjekker at alle oppgaver hentes riktig (200 OK).
    test("Fetch all tasks (200 OK)", async () => {
        const response = await axios.get("/api/v1/tasks");

        // Sjekker at statuskoden er 200 (OK).
        expect(response.status).toEqual(200);
        // Sjekker at dataen som returneres er den samme som testData.
        expect(response.data).toEqual(testData);
    });

    // 2. Test som sjekker at en spesifikk oppgave hentes riktig (200 OK).
    test("Fetch task (200 OK)", async () => {
        const expected = [testData[0]]; // Forventet data er første oppgave i testData.
        const response = await axios.get("/api/v1/tasks/1");

        // Sjekker at statuskoden er 200 (OK).
        expect(response.status).toEqual(200);
        // Sjekker at dataen som returneres er lik forventet oppgave.
        expect(response.data).toEqual(expected);
    });

    // 3. Test som sjekker at serverfeil (500) håndteres riktig når alle oppgaver hentes.
    // Denne testen mockes, da SQL-spørringen sjeldent feiler i en reell setting.
    // test.skip("Fetch all tasks (500 Internal Server Error)", async () => {
    //     let actualGetAll = taskService.getAll;
    //     taskService.getAll = jest.fn(() => Promise.reject()); // Mock taskService.getAll til å kaste en feil.

    //     await expect(axios.get("/api/v1/tasks"))
    //     .rejects
    //     .toThrow("Request failed with status code 500");

    //     taskService.getAll = actualGetAll; // Gjenopprett den opprinnelige funksjonen etter testen.
    // });

    // 4. Test som sjekker at 404 Not Found returneres når en oppgave ikke finnes.
    test("Fetch task (404 Not Found)", async () => {
        expect.assertions(1); // Sørger for at minst én forventning blir sjekket.

        try {
            await axios.get("/api/v1/tasks/-1");
        } catch (error) {
            expect(error.response.status).toEqual(404);
        }
    });

    // 5. Test som sjekker at serverfeil (500) håndteres riktig når en spesifikk oppgave hentes.
    // test.skip("Fetch task (500 Internal Server error)", async () => {
    //     let actualGet = taskService.get;
    //     taskService.get = jest.fn(() => Promise.reject()); // Mock taskService.get til å kaste en feil.

    //     await expect(axios.get("/api/v1/tasks/1"))
    //     .rejects
    //     .toThrow("Request failed with status code 500");

    //     taskService.get = actualGet; // Gjenopprett den opprinnelige funksjonen etter testen.
    // });
});

describe("Create new task (POST)", () => {
    // 6. Test som sjekker at en ny oppgave opprettes riktig (201 Created).
    test("Create new task (201 Created)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false }; // Ny oppgave å opprette.
        const response = await axios.post("/api/v1/tasks", newTask);

        // Sjekker at statuskoden er 201 (Created).
        expect(response.status).toEqual(201);
        // Sjekker at Location-headeren inneholder riktig URL for den nye oppgaven.
        expect(response.headers.location).toEqual("tasks/4");
    });

    // 7. Test som sjekker at 400 Bad Request returneres når en oppgave mangler nødvendig informasjon.
    test("Create new task (400 Bad Request)", async () => {
        const newTaskMissingId = { title: 'Ny oppgave', done: false }; // Oppgave uten ID.
        expect.assertions(1); // Sørger for at minst én forventning blir sjekket.

        try {
            await axios.post("/api/v1/tasks", newTaskMissingId);
        } catch (error) {
            expect(error.response.status).toEqual(400);
        }
    });

    // 8. Test som sjekker at serverfeil (500) håndteres riktig ved opprettelse av ny oppgave.
    test("Create new task (500 Internal Server error)", async () => {
        const newTaskNullValues = { id: null, title: null, done: false }; // Oppgave med ugyldige verdier.
        expect.assertions(1); // Sørger for at minst én forventning blir sjekket.

        try {
            await axios.post("/api/v1/tasks", newTaskNullValues);
        } catch (error) {
            expect(error.response.status).toEqual(500);
        }
    });
});

describe("Delete task (DELETE)", () => {
    // 9. Test som sjekker at en oppgave slettes riktig (200 OK).
    test("Delete task (200 OK)", async () => {
        const response = await axios.delete("/api/v1/tasks/2");

        // Sjekker at statuskoden er 200 (OK).
        expect(response.status).toEqual(200);
    });

    // 10. Test som sjekker at serverfeil (500) håndteres riktig ved sletting av oppgave.
    test("Delete task (500 Internal Server error)", async () => {
        let actualDelete = taskService.delete;
        taskService.delete = jest.fn(() => Promise.reject()); // Mock taskService.delete til å kaste en feil.

        await expect(axios.delete("/api/v1/tasks/2"))
        .rejects
        .toThrow("Request failed with status code 500");

        taskService.delete = actualDelete; // Gjenopprett den opprinnelige funksjonen etter testen.
    });
});
