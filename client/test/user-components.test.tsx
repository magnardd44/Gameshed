import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  history,
  UserNav,
  UserData,
  UserPersonal,
  UserRegister,
  UserPage,
  PasswordPrompt,
} from '../src/user-components';
import { Form, Alert, Button } from '../src/widgets';
import { shallow } from 'enzyme';
import userService from '../src/services/user-service';

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
Alert.success = jest.fn(() => {});

const validToken = { id: 1, token: 'abc' };
const validUser = { nick: 'a', email: 'b', about: 'c' };

const emptyUser = {};

describe('UserNav component', () => {
  beforeEach(() => {
    userService.token = null;
  });

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
    userService.token = validToken;
    const wrapper = shallow(<UserNav />);

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

  test('Button register pressed', (done) => {
    const wrapper = shallow(<UserNav />);

    let spy = jest.spyOn(history, 'push');

    wrapper.find(Button.Success).at(1).simulate('click');

    setTimeout(() => {
      expect(history.push).toBeCalled();
      spy.mockRestore();
      done();
    });
  });

  test('UserNav on logged out', (done) => {
    userService.token = validToken;

    const wrapper = shallow(<UserNav />);

    mockAdapter.onPost('user/logout').reply(200);

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

  test('Prompt password on login', (done) => {
    const wrapper = shallow(<UserNav />);

    userService.passwordPrompt = false;
    wrapper.find('#emailInput').simulate('change', { currentTarget: { value: 'email' } });
    wrapper.find({ children: 'Login' }).simulate('click');

    setTimeout(() => {
      expect(userService.email).toEqual('email');
      expect(userService.passwordPrompt).toBe(true);
      done();
    });
  });

  test('Server error logging out', (done) => {
    const wrapper = shallow(<UserNav />);

    const spy = jest.spyOn(console, 'log');
    spy.mockImplementationOnce(() => {});

    userService.token = validToken;
    mockAdapter.onPost('user/logout').reply(401);

    wrapper.find({ children: 'Logout' }).simulate('click');

    setTimeout(() => {
      expect(spy).toBeCalled();
      spy.mockRestore();
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

  test('No data in user from server', (done) => {
    const wrapper = shallow(<UserData />);

    userService.token = validToken;
    mockAdapter.onGet('user').reply(200, emptyUser);

    userService.get_user();

    setTimeout(() => {
      expect(userService.name).toMatch('Anonym');
      expect(userService.about).toMatch('');
      done();
    });
  });

  test('Set user with no token', () => {
    expect(userService.set_user()).rejects.toEqual('No token');
  });
});

describe('UserRegister component', () => {
  test('PasswordPrompt on register new ', (done) => {
    const wrapper = shallow(<UserRegister />);

    userService.passwordPrompt = false;
    userService.token = null;

    userService.name = 'abc';
    userService.email = 'ghi';
    userService.about = 'def';

    wrapper.find({ children: 'Registrer ny bruker' }).simulate('click');
    setTimeout(() => {
      expect(userService.passwordPrompt).toBe(true);
      done();
    });
  });

  test('Empty input fields', (done) => {
    const wrapper = shallow(<UserRegister />);

    const spy = jest.spyOn(Alert, 'warning');

    wrapper.find({ children: 'Registrer ny bruker' }).simulate('click');
    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    });
  });
});

describe('UserPersonal component', () => {
  beforeEach(() => {
    userService.token = validToken;
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

  test('Server refuse user update', (done) => {
    const wrapper = shallow(<UserPersonal />);

    const spy = jest.spyOn(Alert, 'warning');
    mockAdapter.onPut('user').reply(401);

    wrapper.find({ children: 'Oppdater bruker' }).simulate('click');

    setTimeout(() => {
      expect(Alert.warning).toBeCalled();
      spy.mockRestore();
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

  test('Delete on no token or Server refuse to delete user', (done) => {
    const wrapper = shallow(<UserPersonal />);

    mockAdapter.onDelete('user').reply(401);

    const spy = jest.spyOn(Alert, 'warning');

    userService.token = null;
    wrapper.find({ children: 'Slett meg' }).simulate('click');

    userService.token = validToken;
    wrapper.find({ children: 'Slett meg' }).simulate('click');

    setTimeout(() => {
      expect(Alert.warning).toBeCalledTimes(3);
      spy.mockRestore();
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

describe('PasswordPrompt component', () => {
  test('No email', (done) => {
    const wrapper = shallow(<PasswordPrompt />);

    wrapper.find({ children: 'Send inn' }).simulate('click');

    setTimeout(() => {
      expect(Alert.info).toBeCalled();
      done();
    });
  });

  test('Input onChange', (done) => {
    const wrapper = shallow(<PasswordPrompt />);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'email' } });

    setTimeout(() => {
      //@ts-ignore
      expect(wrapper.instance().password).toEqual('email');
      done();
    });
  });

  test('Register new', (done) => {
    const wrapper = shallow(<PasswordPrompt />);

    userService.loginOrRegister = userService.register;
    userService.token = null;

    mockAdapter.onPost('user/add').reply(201, validToken);
    mockAdapter.onPut('user').reply(200, validUser);
    mockAdapter.onGet('user').reply(200, validUser);

    userService.email = 'email';
    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'password' } });

    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      //@ts-ignore
      expect(userService.token).toEqual(validToken);
      expect(userService.name).toEqual('a');
      done();
    });
  });

  test('Login fails', (done) => {
    const wrapper = shallow(<PasswordPrompt />);

    userService.loginOrRegister = userService.login;

    userService.token = null;
    mockAdapter.onPost('user/login').reply(401, validToken);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'password' } });
    userService.email = 'email';

    wrapper.find(Form.Input).simulate('keyup', { key: 'Enter' });

    setTimeout(() => {
      //@ts-ignore
      expect(userService.token).toEqual(null);

      done();
    });
  });

  test('Login with Enter key', (done) => {
    const wrapper = shallow(<PasswordPrompt />);

    userService.loginOrRegister = userService.login;

    userService.token = null;
    mockAdapter.onPost('user/login').reply(200, validToken);
    mockAdapter.onGet('user/').reply(200, validUser);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'password' } });
    userService.email = 'email';

    wrapper.find(Form.Input).simulate('keyup', { key: 'Enter' });

    setTimeout(() => {
      //@ts-ignore
      expect(userService.token).toEqual(validToken);

      done();
    });
  });

  test('Error registering', (done) => {
    const wrapper = shallow(<PasswordPrompt />);

    const spy = jest.spyOn(Alert, 'warning');

    userService.loginOrRegister = userService.register;

    mockAdapter.onPost('user/add').reply(500);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'password' } });
    userService.email = 'email';

    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      //@ts-ignore
      expect(spy).toBeCalledWith(<>Feil brukarnavn eller passord</>);

      done();
    });
  });

  test('Cancel password', (done) => {
    userService.passwordPrompt = true;

    const wrapper = shallow(<PasswordPrompt />);

    wrapper.find(Button.Light).simulate('click');

    setTimeout(() => {
      //@ts-ignore
      expect(userService.passwordPrompt).toBe(false);

      done();
    });
  });
});
