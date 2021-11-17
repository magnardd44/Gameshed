import * as React from 'react';
import { Alert, Container, ColumnCentre } from '../src/widgets';
import { shallow } from 'enzyme';

describe('Container tests', () => {
  test('Container aligns text center', () => {
    const wrapper = shallow(<Container textalign="center"></Container>);
    expect(
      wrapper.matchesElement(<div className="container my-5 mx-auto text-center"></div>)
    ).toEqual(true);
  });
});

describe('ColoumnCentre tests', () => {
  test('ColumnCentre width test', () => {
    const wrapper = shallow(<ColumnCentre width={3}></ColumnCentre>);
    expect(wrapper.matchesElement(<div className="col-3"></div>)).toEqual(true);
  });
});

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
});
