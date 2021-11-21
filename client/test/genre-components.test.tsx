import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';
import { history, Category } from '../src/genre-components';

import { ColumnCentre, Form, Card, Alert, Button, Container, Column } from '../src/widgets';

const mockAdapter = new MockAdapter(axios);

describe('Category component', () => {
  test('Category component default', () => {
    const wrapper = shallow(<Category />);

    expect(wrapper).toMatchSnapshot();
  });
});
