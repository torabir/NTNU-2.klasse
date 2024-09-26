import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { Card, Row, Column, Form, Button } from './widgets';
import taskService, { Task } from './task-service';

class TaskList extends Component {
  tasks: Task[] = [];

// A: 
// Legger til en metode for å oppdatere den gitte task basert på id når checkbox endres: 
toggleTaskDone(taskId: number) {
  // Oppdaterer 'done'-statusen for riktig oppgave LOKALT
  this.tasks = this.tasks.map((task) => {   
    // Sjekker om den aktuelle oppgaven har samme id som taskId
    if (task.id === taskId) {
    // Lager et nytt Task-objekt med oppdatert 'done'-status
    // Kan brukes for å kun endre én egenskap i objektet:  // const updatedTask = { ...task, done: !task.done };

      const updatedTask = {
        id: task.id,         // Beholder den opprinnelige id-en
        title: task.title,  // Beholder den opprinnelige tittelen
        done: !task.done    // Toggler 'done'-statusen (bytter mellom true og false)
      };

      // Sender oppdateringen til serveren for å lagre den permanent
      // Legger inn id og data som parametre i funksjonen
      taskService.update(taskId, {done: updatedTask.done})
        .then( () => {
          console.info(`Task ${taskId} successfully updated on server`);
        })
        .catch((error) => {
          console.error(`Failed to update task ${taskId} on server:`, error); 
        })
        console.log('Oppdaterer task:', taskId, 'med done-status:', updatedTask.done);

      return updatedTask;  // Returnerer den oppdaterte oppgaven
    } else {
      return task; // Returnerer oppgaven uendret hvis id-en ikke matcher
    }
    
  }); 

  // Oppdater visningen ved å sette ny state
  this.setState({ tasks: this.tasks });
}
 

  render() {
    return (
      <Card title="Tasks">
      {/*A: Legger til 1 rad med 2 kolonner for oversifter:  */}
          <Row>
          <Column><strong>Title</strong></Column>
          <Column><strong>Done</strong></Column>
          <Column><strong>Delete</strong></Column>
          </Row>
        {this.tasks.map((task) => (
          <Row key={task.id}>
            <Column>{task.title}</Column>
          {/* B: Checkbox for å markere oppgaven som done/ikke done */}
            <Column><input type="checkbox" checked = {task.done} onChange={() => this.toggleTaskDone(task.id)}/></Column>
            <Column>{"delete"}</Column>
          </Row>
        ))}
      </Card>
    );
  }

  // A: 
  mounted() {
    taskService.getAll().then((tasks) => {
      (this.tasks = tasks) // Henter oppgavene fra serveren
      this.setState({ tasks: this.tasks }); // Oppdaterer state for å vise oppgavene i UI

    });
  }
}

class TaskNew extends Component {
  title = '';

  render() {
    return (
      <Card title="New task">
        <Row>
          <Column width={1}>
            <Form.Label>Title:</Form.Label>
          </Column>
          <Column width={4}>
            <Form.Input
              type="text"
              value={this.title}
              onChange={(event) => (this.title = event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Button.Success
          onClick={() => {
            taskService.create(this.title).then(() => {
              // Reloads the tasks in the Tasks component
              TaskList.instance()?.mounted(); // .? meaning: call TaskList.instance().mounted() if TaskList.instance() does not return null
              this.title = '';
            });
          }}
        >
          Create
        </Button.Success>
      </Card>
    );
  }
}

let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <>
      <TaskList />
      <TaskNew />
    </>,
  );
