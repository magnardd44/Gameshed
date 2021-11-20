import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { UserNav, UserData, UserPersonal, UserRegister, UserPage } from '../src/user-components';
import { Form, Card, Alert, Button, Container, Column } from '../src/widgets';
import { shallow } from 'enzyme';
import userService, { Token } from '../src/services/user-service';

jest.setTimeout(1000);

const mockAdapter = new MockAdapter(userService.axios);
const mockGlobalAdapter = new MockAdapter(axios);

beforeEach(() => {
  userService.token = null;
  userService.name = '';
  userService.email = '';
  userService.about = '';
});

window.prompt = jest.fn(() => {
  return 'password';
});

Alert.info = jest.fn(() => {});
Alert.warning = jest.fn(() => {});
Alert.success = jest.fn(() => {});

describe('UserNav component', () => {
  test('UserNav default', (done) => {
    const wrapper = shallow(<UserNav />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          // @ts-ignore
          <Button.Success>MinSide</Button.Success>
        )
      ).toEqual(false);
      expect(
        wrapper.containsMatchingElement(
          // @ts-ignore
          <Button.Success>Registrer</Button.Success>
        )
      ).toEqual(true);
      done();
    });
  });

  test('UserNav on logged in', (done) => {
    const wrapper = shallow(<UserNav />);

    mockAdapter.onPost('user/login').reply(200, { id: 1, token: 'abc' });

    wrapper.find('#emailInput').simulate('change', { currentTarget: { value: 'email' } });
    wrapper.find({ children: 'Login' }).simulate('click');

    // Wait for events to complete
    //
    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          // @ts-ignore
          <Button.Success>MinSide</Button.Success>
        )
      ).toEqual(true);
      expect(
        wrapper.containsMatchingElement(
          // @ts-ignore
          <Button.Success>Registrer</Button.Success>
        )
      ).toEqual(false);
      done();
    });
  });

  test('UserNav on logged out', (done) => {
    const wrapper = shallow(<UserNav />);

    mockAdapter.onPost('user/login').reply(200, { id: 1, token: 'abc' });
    mockAdapter.onPost('user/logout').reply(200);

    wrapper.find('#emailInput').simulate('change', { currentTarget: { value: 'email' } });
    wrapper.find({ children: 'Login' }).simulate('click');

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          // @ts-ignore
          <Button.Success>Logout</Button.Success>
        )
      ).toEqual(true);
      wrapper.find({ children: 'Logout' }).simulate('click');
      setTimeout(() => {
        expect(
          wrapper.containsMatchingElement(
            // @ts-ignore
            <Button.Success>MinSide</Button.Success>
          )
        ).toEqual(false);
        expect(
          wrapper.containsMatchingElement(
            // @ts-ignore
            <Button.Success>Registrer</Button.Success>
          )
        ).toEqual(true);
        done();
      });
    });
  });

  test('Ingen epost', (done) => {
    const wrapper = shallow(<UserNav />);

    wrapper.find({ children: 'Login' }).simulate('click');

    setTimeout(() => {
      expect(Alert.info).toBeCalled();
      done();
    });
  });

  test('Feil brukar eller passord', (done) => {
    const wrapper = shallow(<UserNav />);

    wrapper.find('#emailInput').simulate('change', { currentTarget: { value: 'email' } });
    mockAdapter.onPost('user/login').reply(400);
    wrapper.find({ children: 'Login' }).simulate('click');

    setTimeout(() => {
      expect(Alert.warning).toBeCalled();
      done();
    });
  });
});

describe('UserData component', () => {
  test('Inputs', (done) => {
    const wrapper = shallow(<UserData />);

    userService.token = { id: 0, token: 'token' };

    setTimeout(() => {
      wrapper.find('#inputName').simulate('change', { currentTarget: { value: 'abc' } });
      wrapper.find('#inputEmail').simulate('change', { currentTarget: { value: 'def' } });
      wrapper.find('#inputAbout').simulate('change', { currentTarget: { value: 'ghi' } });
      setTimeout(() => {
        expect(userService.name).toBe('abc');
        expect(userService.email).toBe('def');
        expect(userService.about).toBe('ghi');
        done();
      });
    });
  });
});

describe('UserRegister component', () => {
  test('Register new ', (done) => {
    userService.email = 'email';
    mockAdapter.onPost('user/add').reply(200, { id: 0, token: 'token' });
    mockAdapter.onPut('user').reply(200);
    mockAdapter.onGet('user').reply(200, { nick: 'abc', about: 'def', email: 'ghi' });

    const wrapper = shallow(<UserRegister />);

    wrapper.find({ children: 'Registrer ny bruker' }).simulate('click');
    setTimeout(() => {
      expect(userService.name).toEqual('abc');
      done();
    });
  });

  test('Empty password', (done) => {
    window.prompt = jest.fn(() => {
      return '';
    });

    const wrapper = shallow(<UserRegister />);

    wrapper.find({ children: 'Registrer ny bruker' }).simulate('click');
    setTimeout(() => {
      expect(Alert.info).toBeCalled();
      done();
    });
  });
});

describe('UserPersonal component', () => {
  beforeEach(() => {
    userService.token = { id: 0, token: '' };
    mockAdapter.onGet('user').reply(200, { nick: 'abc', about: 'def', email: 'ghi' });
  });

  test('Set user', (done) => {
    const wrapper = shallow(<UserPersonal />);
    mockAdapter.onPut('user').reply(200);

    wrapper.find({ children: 'Oppdater bruker' }).simulate('click');
    setTimeout(() => {
      expect(Alert.success).toBeCalled();
      done();
    });
  });

  test('Delete user', (done) => {
    const wrapper = shallow(<UserPersonal />);
    mockAdapter.onDelete('user').reply(200);

    wrapper.find({ children: 'Slett meg' }).simulate('click');
    setTimeout(() => {
      expect(userService.token).toBe(null);
      done();
    });
  });

  test('onMount', (done) => {
    const wrapper = shallow(<UserPersonal />);

    setTimeout(() => {
      done();
    });
  });
  test('onMount', (done) => {
    const wrapper = shallow(<UserPersonal />);

    setTimeout(() => {
      done();
    });
  });
  test('failedMount', (done) => {
    userService.token = null;

    const wrapper = shallow(<UserPersonal />);

    setTimeout(() => {
      expect(userService.token).toBe(null);
      done();
    });
  });
});

describe('UserPage component', () => {
  test('On logged out', (done) => {
    const wrapper = shallow(<UserPage />);

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          // @ts-ignore
          <UserRegister />
        )
      ).toEqual(true);
      expect(
        wrapper.containsMatchingElement(
          // @ts-ignore
          <UserPage />
        )
      ).toEqual(false);
      done();
    });
  });

  test('On logged in', (done) => {
    const wrapper = shallow(<UserPage />);

    userService.token = { id: 0, token: 'token' };

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          // @ts-ignore
          <UserRegister />
        )
      ).toEqual(false);
      expect(
        wrapper.containsMatchingElement(
          // @ts-ignore
          <UserPersonal />
        )
      ).toEqual(true);
      done();
    });
  });
});
