// import axios from "axios";
// import todoApi from "../todo-api";
// import taskService from "../task-service";

// axios.defaults.baseURL = "http://localhost:3001";

// jest.mock("../task-service");

// const testData = [
//     { id: 1, title: "Les leksjon", done: 1 },
//     { id: 2, title: "Møt opp på forelesning", done: 0 },
//     { id: 3, title: "Gjør øving", done: 0 },
// ];

// let webServer;
// beforeAll(() => (webServer = todoApi.listen(3001)));
// afterAll(() => webServer.close());

// describe("Fetch tasks (GET)", () => {
//     test("Fetch all tasks (200 OK)", async () => {
//         taskService.getAll = jest.fn(() => Promise.resolve(testData));

//         const response = await axios.get("/api/v1/tasks");
//         expect(response.status).toEqual(200);
//         expect(response.data).toEqual(testData);
//     });

//     test("Fetch task (200 OK)", async () => {
//         const expected = [testData[0]];
//         taskService.get = jest.fn(() => Promise.resolve(expected));

//         const response = await axios.get("/api/v1/tasks/1");
//         expect(response.status).toEqual(200);
//         expect(response.data).toEqual(expected);
//     });

//     test("Fetch all tasks (500 Internal Server Error)", async () => {
//         taskService.getAll = jest.fn(() => Promise.reject());

//         await expect(() => axios.get("/api/v1/tasks"))
//         .rejects
//         .toThrow("Request failed with status code 500");
//     });

//     test("Fetch task (404 Not Found)", async () => {
//         taskService.get = jest.fn(() => Promise.resolve([]));
//         expect.assertions(1);

//         try {
//             const response = await axios.get("/api/v1/tasks/1");
//         } catch (error) {
//             expect(error.response.status).toEqual(404);
//         }
//     });

//     test("Fetch task (500 Internal Server error)", async () => {
//         taskService.get = jest.fn(() => Promise.reject());

//         await expect(() => axios.get("/api/v1/tasks/1"))
//         .rejects
//         .toThrow("Request failed with status code 500");
//     });
// });

// describe("Create new task (POST)", () => {
//     test("Create new task (201 Created)", async () => {
//         const newTask = { id: 4, title: "Ny oppgave", done: false };
//         taskService.create = jest.fn(() => Promise.resolve());

//         const response = await axios.post("/api/v1/tasks", newTask);
//         expect(response.status).toEqual(201);
//         expect(response.headers.location).toEqual("tasks/4");
//     });

//     test("Create new task (400 Bad Request)", async () => {
//         const newTaskMissingId = { title: "Ny oppgave", done: false };
//         taskService.create = jest.fn(() => Promise.resolve());
//         expect.assertions(1); 

//         try {
//             const response = await axios.post("/api/v1/tasks", newTaskMissingId);
//         } catch (error) {
//             expect(error.response.status).toEqual(400);
//         }
//     });

//     test("Create new task (500 Internal Server error)", async () => {
//         const newTask = { id: 4, title: "Ny oppgave", done: false };
//         taskService.create = jest.fn(() => Promise.reject());

//         await expect(() => axios.post("/api/v1/tasks", newTask))
//         .rejects
//         .toThrow("Request failed with status code 500");
//     });
// });

// describe("Delete task (DELETE)", () => {
//     test("Delete task (200 OK)", async () => {
//         taskService.delete = jest.fn(() => Promise.resolve());

//         const response = await axios.delete("/api/v1/tasks/1");
//         expect(response.status).toEqual(200);
//     });

//     test("Delete task (500 Internal Server error)", async () => {
//         taskService.delete = jest.fn(() => Promise.reject());

//         await expect(() => axios.delete("/api/v1/tasks/2"))
//         .rejects
//         .toThrow("Request failed with status code 500");
//     });
// });

import axios from "axios";
import todoApi from "../todo-api";
import taskService from "../task-service";
import { response } from "express";

axios.defaults.baseURL = "http://localhost:3001";

jest.mock("../task-service");

const testData = [
    { id: 1, title: "Les leksjon", done: 1 },
    { id: 2, title: "Møt opp på forelesning", done: 0 },
    { id: 3, title: "Gjør øving", done: 0 },
];

let webServer;
beforeAll(() => (webServer = todoApi.listen(3001)));
afterAll(() => webServer.close());

describe("Fetch tasks (GET)", () => {
    test("Fetch all tasks (200 OK)", async () => {
        taskService.getAll = jest.fn(() => Promise.resolve(testData));

        const response = await axios.get("/api/v1/tasks");
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testData);
    });

    test("Fetch task (200 OK)", async () => {
        taskService.get = jest.fn(() => Promise.resolve(testData[0]));

        const response = await axios.get("/api/v1/tasks/1");
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testData[0]);
    });

    test("Fetch all tasks (500 Internal Server Error)", async () => {
        taskService.getAll = jest.fn(() => Promise.reject(new Error()));

        expect.assertions(1);
        try {
            const response = await axios.get("/api/v1/tasks");
        } catch (error) {
            expect(error.response.status).toEqual(500);
        }
    });

    test("Fetch task (404 Not Found)", async () => {
        taskService.get = jest.fn(() => Promise.resolve([]));

        expect.assertions(1);
        try {
            const response = await axios.get("/api/v1/tasks/999");
        } catch (error) {
            expect(error.response.status).toEqual(404);
        }
    });
});

describe("Create new task (POST)", () => {
    test("Create new task (201 Created)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false };
        taskService.create = jest.fn(() => Promise.resolve());

        const response = await axios.post("/api/v1/tasks", newTask);

        expect(response.status).toEqual(201);
        expect(response.headers.location).toEqual("tasks/4");
    });

    test("Create new task (400 Bad Request)", async () => {
        const newTask = { title: "Ny oppgave", done: false };
        taskService.create = jest.fn(() => Promise.reject(new Error()));

        expect.assertions(1);
        try {
            const response = await axios.post("/api/v1/tasks", newTask);
        } catch (error) {
            expect(error.response.status).toEqual(400);
        }
    });

    test("Create new task (500 Internal Server error)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false };
        taskService.create = jest.fn(() => Promise.reject(new Error()));

        expect.assertions(1);
        try {
            const response = await axios.post("/api/v1/tasks", newTask);
        } catch (error) {
            expect(error.response.status).toEqual(500);
        }
    });
});

describe("Delete task (DELETE)", () => {
    test("Delete task (200 OK)", async () => {
        taskService.delete = jest.fn(() => Promise.resolve());

        const response = await axios.delete("/api/v1/tasks/1"); // men den slette ingeting eller what?

        expect(response.status).toEqual(200);
    });
});

