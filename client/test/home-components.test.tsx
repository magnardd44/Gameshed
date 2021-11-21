import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';
import { history, Home, ReviewHome } from '../src/home-components';

import userService from '../src/services/user-service';
import { ColumnCentre, Form, Card, Alert, Button, Container, Column } from '../src/widgets';

describe('Home component', () => {
  test('Home component default', () => {
    const wrapper = shallow(<Home />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Button search game', () => {
    const wrapper = shallow(<Home />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Søk' }).at(0).simulate('click');

    expect(spy).toBeCalledWith('/search');
  });

  test('Button search review', () => {
    const wrapper = shallow(<Home />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Søk' }).at(1).simulate('click');

    expect(spy).toBeCalledWith('/reviews');
  });

  test('Button add game', () => {
    const wrapper = shallow(<Home />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Legg til spill' }).simulate('click');

    expect(spy).toBeCalledWith('/addGame');
  });

  test('No register button on login', () => {
    userService.token = { id: 1, token: '' };
    const wrapper = shallow(<Home />);

    expect(wrapper.find({ children: 'Registrer deg' })).toHaveLength(0);
  });

  test('Button register user', () => {
    userService.token = null;
    const wrapper = shallow(<Home />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Registrer deg' }).simulate('click');

    expect(spy).toBeCalledWith('/user');
  });
});

describe('ReviewHome component', () => {
  test('ReviewHome component default', () => {
    const wrapper = shallow(<ReviewHome />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Button sort by genre', () => {
    const wrapper = shallow(<ReviewHome />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Søk' }).at(0).simulate('click');

    expect(spy).toBeCalledWith('/reviews-by-genre');
  });

  test('Button sort by genre', () => {
    const wrapper = shallow(<ReviewHome />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Søk' }).at(1).simulate('click');

    expect(spy).toBeCalledWith('/reviews-by-platform');
  });

  test('Button sort by stars', () => {
    const wrapper = shallow(<ReviewHome />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Søk' }).at(2).simulate('click');

    expect(spy).toBeCalledWith('/reviews-by-stars');
  });

  test('Button sort by date', () => {
    const wrapper = shallow(<ReviewHome />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Søk' }).at(3).simulate('click');

    expect(spy).toBeCalledWith('/reviews-by-date');
  });

  test('Button all reviews', () => {
    const wrapper = shallow(<ReviewHome />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Alle anmeldelser' }).simulate('click');

    expect(spy).toBeCalledWith('/publishedReviews');
  });
});
