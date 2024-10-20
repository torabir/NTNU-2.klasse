import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import taskService, { Task } from '../src/task-service';
// import taskService from '../src/task-service';


const testTasks: Task[] = [
  { id: 1, title: 'Les leksjon', done: false },
  { id: 2, title: 'Møt opp på forelesning', done: false },
  { id: 3, title: 'Gjør øving', done: false },
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE Tasks', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    taskService
      .create(testTasks[0].title, 'Beskrivelse for oppgave 1') // Legger til description
      .then(() => taskService.create(testTasks[1].title, 'Beskrivelse for oppgave 2')) // Create testTask[1] after testTask[0] has been created
      .then(() => taskService.create(testTasks[2].title, 'Beskrivelse for oppgave 3')) // Create testTask[2] after testTask[1] has been created
      .then(() => done()); // Call done() after testTask[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});



describe('Fetch tasks (GET)', () => {
  test.skip('Fetch all tasks (200 OK)', (done) => {
    axios.get('/tasks').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks);
      done();
    });
  });

  test.skip('Fetch task (200 OK)', (done) => {
    axios.get('/tasks/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks[0]);
      done();
    });
  });

  test('Fetch task (404 Not Found)', (done) => {
    axios
      .get('/tasks/4')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new task (POST)', () => {
  test('Create new task (200 OK)', (done) => {
    axios.post('/tasks', { title: 'Ny oppgave' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ id: 4 });
      done();
    });
  });
});

describe('Delete task (DELETE)', () => {
  test('Delete task (200 OK)', (done) => {
    axios.delete('/tasks/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});


// A: 
//** */
// 2. Test for å oppdatere en oppgave (PUT)

test('Update task (200 OK)', (done) => {
  axios
    .put('/tasks/1', {
      title: 'Oppdatert oppgave',
      description: 'Oppdatert beskrivelse',
      done: true,
    })
    .then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
});

// 3. Test for å opprette oppgave med manglende felt (400 Bad Request)

test('Create task with missing title (400 Bad Request)', (done) => {
  axios
    .post('/tasks', { description: 'Beskrivelse uten tittel' })
    .then((_response) => done(new Error()))
    .catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
});

// 1. Test for mysql-pool type casting for TINY boolean


test('MySQL pool typeCast should convert TINY(1) to boolean', () => {
  const field = { type: 'TINY', length: 1, string: () => '1' };
  const result = pool.config.connectionConfig.typeCast(field, () => {});
  
  expect(result).toBe(true);
});

test('MySQL pool typeCast should not convert non-TINY fields', () => {
  const field = { type: 'VARCHAR', length: 255, string: () => 'test' };
  const result = pool.config.connectionConfig.typeCast(field, () => 'test');
  
  expect(result).toBe('test');
});

// 2: Enkel test for taskService.getAll()

test('taskService.getAll() should return all tasks', async () => {
  const tasks = await taskService.getAll();

  expect(tasks).toHaveLength(3); // Forventer at vi får 3 oppgaver
  expect(tasks[0].title).toBe('Les leksjon');
  expect(tasks[1].title).toBe('Møt opp på forelesning');
  expect(tasks[2].title).toBe('Gjør øving');
});
