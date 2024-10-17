import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import taskService, { Task } from './task-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

/**
 * Renders task list.
 */
export class TaskList extends Component {
  tasks: Task[] = [];

  render() {
    return (
      <>
        <Card title="Tasks">
          {this.tasks.map((task) => (
            <Row key={task.id}>
              <Column>
                <NavLink to={'/tasks/' + task.id}>{task.title}</NavLink>
              </Column>
            </Row>
          ))}
        </Card>
        <Button.Success onClick={() => history.push('/tasks/new')}>New task</Button.Success>
      </>
    );
  }

  mounted() {
    taskService
      .getAll()
      .then((tasks) => (this.tasks = tasks))
      .catch((error) => Alert.danger('Error getting tasks: ' + error.message));
  }
}

/**
 * Renders a specific task.
 */
export class TaskDetails extends Component<{ match: { params: { id: number } } }> {
  task: Task = { id: 0, title: '', done: false };

  render() {
    return (
      <>
        <Card title="Task">
          <Row>
            <Column width={2}>Title:</Column>
            <Column>{this.task.title}</Column>
          </Row>
          <Row>
            <Column width={2}>Description:</Column>
          </Row>
          <Row>
            <Column width={2}>Done:</Column>
            <Column>
              <Form.Checkbox checked={this.task.done} onChange={() => {}} disabled />
            </Column>
          </Row>
        </Card>
        <Button.Success
          onClick={() => history.push('/tasks/' + this.props.match.params.id + '/edit')}
        >
          Edit
        </Button.Success>
      </>
    );
  }

  mounted() {
    taskService
      .get(this.props.match.params.id)
      .then((task) => (this.task = task))
      .catch((error) => Alert.danger('Error getting task: ' + error.message));
  }
}

/**
 * Renders form to edit a specific task.
 */
export class TaskEdit extends Component<{ match: { params: { id: number } } }> {
  task: Task = { id: 0, title: '', done: false };

  render() {
    return (
      <>
        <Card title="Edit task">
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.task.title}
                onChange={(event) => (this.task.title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Description:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea value="" onChange={() => {}} rows={10} disabled />
            </Column>
          </Row>
          <Row>
            <Column width={2}>Done:</Column>
            <Column>
              <Form.Checkbox
                checked={this.task.done}
                onChange={(event) => (this.task.done = event.currentTarget.checked)}
              />
            </Column>
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={() => Alert.info('Not yet implemented')}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Danger onClick={() => Alert.info('Not yet implemented')}>Delete</Button.Danger>
          </Column>
        </Row>
      </>
    );
  }

  mounted() {
    taskService
      .get(this.props.match.params.id)
      .then((task) => (this.task = task))
      .catch((error) => Alert.danger('Error getting task: ' + error.message));
  }
}

/**
 * Renders form to create new task.
 */
export class TaskNew extends Component {
  title = '';

  render() {
    return (
      <>
        <Card title="New task">
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.title}
                onChange={(event) => (this.title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Description:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea value="" onChange={() => {}} rows={10} disabled />
            </Column>
          </Row>
        </Card>
        <Button.Success
          onClick={() => {
            taskService
              .create(this.title)
              .then((id) => history.push('/tasks/' + id))
              .catch((error) => Alert.danger('Error creating task: ' + error.message));
          }}
        >
          Create
        </Button.Success>
      </>
    );
  }
}

// Ny class: 
// A: 
export class CodeRunner extends Component {
  code: string = ''; // Holder koden som brukeren skriver
  language: string = 'javascript'; // Standardvalget for språk

  output: string = ''; // Resultatet fra standard output
  error: string = ''; // Feilmeldinger fra standard error
  exitStatus: number = 0; // Exit status fra prosessen

  // Funksjon som sender koden og valgt språk til serveren for kjøring
  runCode() {
    axios
      .post('/api/run-code', { code: this.code, language: this.language })
      .then((response) => {
        this.output = response.data.output;
        this.error = response.data.error;
        this.exitStatus = response.data.exitStatus;
      })
      .catch((error) => {
        Alert.danger('Error running code: ' + error.message);
      });
  }

  render() {
    return (
      <Card title="Run Code">
        {/* Velg språk */}
        <Form.Select
          value={this.language}
          onChange={(event) => (this.language = event.currentTarget.value)}
        >
          <option value="javascript">JavaScript (Node.js)</option>
          <option value="python">Python</option>
          <option value="bash">Bash</option>
        </Form.Select>

        {/* Kode-innskrivning */}
        <Form.Textarea
          value={this.code}
          onChange={(event) => (this.code = event.currentTarget.value)}
          rows={10}
          placeholder="Write your code here..."
        />

        {/* Kjør kode */}
        <Button.Success onClick={() => this.runCode()}>Run</Button.Success>

        {/* Resultater */}
        <Card title="Results">
          <p><b>Standard Output:</b> {this.output}</p>
          <p><b>Standard Error:</b> {this.error}</p>
          <p><b>Exit Status:</b> {this.exitStatus}</p>
        </Card>
      </Card>
    );
  }
}