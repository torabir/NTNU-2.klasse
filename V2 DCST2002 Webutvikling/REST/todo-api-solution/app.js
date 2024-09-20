import express from 'express';
import taskRouter from './router/task-router';
import listRouter from './router/list-router';

const app = express();
app.use(express.json());

const ROOT_PATH = '/api/v1/';
const PORT = 3000;

app.use(ROOT_PATH, taskRouter);
app.use(ROOT_PATH, listRouter);

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
});