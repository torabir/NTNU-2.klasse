import * as React from 'react';
import { TaskList, TaskNew, TaskDetails, TaskEdit } from '../src/task-components'; // lagt til TaskDetails, TaskEdit 
import * as Taskservice from '../src/task-service'; // lagt til . unødvendig fordi service mockes uansett. 
import { shallow } from 'enzyme';
import { Form, Button, Column } from '../src/widgets'; // Lagt til widgets
import { NavLink } from 'react-router-dom';


// jest.mock('../src/task-service', () => {
//   class TaskService {
//     getAll() {
//       return Promise.resolve([
//         { id: 1, title: 'Les leksjon', done: false },
//         { id: 2, title: 'Møt opp på forelesning', done: false },
//         { id: 3, title: 'Gjør øving', done: false },
//       ]);
//     }

//     create() {
//       return Promise.resolve(4); // Same as: return new Promise((resolve) => resolve(4));
//     }
//   }
//   return new TaskService();
// });

jest.mock('../src/task-service', () => {
  class TaskService {
    getAll() {
      return Promise.resolve([
        { id: 1, title: 'Les leksjon', description: 'Les kapittel 1', done: false },
        { id: 2, title: 'Møt opp på forelesning', description: 'Møt opp i rom A101', done: false },
        { id: 3, title: 'Gjør øving', description: 'Fullfør øving 1', done: false },
      ]);
    }

    get() {
      return Promise.resolve({ id: 1, title: 'Les leksjon', description: 'Les kapittel 1', done: false });
    }

    create() {
      return Promise.resolve(4); // Returnerer en ny oppgave-id (4)
    }

    update() {
      return Promise.resolve(); // Returnerer ingenting ved oppdatering
    }

    delete() {
      return Promise.resolve(); // Returnerer ingenting ved sletting
    }
  }

  return new TaskService();
});


describe('Task component tests', () => {
  test('TaskList draws correctly', (done) => {
    const wrapper = shallow(<TaskList />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <NavLink to="/tasks/1">Les leksjon</NavLink>,
          <NavLink to="/tasks/2">Møt opp på forelesning</NavLink>,
          <NavLink to="/tasks/3">Gjør øving</NavLink>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('TaskNew correctly sets location on create', (done) => {
    const wrapper = shallow(<TaskNew />);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Kaffepause' } });
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="Kaffepause" />)).toEqual(true);

    wrapper.find(Button.Success).simulate('click');
    // Wait for events to complete
    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks/4');
      done();
    });
  });
});


// A: 
//**
// TaskDetails component tests: 

test('TaskDetails draws correctly', async () => {
  const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

  // Await mounted() and data fetching
  await new Promise((resolve) => setTimeout(resolve, 0));

  console.log(wrapper.debug()); // Denne vil vise hele strukturen til wrapperen

  expect(
    wrapper.containsAllMatchingElements([
      <Column>Les leksjon</Column>, // Forventet tittel
      <Column>Les kapittel 1</Column>, // Forventet beskrivelse
      <Form.Checkbox checked={false} disabled /> // Forventet "done" checkbox (ikke ferdig)
    ])
  ).toEqual(true);
});

//B 
//** */
// Snapshot: 

test('TaskDetails matches snapshot', async () => {
  const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

  // Await mounted() and data fetching
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Sammenlign wrapper med snapshot
  expect(wrapper).toMatchSnapshot();
});

// C
//** */
// Oppnå 70% dekning for statements: 

// Test for TaskEdit-komponenten:

test('TaskEdit draws correctly and updates task', async () => {
  const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);

  // Await mounted() and data fetching
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Check if the form is rendered with correct values
  expect(wrapper.find(Form.Input).prop('value')).toEqual('Les leksjon');
  expect(wrapper.find(Form.Textarea).prop('value')).toEqual('Les kapittel 1');
  expect(wrapper.find(Form.Checkbox).prop('checked')).toEqual(false);

  // Simulate form changes
  wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Ny tittel' } });
  wrapper.find(Form.Textarea).simulate('change', { currentTarget: { value: 'Ny beskrivelse' } });
  wrapper.find(Form.Checkbox).simulate('change', { currentTarget: { checked: true } });

  // Check if the form reflects the new values
  expect(wrapper.containsMatchingElement(<Form.Input value="Ny tittel" />)).toEqual(true);
  expect(wrapper.containsMatchingElement(<Form.Textarea value="Ny beskrivelse" />)).toEqual(true);
  expect(wrapper.containsMatchingElement(<Form.Checkbox checked={true} />)).toEqual(true);

  // Simulate save button click
  wrapper.find(Button.Success).simulate('click');

  // Ensure that the update service is called
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(location.hash).toEqual('#/tasks/1');
});

// Test for sletting i TaskEdit-komponenten:

test('TaskEdit deletes task and navigates away', async () => {
  const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);

  // Await mounted() and data fetching
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Simulate delete button click
  wrapper.find(Button.Danger).simulate('click');

  // Ensure that the delete service is called and navigation happens
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(location.hash).toEqual('#/tasks');
});



// ERRORS: 


// Bruker ikke async/await
// test('TaskDetails draws correctly', (done) => {
//   const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

//   // Vent til "mounted" har kjørt og oppgaven er hentet
//   setTimeout(() => {
//     console.log(wrapper.debug()); // Denne vil vise hele strukturen til wrapperen

//     expect(
//       wrapper.containsAllMatchingElements([
//         <Column>Les leksjon</Column>, // Forventet tittel
//         <Column>Les kapittel 1</Column>, // Forventet beskrivelse
//         <Form.Checkbox checked={false} disabled /> // Forventet "done" checkbox (ikke ferdig)
//       ])
//     ).toEqual(true);
//     done();
//   });
// });

// Feilen her var at jeg bruker h1, p, osv. 
// describe('TaskDetails component tests', () => {
//   test('TaskDetails draws correctly', (done) => {
//     const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

//     // Vi venter på eventer for at mock-get-tjenesten skal returnere verdier
//     setTimeout(() => {
//       console.log(wrapper.html()); // Logg ut den faktiske renderen av komponenten
//       expect(
//         wrapper.containsAllMatchingElements([
//           <h1>Task Details</h1>,
//           <p>Title: Les leksjon</p>,
//           <p>Status: Not done</p>,
//         ])
//       ).toEqual(true);
//       done();
//     });
//   });
// });
