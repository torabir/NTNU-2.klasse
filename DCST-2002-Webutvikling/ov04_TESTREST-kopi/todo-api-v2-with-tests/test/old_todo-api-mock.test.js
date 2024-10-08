import axios from "axios";
import todoApi from "../todo-api";
import taskService from "../task-service";

axios.defaults.baseURL = "http://localhost:3001";

jest.mock("../task-service");

const testData = [
    { id: 1, title: "Les leksjon", done: 1 },
    { id: 2, title: "Møt opp på forelesning", done: 0 },
    { id: 3, title: "Gjør øving", done: 0 },
];

let webServer;
beforeAll(() => webServer = todoApi.listen(3001));
afterAll(() => webServer.close());

describe("Fetch tasks (GET)", () => {
    test("Fetch all tasks (200 OK)", async () => {
        taskService.getAll = jest.fn(() => Promise.resolve(testData));

        const response = await axios.get("/api/v1/tasks");
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testData);
    });

    test.("Fetch task (200 OK)", async () => {
        //todo
        taskService.get(taskId)=jest.fn(()=>Promise.resolve(testData));
        taskService.get(taskId)=jest.fn(()=>Promise.reject(testData));

        const expected = [testData[0]];
        const response = await axios.get("/api/v1/tasks/1");

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);
    });

    test.("Fetch all tasks (500 Internal Server Error)", async () => {
        //todo
    });

    test.("Fetch task (404 Not Found)", async () => {
        //todo
    });

    test.("Fetch task (500 Internal Server error)", async () => {
        //todo
    });
});

describe("Create new task (POST)", () => {
    test.("Create new task (201 Created)", async () => {
        //todo
    });

    test.("Create new task (400 Bad Request)", async () => {
        //todo
    });

    test.("Create new task (500 Internal Server error)", async () => {
        //todo
    });
});

describe("Delete task (DELETE)", () => {
    test.("Delete task (200 OK)", async () => {
        //todo
    });
});
