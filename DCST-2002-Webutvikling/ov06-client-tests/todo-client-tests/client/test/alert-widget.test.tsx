import * as React from 'react';
import { Alert, Card, Row, Column, Button, Form, NavBar} from '../src/widgets';
import { shallow } from 'enzyme';

describe('Alert tests', () => {
  test('No alerts initially', () => {
    const wrapper = shallow(<Alert />);

    expect(wrapper.matchesElement(<div></div>)).toEqual(true);
  });

  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
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

      done();
    });
  });

  test('Close alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
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

      wrapper.find('button.btn-close').simulate('click');

      expect(wrapper.matchesElement(<div></div>)).toEqual(true);

      done();
    });
  });

    //** */ A: 
    // 
    // Test som åpner 3 Alert meldinger, og lukker den 2. meldingen: 
  test('Open 3 alerts and close the second one', (done) => {
    const wrapper = shallow(<Alert />);

    // Åpner tre meldinger
    Alert.danger('Message 1');
    Alert.danger('Message 2');
    Alert.danger('Message 3');

    // Vent for å sikre at meldingene vises
    setTimeout(() => {
      // Sjekker at alle tre meldinger vises
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              Message 1
              <button />
            </div>
            <div>
              Message 2
              <button />
            </div>
            <div>
              Message 3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      // Lukker den andre meldingen
      wrapper.find('button').at(1).simulate('click');

      // Vent for å sjekke at meldingen er lukket
      setTimeout(() => {
        // Sjekker at den andre meldingen er lukket, og de to andre forblir
        expect(
          wrapper.matchesElement(
            <div>
              <div>
                Message 1
                <button />
              </div>
              <div>
                Message 3
                <button />
              </div>
            </div>
          )
        ).toEqual(true);

        done();
      });
    });
  });
});

// B
//** */
// 1. Test for Card-komponenten:

test('Card renders correctly', async () => {
  const wrapper = shallow(
    <Card title="Test Card">
      <p>Card content</p>
    </Card>
  );

  // Await rendering to finish
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(wrapper.containsMatchingElement(<h5 className="card-title">Test Card</h5>)).toEqual(true);
  expect(wrapper.containsMatchingElement(<p>Card content</p>)).toEqual(true);
});

// 2. Test for Row-komponenten:

test('Row renders children', async () => {
  const wrapper = shallow(
    <Row>
      <div>Row content</div>
    </Row>
  );

  // Await rendering to finish
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(wrapper.contains(<div>Row content</div>)).toEqual(true);
});


// 3. Test for Column-komponenten:

test('Column renders with width', async () => {
  const wrapper = shallow(
    <Column width={3}>
      <p>Column content</p>
    </Column>
  );

  // Await rendering to finish
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(wrapper.hasClass('col-3')).toEqual(true);
  expect(wrapper.contains(<p>Column content</p>)).toEqual(true);
});


// 4. Test for Button.Success-komponenten:

test('Button.Success renders and handles click', async () => {
  const onClick = jest.fn();
  const wrapper = shallow(<Button.Success onClick={onClick}>Click Me</Button.Success>);

  // Simulate button click
  wrapper.simulate('click');

  // Await any potential side-effects
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(onClick).toHaveBeenCalled();
  expect(wrapper.text()).toEqual('Click Me');
});


// 5. Test for Form.Input-komponenten:

test('Form.Input renders and handles change', async () => {
  const onChange = jest.fn();
  const wrapper = shallow(<Form.Input type="text" value="Test" onChange={onChange} />);

  // Simulate input change
  wrapper.simulate('change', { currentTarget: { value: 'New Value' } });

  // Await change handler
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(onChange).toHaveBeenCalled();
  expect(wrapper.prop('value')).toEqual('Test');
});


// 6. Test for Form.Checkbox-komponenten:

test('Form.Checkbox renders and handles change', async () => {
  const onChange = jest.fn();
  const wrapper = shallow(<Form.Checkbox checked={false} onChange={onChange} />);

  // Simulate checkbox change
  wrapper.simulate('change', { currentTarget: { checked: true } });

  // Await change handler
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(onChange).toHaveBeenCalled();
  expect(wrapper.prop('checked')).toEqual(false);
});

// 7: Test for Form.Select-komponenten:


test('Form.Select renders and handles change', async () => {
  const onChange = jest.fn();
  const wrapper = shallow(
    <Form.Select value="1" onChange={onChange}>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Form.Select>
  );

  // Simulate select change
  wrapper.simulate('change', { currentTarget: { value: '2' } });

  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(onChange).toHaveBeenCalled();
  expect(wrapper.prop('value')).toEqual('1');
});