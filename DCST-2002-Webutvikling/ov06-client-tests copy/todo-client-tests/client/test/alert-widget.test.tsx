import * as React from 'react';
import { Alert } from '../src/widgets'; // Importerer Alert-komponenten fra widgets
import { shallow } from 'enzyme'; // Importerer shallow-rendring fra Enzyme for å teste React-komponenter

// Gruppe med tester for Alert-komponenten
describe('Alert tests', () => {
  
  // Test for å sikre at det ikke er noen alerts til stede ved oppstart
  test('No alerts initially', () => {
    const wrapper = shallow(<Alert />); // Rendrer Alert-komponenten "shallow" (uten underkomponenter)

    // Forventer at Alert-komponenten rendres som en tom div når det ikke er noen alerts
    expect(wrapper.matchesElement(<div></div>)).toEqual(true);
  });

  // Test for å vise en alert-melding
  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />); // Rendrer Alert-komponenten

    Alert.danger('test'); // Trigger en "danger" alert med meldingen "test"

    // Venter litt for at alert-meldingen skal vises asynkront
    setTimeout(() => {
      // Sjekker at Alert-komponenten nå inneholder en div med meldingen og en knapp
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done(); // Angir at testen er ferdig
    });
  });

  // Test for å lukke en alert-melding
  test('Close alert message', (done) => {
    const wrapper = shallow(<Alert />); // Rendrer Alert-komponenten

    Alert.danger('test'); // Trigger en "danger" alert med meldingen "test"

    // Venter litt for at alert-meldingen skal vises asynkront
    setTimeout(() => {
      // Sjekker at Alert-komponenten nå inneholder meldingen "test" og en knapp
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      // Simulerer et klikk på "lukk" knappen i Alert-komponenten
      wrapper.find('button.btn-close').simulate('click');

      // Etter klikk på knappen, sjekker at Alert er tilbake til en tom div
      expect(wrapper.matchesElement(<div></div>)).toEqual(true);

      done(); // Angir at testen er ferdig
    });
  });
});

// Del 2: Ny test som åpner flere alerts og lukker en spesifikk
// Del 2: Ny test som åpner flere alerts og lukker en spesifikk
describe('Alert tests', () => {
  test('Open 3 alerts and close the second one', (done) => {
    jest.setTimeout(10000); // Legg til dette for å øke timeout til 10 sekunder
    const wrapper = shallow(<Alert />); // Rendrer Alert-komponenten

    // Åpner tre alerts med forskjellige meldinger
    Alert.info('Message 1');
    Alert.info('Message 2');
    Alert.info('Message 3');

    // Venter til meldinger er synlige
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.containsMatchingElement(<div>Message 1</div>)).toBe(true);
      expect(wrapper.containsMatchingElement(<div>Message 2</div>)).toBe(true);
      expect(wrapper.containsMatchingElement(<div>Message 3</div>)).toBe(true);

      // Simulerer klikk på lukk-knappen for den andre meldingen
      wrapper.find('button').at(1).simulate('click');

      // Venter til meldingen blir fjernet
      setTimeout(() => {
        wrapper.update();
        expect(wrapper.containsMatchingElement(<div>Message 1</div>)).toBe(true);
        expect(wrapper.containsMatchingElement(<div>Message 2</div>)).toBe(false);
        expect(wrapper.containsMatchingElement(<div>Message 3</div>)).toBe(true);
        done(); // Angir at testen er ferdig
      }, 0);
    }, 0);
  });
});

