import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { UserNav, UserData, UserPersonal, UserRegister, UserPage } from '../src/user-components';
import { Form, Card, Alert, Button, Container, Column } from '../src/widgets';
import { shallow } from 'enzyme';
import userService, { Token } from '../src/services/user-service';
import { gameService } from '../src/services/game-service';
import { GameCard, AddGame, history } from '../src/game-component';
import { genreService } from '../src/services/genre-service';
import { platformService } from '../src/services/platform-service';

jest.setTimeout(1000);

//const mockGenreAdapter = new MockAdapter(genreService.axios);

//const mockPlatformAdapter = new MockAdapter(platformService.axios);

//const mockUserAdapter = new MockAdapter(userService.axios);

//const mockGlobalAdapter = new MockAdapter(axios);

const mockAdapter = new MockAdapter(axios);
const mockUserAdapter = new MockAdapter(userService.axios);

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
    platform_id: 1,
    platform_name: 'test',
    platform_img: '',
  },
  {
    platform_id: 2,
    platform_name: 'test2',
    platform_img: '',
  },
]);

const testGameComplete = {
  game_id: 1,
  igdb_id: 22,
  game_title: 'Title',
  genre: ['Adventure', 'Shooter'],
  platform: ['PC', 'Playstation', 'xbox'],
  game_description: 'Text',
  igdb: {
    cover_url: 'url',
    aggregated_rating: 50,
    screenshots_url: ['screen1', 'screen2'],
    similar_games: [{ id: 1, name: 'similar' }],
    release_date: 2000,
  },
};

const testGameDb = {
  game_id: 1,
  igdb_id: 22,
  game_title: 'Title',
  genre: ['Adventure', 'Shooter'],
  platform: ['PC', 'Playstation', 'xbox'],
  game_description: 'Text',
  igdb: null,
};

const completeReviews = [
  {
    review_id: 1,
    game_id: 1,
    game_title: 'abc',
    review_title: 'def',
    text: 'ghi',
    user_id: 1,
    rating: 4,
    published: true,
    genre_id: 1,
    platform_id: 1,
    relevant: 1,
    likes: 1,
    user_nickname: 'jkl',
  },
  {
    review_id: 2,
    game_id: 2,
    game_title: 'abc',
    review_title: 'def',
    text: 'ghi',
    user_id: 2,
    rating: 2,
    published: true,
    genre_id: 2,
    platform_id: 2,
    relevant: 1,
    likes: 2,
    user_nickname: 'jkl',
  },
  {
    review_id: 3,
    game_id: 3,
    game_title: 'abc',
    review_title: 'def',
    text: 'ghi',
    user_id: 3,
    rating: 3,
    published: false,
    genre_id: 3,
    platform_id: 3,
    relevant: 0,
    likes: 3,
    user_nickname: 'jkl',
  },
];

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
    mockAdapter.onPost('search').reply(200, [testGameComplete]);
    const wrapper = shallow(<AddGame />);

    setTimeout(() => {
      wrapper.find('#titleInput').simulate('change', { currentTarget: { value: 'test' } });
      wrapper.find('#descriptionInput').simulate('change', { currentTarget: { value: 'test' } });
      wrapper
        .find(Form.Select)
        .at(0)
        .simulate('change', { currentTarget: { value: 1 } });
      wrapper
        .find(Form.Select)
        .at(1)
        .simulate('change', { currentTarget: { value: 2 } });

      // Wait for events to complete
      //
      setTimeout(() => {
        expect(gameService.current.game_title).toBe('test');
        expect(gameService.current.game_description).toBe('test');
        expect(gameService.current.genre[0]).toBe('test');
        expect(gameService.current.platform[0]).toBe('test2');
        done();
      });
    });
  });

  test('AddGame saves correctly', (done) => {
    const wrapper = shallow(<AddGame />);

    mockAdapter.onPost('search').reply(200, [testGameComplete]);
    mockUserAdapter.onPost('games').reply(200, Promise.resolve(10));
    mockUserAdapter.onPost('genres/map/string').reply(200, 10);
    mockUserAdapter.onPost('platforms/map/string').reply(200, 10);
    let spy = jest.spyOn(history, 'push');

    //Waiting for the component to fully be drawn
    setTimeout(() => {
      wrapper.find('#titleInput').simulate('change', { currentTarget: { value: 'Nytt spel' } });
      wrapper.find('#descriptionInput').simulate('change', { currentTarget: { value: 'test' } });
      wrapper
        .find(Form.Select)
        .at(0)
        .simulate('change', { currentTarget: { value: 1 } });
      wrapper
        .find(Form.Select)
        .at(1)
        .simulate('change', { currentTarget: { value: 2 } });

      // @ts-ignore
      wrapper.find({ children: 'Lagre' }).simulate('click');

      // Wait for events to complete
      //
      setTimeout(() => {
        expect(history.push).toBeCalledWith('/');
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

  test('Add and remove genre', (done) => {
    const wrapper = shallow(<AddGame />);
    wrapper.find(Button.Success).at(0).simulate('click');

    //@ts-ignore
    expect(wrapper.instance().genreElCount).toEqual(2);

    setTimeout(() => {
      wrapper.find({ children: 'Fjern siste sjanger' }).simulate('click');

      //@ts-ignore
      expect(wrapper.instance().genreElCount).toEqual(1);
      done();
    });
  });

  test('Add and remove platform', (done) => {
    const wrapper = shallow(<AddGame />);
    wrapper.find(Button.Success).at(1).simulate('click');

    //@ts-ignore
    expect(wrapper.instance().platformElCount).toEqual(2);

    setTimeout(() => {
      wrapper.find({ children: 'Fjern siste plattform' }).simulate('click');

      //@ts-ignore
      expect(wrapper.instance().platformElCount).toEqual(1);
      done();
    });
  });

  test('Abort adding', (done) => {
    const wrapper = shallow(<AddGame />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Avbryt' }).simulate('click');

    setTimeout(() => {
      expect(spy).toBeCalledWith('/');
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

describe('GameCard component', () => {
  beforeEach(() => {
    mockAdapter.reset();
    mockUserAdapter.reset();
    gameService.current = gameService.empty();
  });

  test('GameCard default', () => {
    //@ts-ignore
    const wrapper = shallow(<GameCard match={{ params: { igdb_id: 0, db_id: 0 } }} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('GameCard on IGDB game', () => {
    mockAdapter.onGet('search/get_all/1').reply(200, testGameComplete);

    //@ts-ignore
    const wrapper = shallow(<GameCard match={{ params: { igdb_id: 1, db_id: 0 } }} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('GameCard on DB game', () => {
    mockUserAdapter.onGet('reviews/game/1').reply(200, completeReviews);
    mockUserAdapter.onGet('reviews/review/1').reply(200, completeReviews[0]);
    mockAdapter.onGet('games/1').reply(200, testGameDb);
    mockAdapter.onGet('search/get_extra/22').reply(200, testGameComplete.igdb);

    //@ts-ignore
    const wrapper = shallow(<GameCard match={{ params: { igdb_id: 0, db_id: 1 } }} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Return button', () => {
    //@ts-ignore
    const wrapper = shallow(<GameCard match={{ params: { igdb_id: 0, db_id: 0 } }} />);

    const spy = jest.spyOn(history, 'push');
    spy.mockClear();

    wrapper.find({ children: 'Tilbake til søk' }).simulate('click');
    expect(spy).toBeCalledWith('/');
  });

  test('Review button', () => {
    //@ts-ignore
    const wrapper = shallow(<GameCard match={{ params: { igdb_id: 0, db_id: 0 } }} />);

    const spy = jest.spyOn(history, 'push');
    spy.mockClear();

    wrapper.find({ children: 'Anmeld dette spillet' }).simulate('click');
    expect(spy).toBeCalledWith('/addReview/0/0');
  });
});
