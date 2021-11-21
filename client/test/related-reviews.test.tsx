import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';
import { history, RelatedReviews } from '../src/related-reviews';

import { ColumnCentre, Form, Card, Alert, Button, Container, Column } from '../src/widgets';

const mockAdapter = new MockAdapter(axios);

describe('RelatedReviews component', () => {
  test('RelatedReviews component default', () => {
    const wrapper = shallow(<RelatedReviews />);

    expect(wrapper).toMatchSnapshot();
  });
});
