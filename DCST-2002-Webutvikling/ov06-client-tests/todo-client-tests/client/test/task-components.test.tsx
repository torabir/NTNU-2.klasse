import * as React from 'react';
import { TaskList, TaskNew, TaskEdit, TaskDetails } from '../src/task-components'; // Importerer TaskList og TaskNew-komponenter
import { shallow } from 'enzyme'; // Importerer shallow for å teste komponentene
import { Form, Button } from '../src/widgets'; // Importerer widgets-komponenter som brukes i TaskNew
import { NavLink } from 'react-router-dom'; // Importerer NavLink for navigasjon
import toJson from 'enzyme-to-json';
import taskService from '../src/task-service'; // Importerer taskService for mocking

// Mocking (simulering) av TaskService for testing
jest.mock('../src/task-service', () => ({
  getAll: jest.fn(() => Promise.resolve([
    { id: 1, title: 'Les leksjon', done: false },
    { id: 2, title: 'Møt opp på forelesning', done: false },
    { id: 3, title: 'Gjør øving', done: false },
  ])),
  get: jest.fn(() => Promise.resolve({
    id: 1, title: 'Les leksjon', description: 'Les kapittel 1', done: false
  })),
  create: jest.fn(() => Promise.resolve(4)), // Mock for create, returnerer id-en til en ny oppgave
  update: jest.fn(() => Promise.resolve()),  // Mock for update, løser bare et promise uten retur
  delete: jest.fn(() => Promise.resolve())   // Mock for delete, løser bare et promise uten retur
}));

describe('Task component tests', () => {
  // Test for å sjekke at TaskList tegner opp riktig
  test('TaskList draws correctly', (done) => {
    const wrapper = shallow(<TaskList />); // Renderer TaskList-komponenten

    // Vent for at asynkrone operasjoner fullføres
    setTimeout(() => {
      // Forventer at TaskList inneholder lenker til oppgaver med riktig tekst
      expect(
        wrapper.containsAllMatchingElements([
          <NavLink to="/tasks/1">Les leksjon</NavLink>,
          <NavLink to="/tasks/2">Møt opp på forelesning</NavLink>,
          <NavLink to="/tasks/3">Gjør øving</NavLink>,
        ])
      ).toEqual(true);
      done(); // Angir at testen er ferdig
    }, 0);
  });

  // Test for å sjekke at TaskNew setter riktig URL når en oppgave opprettes
  test('TaskNew correctly sets location on create', (done) => {
    const wrapper = shallow(<TaskNew />); // Renderer TaskNew-komponenten

    // Simulerer at brukeren skriver "Kaffepause" i input-feltet
    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Kaffepause' } });
    
    // Forventer at input-feltet har verdien "Kaffepause"
    expect(wrapper.containsMatchingElement(<Form.Input value="Kaffepause" />)).toEqual(true);

    // Simulerer at brukeren klikker på "Lagre" knappen
    wrapper.find(Button.Success).simulate('click');

    // Vent for at asynkrone operasjoner fullføres
    setTimeout(() => {
      // Forventer at brukeren omdirigeres til oppgavelisten med den nye oppgaven (#/tasks/4)
      expect(location.hash).toEqual('#/tasks/4');
      done(); // Angir at testen er ferdig
    }, 0);
  });
});

// Test for å sjekke at TaskDetails tegner opp riktig
describe('TaskDetails component tests', () => {
  test('TaskDetails draws correctly', (done) => {
    jest.setTimeout(10000); // Øk timeout til 10 sekunder
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />); // Renderer TaskDetails-komponenten
    
    // Simulerer at taskService returnerer en oppgave med spesifikke detaljer
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.containsMatchingElement(<div>Title: Les leksjon</div>)).toBe(true);
      expect(wrapper.containsMatchingElement(<div>Description: Les kapittel 1</div>)).toBe(true);
      done(); // Angir at testen er ferdig
    }, 0);
  });
});

test('TaskDetails snapshot test', () => {
  const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);
  
  // Tar et snapshot av komponentens nåværende tilstand
  expect(toJson(wrapper)).toMatchSnapshot();
});

// Del 3: 
// Tester for TaskEdit:

describe('TaskEdit component tests', () => {
  // Test for å sjekke om TaskEdit oppdaterer oppgaven riktig
  test('TaskEdit updates task correctly', (done) => {
    jest.setTimeout(10000); // Øk timeout til 10 sekunder
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />); // Renderer TaskEdit-komponenten

    // Simulerer at brukeren endrer tittel på oppgaven
    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Ny tittel' } });
    
    // Simulerer at brukeren klikker på "Save"-knappen
    wrapper.find(Button.Success).simulate('click');
    
    setTimeout(() => {
      // Sjekker at taskService.update ble kalt med den oppdaterte oppgaven
      expect(taskService.update).toHaveBeenCalledWith({
        id: 1,
        title: 'Ny tittel',
        description: 'Les kapittel 1',
        done: false
      });
      done();
    }, 0);
  });

  // Test for å sjekke at TaskEdit sletter en oppgave riktig
  test('TaskEdit deletes task correctly', (done) => {
    jest.setTimeout(10000); // Øk timeout til 10 sekunder
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />); // Renderer TaskEdit-komponenten

    // Simulerer at brukeren klikker på "Delete"-knappen
    wrapper.find(Button.Danger).simulate('click');
    
    setTimeout(() => {
      // Sjekker at taskService.delete ble kalt med riktig id
      expect(taskService.delete).toHaveBeenCalledWith(1);
      done();
    }, 0);
  });
});

// Testing for feilhåndtering (simulerer feil i TaskService): 

describe('TaskEdit error handling tests', () => {
  // Test for å sjekke feilhåndtering ved oppdatering av en oppgave
  test('TaskEdit handles update errors', (done) => {
    jest.setTimeout(10000); // Øk timeout til 10 sekunder
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);

    // Simulerer at brukeren endrer tittel på oppgaven
    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Ny tittel' } });

    // Simulerer at brukeren klikker på "Save"-knappen
    wrapper.find(Button.Success).simulate('click');
    
    setTimeout(() => {
      // Sjekker at en feil vises via Alert-komponenten
      expect(wrapper.containsMatchingElement(<div>Error updating task: Network error</div>)).toBe(true);
      done();
    }, 0);
  });
});
