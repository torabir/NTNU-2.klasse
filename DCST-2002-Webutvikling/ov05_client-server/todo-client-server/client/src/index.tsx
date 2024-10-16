import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { Card, Row, Column, Form, Button } from './widgets';
import taskService, { Task } from './task-service';

class TaskList extends Component {
  tasks: Task[] = [];

  // A: 
  // Legger til en metode for å oppdatere den gitte task basert på id når checkbox endres
  toggleTaskDone(taskId: number) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          done: !task.done
        };
  
        console.log('Updating task:', updatedTask);  // Legg til logging her for å se at riktig data sendes
  
        taskService.update(updatedTask)
          .then(() => {
            console.info(`Task ${taskId} successfully updated on server`);
          })
          .catch((error) => {
            console.error(`Failed to update task ${taskId} on server:`, error);
          });
  
        return updatedTask;
      } else {
        return task;
      }
    });
  
    this.setState({ tasks: this.tasks });
  }
  
  // toggleTaskDone(taskId: number) {
  //   this.tasks = this.tasks.map((task) => {
  //     if (task.id === taskId) {
  //       const updatedTask = {
  //         ...task,              // Kopierer alle egenskaper fra task
  //         done: !task.done      // Toggler done-status
  //       };
  
  //       taskService.update(updatedTask)  // Sender hele updatedTask-objektet
  //         .then(() => {
  //           console.info(`Task ${taskId} successfully updated on server`);
  //         })
  //         .catch((error) => {
  //           console.error(`Failed to update task ${taskId} on server:`, error);
  //         });
  
  //       return updatedTask;
  //     } else {
  //       return task;
  //     }
  //   });
  
  //   this.setState({ tasks: this.tasks });
  // }
  

  // B: Metode for å slette en oppgave
  deleteTask(taskId: number) {
    taskService.delete(taskId)
      .then(() => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.setState({ tasks: this.tasks });
        console.log(`Task ${taskId} successfully deleted.`);
      })
      .catch((error) => {
        console.error(`Failed to delete task ${taskId}:`, error);
      });
  }

  render() {
    return (
      <Card title="Tasks">
        {/* A: Legger til 1 rad med 3 kolonner for overskrifter */}
        <Row>
          <Column><strong>Title</strong></Column>
          <Column><strong>Done</strong></Column>
          <Column><strong>Delete</strong></Column>
        </Row>
        {this.tasks.map((task) => (
          <Row key={task.id}>
            <Column>{task.title}</Column>
            {/* B: Checkbox for å markere oppgaven som done/ikke done */}
            <Column>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => this.toggleTaskDone(task.id)}
              />
            </Column>
            <Column>
              <Button.Danger small onClick={() => this.deleteTask(task.id)}>X</Button.Danger>
            </Column>
          </Row>
        ))}
      </Card>
    );
  }

  // A: Når komponenten monteres, henter den alle oppgaver fra serveren
  mounted() {
    taskService.getAll().then((tasks) => {
      this.tasks = tasks; // Henter oppgavene fra serveren
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
              TaskList.instance()?.mounted(); // .? = call TaskList.instance().mounted() if TaskList.instance() does not return null
              this.title = ''; // Tømmer inputfeltet etter opprettelse
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
if (root) {
  createRoot(root).render(
    <>
      <TaskList />
      <TaskNew />
    </>
  );
}
