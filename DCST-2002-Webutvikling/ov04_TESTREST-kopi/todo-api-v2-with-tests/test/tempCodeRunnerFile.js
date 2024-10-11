    test.skip("Fetch all tasks (500 Internal Server Error)", async () => {
        let actualGetAll = taskService.getAll;
        taskService.getAll = jest.fn(() => Promise.reject()); // Mock taskService.getAll til å kaste en feil.

        await expect(axios.get("/api/v1/tasks"))
        .rejects
        .toThrow("Request failed with status code 500");

        taskService.getAll = actualGetAll; // Gjenopprett den opprinnelige funksjonen etter testen.
    });