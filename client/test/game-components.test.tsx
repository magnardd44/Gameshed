import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { UserNav, UserData, UserPersonal, UserRegister, UserPage } from '../src/user-components';
import { Form, Card, Alert, Button, Container, Column } from '../src/widgets';
import { shallow } from 'enzyme';
import userService, { Token } from '../src/services/user-service';
import { gameService } from '../src/services/game-service';
import { AddGame, history } from '../src/game-component';
import { genreService } from '../src/services/genre-service';
import { platformService } from '../src/services/platform-service';

jest.setTimeout(1000);

//const mockGenreAdapter = new MockAdapter(genreService.axios);

//const mockPlatformAdapter = new MockAdapter(platformService.axios);

//const mockUserAdapter = new MockAdapter(userService.axios);

//const mockGlobalAdapter = new MockAdapter(axios);

const mockAdapter = new MockAdapter(axios);

mockAdapter.onGet('/games/1').reply(200, {
  game_id: 1,
  igdb_id: 2,
  game_title: 'test',
  genre: ['a', 'b', 'c'],
  platform: ['a', 'b', 'c'],
  game_description: 'test',
  igdb: null,
});

mockAdapter.onGet('/games').reply(200, [
  {
    game_id: 1,
    igdb_id: 2,
    game_title: 'test',
    genre: ['a', 'b', 'c'],
    platform: ['a', 'b', 'c'],
    game_description: 'test',
    igdb: null,
  },
  {
    game_id: 2,
    igdb_id: 3,
    game_title: 'test2',
    genre: ['a', 'b', 'c'],
    platform: ['a', 'b', 'c'],
    game_description: 'test',
    igdb: null,
  },
]);

mockAdapter.onGet('/genres/1').reply(200, {
  genre_id: 1,
  genre_name: 'test',
  genre_img: '',
});

mockAdapter.onGet('/genres').reply(200, [
  {
    genre_id: 1,
    genre_name: 'test',
    genre_img: '',
  },
  {
    genre_id: 2,
    genre_name: 'test2',
    genre_img: '',
  },
]);

mockAdapter.onGet('/platforms/1').reply(200, {
  platform_id: 1,
  platform_name: 'test',
});

mockAdapter.onGet('/platforms').reply(200, [
  {
    genre_id: 1,
    genre_name: 'test',
    genre_img: '',
  },
  {
    genre_id: 2,
    genre_name: 'test2',
    genre_img: '',
  },
]);

//const mockGlobalAdapter = new MockAdapter(axios);
//const mockGameService = new MockAdapter(gameService.axios);
//const mockGenreService = new MockAdapter(genreService.axios);
//const mockPlatformService = new MockAdapter(platformService.axios);

/*beforeEach(() => {});*/

//mockGlobalAdapter.onGet('user').reply(200, { nick: 'abc', about: 'def', email: 'ghi' });

//userService.token = { id: 1, token: 'test' };

/*
window.prompt = jest.fn(() => {
  return 'password';
});*/

Alert.info = jest.fn(() => {});
Alert.warning = jest.fn(() => {});
Alert.success = jest.fn(() => {});

describe('AddGame component', () => {
  test('AddGame default', () => {
    const wrapper = shallow(<AddGame />);

    // Wait for events to complete
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  test('Inputs updates correctly', (done) => {
    const wrapper = shallow(<AddGame />);

    setTimeout(() => {
      wrapper.find('#titleInput').simulate('change', { currentTarget: { value: 'test' } });
      wrapper.find('#descriptionInput').simulate('change', { currentTarget: { value: 'test' } });
      wrapper
        .find(Form.Select)
        .at(0)
        .simulate('change', { currentTarget: { value: 'Puzzle' } });
      wrapper
        .find(Form.Select)
        .at(1)
        .simulate('change', { currentTarget: { value: 'Mac' } });

      // Wait for events to complete
      //
      setTimeout(() => {
        expect(gameService.game.game_title).toBe('test');
        expect(gameService.game.game_description).toBe('test');
        expect(gameService.game.genre).toBe('Puzzle');
        expect(gameService.game.platform).toBe('Mac');
        done();
      });
    });
  });

  test('AddGame saves correctly', (done) => {
    const wrapper = shallow(<AddGame />);

    let spy = jest.spyOn(history, 'push');

    //Waiting for the component to fully be drawn
    setTimeout(() => {
      wrapper.find('#titleInput').simulate('change', { currentTarget: { value: 'test' } });
      wrapper.find('#descriptionInput').simulate('change', { currentTarget: { value: 'test' } });
      wrapper
        .find(Form.Select)
        .at(0)
        .simulate('change', { currentTarget: { value: 'Puzzle' } });
      wrapper
        .find(Form.Select)
        .at(1)
        .simulate('change', { currentTarget: { value: 'Mac' } });

      // @ts-ignore
      wrapper.find({ children: 'Lagre' }).simulate('click');

      // Wait for events to complete
      //
      setTimeout(() => {
        expect(history.push).toBeCalled();
        spy.mockRestore();
        done();
      });
    });
  });

  test('AddGame gives error correctly', (done) => {
    const wrapper = shallow(<AddGame />);

    const spy = jest.spyOn(Alert, 'danger');

    //Waiting for the component to fully be drawn
    setTimeout(() => {
      wrapper.find('#titleInput').simulate('change', { currentTarget: { value: 'test' } });
      //wrapper.find('#descriptionInput').simulate('change', { currentTarget: { value: 'test' } });

      // @ts-ignore
      wrapper.find({ children: 'Lagre' }).simulate('click');

      // Wait for events to complete
      //
      setTimeout(() => {
        expect(spy).toBeCalled();
        done();
      });
    });
  });

  test.skip('UserNav on logged out', (done) => {
    const wrapper = shallow(<AddGame />);

    let spy = jest.spyOn(history, 'push');

    wrapper.find(Button.Danger).simulate('click');

    setTimeout(() => {
      expect(history.push).toBeCalled();
      spy.mockRestore();
      done();
    });
  });

  test.skip('Ingen epost', (done) => {
    const wrapper = shallow(<UserNav />);

    wrapper.find({ children: 'Login' }).simulate('click');

    setTimeout(() => {
      expect(Alert.info).toBeCalled();
      done();
    });
  });

  test.skip('Feil brukar eller passord', (done) => {
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

describe.skip('UserData component', () => {
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

describe.skip('UserRegister component', () => {
  test('Register new ', (done) => {
    userService.email = 'email';
    mockAdapter.onPost('user/add').reply(200, { id: 0, token: 'token' });
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

describe.skip('UserPersonal component', () => {
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

describe.skip('UserPage component', () => {
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
