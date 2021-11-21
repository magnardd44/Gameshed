import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';
import { history, Home, ReviewHome } from '../src/home-components';

//import { gameService } from '../src/services/game-service';
import { ColumnCentre, Form, Card, Alert, Button, Container, Column } from '../src/widgets';

describe('Home component', () => {
  test('Home component default', () => {
    const wrapper = shallow(<Home />);

    expect(wrapper).toMatchSnapshot();
  });
});

describe('ReviewHome component', () => {
  test('ReviewHome component default', () => {
    const wrapper = shallow(<ReviewHome />);

    expect(wrapper).toMatchSnapshot();
  });
});
