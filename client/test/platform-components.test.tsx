import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';
import { history, Platform } from '../src/platform-components';

import { ColumnCentre, Form, Card, Alert, Button, Container, Column } from '../src/widgets';

const mockAdapter = new MockAdapter(axios);

describe('Platform component', () => {
  test('Platform component default', () => {
    const wrapper = shallow(<Platform />);

    expect(wrapper).toMatchSnapshot();
  });
});