import * as React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';
import {
  history,
  Search,
  SearchListings,
  SearchResult,
  SearchHotBar,
} from '../src/search-components';
import { gameService } from '../src/services/game-service';
import { ColumnCentre, Form, Card, Alert, Button, Container, Column } from '../src/widgets';

jest.setTimeout(1000);

const mockAdapter = new MockAdapter(axios);

Alert.info = jest.fn(() => {});
//Alert.warning = jest.fn(() => {});
//Alert.success = jest.fn(() => {});

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

const testGameEmpty = {
  game_id: 0,
  igdb_id: 0,
  game_title: '',
  genre: [],
  platform: [],
  game_description: '',
  igdb: null,
};

const testGameNone = {};

const testGames = [{ game_id: 1, igdb_id: 10, game_title: 'Zelda' }];
const testGames2 = [{ game_id: 2, igdb_id: 22, game_title: 'Mario' }];

describe('SearchHotBar component', () => {
  test('Search component default', () => {
    //@ts-ignore
    const wrapper = shallow(<SearchHotBar key="1" />);
    expect(wrapper).toHaveProperty('key');
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Search component', () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  test('Search component default', () => {
    const wrapper = shallow(<Search />);

    expect(wrapper).toMatchSnapshot();

    //@ts-ignore
    expect(wrapper.instance().input).toEqual('');
    //@ts-ignore
    expect(wrapper.instance().lastInput).toEqual('');
  });

  test('Search db for Zelda', (done) => {
    const wrapper = shallow(<Search />);

    const spy = jest.spyOn(gameService, 'search_db');
    spy.mockImplementationOnce(() => {});

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Zelda' } });

    setTimeout(() => {
      expect(gameService.search_db).toBeCalled();
      spy.mockRestore();
      done();
    });
  });

  test('IGDB searcher is running', (done) => {
    jest.useFakeTimers();
    const wrapper = shallow(<Search />);

    const spyDB = jest.spyOn(gameService, 'search_db');
    spyDB.mockImplementationOnce(() => {});

    const spyIGDB = jest.spyOn(gameService, 'search_igdb');
    spyIGDB.mockImplementation(() => {});

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Mario' } });

    expect(gameService.search_igdb).not.toBeCalled();
    jest.advanceTimersByTime(500);
    expect(gameService.search_igdb).toBeCalled();

    spyDB.mockRestore();
    spyIGDB.mockRestore();

    done();
  });

  test('IGDB searcher is stopped on unmount', (done) => {
    jest.useFakeTimers();
    const wrapper = shallow(<Search />);

    const spyDB = jest.spyOn(gameService, 'search_db');
    spyDB.mockImplementation(() => {});

    const spyIGDB = jest.spyOn(gameService, 'search_igdb');
    spyIGDB.mockImplementation(() => {});

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Mario' } });

    expect(gameService.search_igdb).not.toBeCalled();
    jest.advanceTimersByTime(500);
    expect(gameService.search_igdb).toHaveBeenCalledTimes(1);
    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Zelda' } });
    wrapper.unmount();
    jest.advanceTimersByTime(500);
    expect(gameService.search_igdb).toHaveBeenCalledTimes(1);

    spyDB.mockRestore();
    spyIGDB.mockRestore();

    done();
  });

  test('No IGDB searcher to be stopped on unmount', (done) => {
    const wrapper = shallow(<Search />);

    //@ts-ignore
    clearInterval(wrapper.instance().igdbSearcher);
    //@ts-ignore
    wrapper.instance().igdbSearcher = null;

    const spy = jest.spyOn(window, 'clearInterval');

    wrapper.unmount();

    setTimeout(() => {
      expect(clearInterval).not.toBeCalled();
      spy.mockRestore();

      done();
    });
  });

  test('IGDB results is cleared on empty input', (done) => {
    jest.useFakeTimers();
    const wrapper = shallow(<Search />);

    const spyDB = jest.spyOn(gameService, 'search_db');
    spyDB.mockImplementation(() => {});

    const spyIGDB = jest.spyOn(gameService, 'search_igdb');
    spyIGDB.mockImplementation(() => {});

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'IGDB empty' } });

    expect(gameService.search_igdb).not.toBeCalled();
    jest.advanceTimersByTime(500);
    expect(gameService.search_igdb).toHaveBeenCalledTimes(1);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Zelda' } });
    jest.advanceTimersByTime(500);
    expect(gameService.search_igdb).toHaveBeenCalledTimes(2);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: '' } });
    jest.advanceTimersByTime(500);
    expect(gameService.search_igdb).toHaveBeenCalledTimes(2);

    spyDB.mockRestore();
    spyIGDB.mockRestore();

    done();
  });

  test('Press enter on input field', (done) => {
    const wrapper = shallow(<Search />);

    wrapper.find(Form.Input).simulate('keyup', { key: 'Space' });
    wrapper.find(Form.Input).simulate('keyup', { key: 'Enter' });

    setTimeout(() => {
      expect(Alert.info).toHaveBeenCalledTimes(1);
      done();
    });
  });

  test('Press search button with input', (done) => {
    const wrapper = shallow(<Search />);

    const spy = jest.spyOn(history, 'push');
    mockAdapter.onGet('games/search/Zelda').reply(200, []);
    mockAdapter.onPost('search').reply(200, []);
    mockAdapter.onPost('search/get_igdb_extra').reply(200, {});

    //@ts-ignore
    wrapper.instance().input = 'Zelda';
    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(history.push).toBeCalled();
      spy.mockRestore();
      done();
    });
  });

  test('Press search button with empty input', (done) => {
    const wrapper = shallow(<Search />);
    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(Alert.info).toBeCalled();
      done();
    });
  });

  test('Search result is displayed', (done) => {
    const wrapper = shallow(<Search />);

    const searchGame = 'ZeldaMario';

    mockAdapter.onGet('games/search/' + searchGame).reply(200, testGames);
    mockAdapter.onPost('search').reply(200, testGames2);

    let elementsToMatch = [
      //@ts-ignore
      <SearchHotBar>Zelda</SearchHotBar>,
      //@ts-ignore
      <SearchHotBar>Mario</SearchHotBar>,
    ];

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: searchGame } });

    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements(elementsToMatch)).toEqual(true);
      done();
    }, 350);
  });

  test('Search result is clicked', (done) => {
    const wrapper = shallow(<Search />);

    const spy = jest.spyOn(history, 'push');
    mockAdapter.onGet('games/' + testGames[0].game_id).reply(200, testGames);
    mockAdapter.onGet('games/search/' + testGames[0].game_title).reply(200, testGames);
    mockAdapter.onPost('search').reply(200, testGames2);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Zelda' } });

    setTimeout(() => {
      //@ts-ignore
      expect(wrapper.containsMatchingElement(<SearchHotBar>Zelda</SearchHotBar>)).toBe(true);
      wrapper.find(SearchHotBar).simulate('click');

      expect(history.push).toBeCalled();
      spy.mockRestore();
      done();
    });
  });
});

describe('SearchListings component', () => {
  test('SearchListings default', (done) => {
    mockAdapter.onGet('/genres').reply(200, ['genre1', 'genre2']);
    mockAdapter.onGet('/platforms').reply(200, ['platform1', 'platform2']);

    gameService.db = [];
    gameService.igdb = [];

    //@ts-ignore
    const wrapper = shallow(<SearchListings />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('Test select filters', (done) => {
    mockAdapter.onGet('/genres').reply(200, ['genre1', 'genre2']);
    mockAdapter.onGet('/platforms').reply(200, ['platform1', 'platform2']);

    //@ts-ignore
    gameService.db = [testGameComplete, testGameComplete];
    //@ts-ignore
    gameService.igdb = [testGameComplete, testGameComplete, testGameEmpty];

    //@ts-ignore
    const wrapper = shallow(<SearchListings />);

    expect(wrapper.find(SearchResult)).toHaveLength(5);

    done();
  });

  test('Test select filters', (done) => {
    mockAdapter.onGet('/genres').reply(200, ['genre1', 'genre2']);
    mockAdapter.onGet('/platforms').reply(200, ['platform1', 'platform2']);

    //@ts-ignore
    const wrapper = shallow(<SearchListings />);

    expect(wrapper.find(Form.Select)).toHaveLength(3);

    wrapper
      .find(Form.Select)
      .at(0)
      .simulate('change', { currentTarget: { value: 'genre2' } });
    wrapper
      .find(Form.Select)
      .at(1)
      .simulate('change', { currentTarget: { value: 'platform2' } });
    wrapper
      .find(Form.Select)
      .at(2)
      .simulate('change', { currentTarget: { value: 1900 } });

    //@ts-ignore
    expect(wrapper.instance().genre).toEqual('genre2');
    //@ts-ignore
    expect(wrapper.instance().platform).toEqual('platform2');
    //@ts-ignore
    expect(wrapper.instance().year).toEqual(1900);

    wrapper
      .find(Form.Select)
      .at(0)
      .simulate('change', { currentTarget: { value: 'alle' } });
    wrapper
      .find(Form.Select)
      .at(1)
      .simulate('change', { currentTarget: { value: 'alle' } });
    wrapper
      .find(Form.Select)
      .at(2)
      .simulate('change', { currentTarget: { value: 'alle' } });

    //@ts-ignore
    expect(wrapper.instance().genre).toEqual('alle');
    //@ts-ignore
    expect(wrapper.instance().platform).toEqual('alle');
    //@ts-ignore
    expect(wrapper.instance().year).toEqual(0);

    done();
  });

  test('Test addGame button', (done) => {
    const wrapper = shallow(<SearchListings />);

    mockAdapter.onGet('/genres').reply(200, ['genre1', 'genre2']);
    mockAdapter.onGet('/platforms').reply(200, ['platform1', 'platform2']);

    const spy = jest.spyOn(history, 'push');

    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(history.push).toBeCalled();
      spy.mockRestore();
      done();
    });
  });

  test('Filter when games are incomplete', (done) => {
    const wrapper = shallow(<SearchListings />);

    //@ts-ignore
    gameService.db = [testGameNone];
    //@ts-ignore
    gameService.igdb = [testGameNone];

    setTimeout(() => {
      //Three Form.Select with only the option 'alle' each
      expect(wrapper.find('option')).toHaveLength(3);
      done();
    });
  });

  test('Filter is sorting on year', (done) => {
    const wrapper = shallow(<SearchListings />);

    gameService.db = [
      //@ts-ignore
      { igdb: { release_date: new Date('1980').valueOf() / 1000 } }, //@ts-ignore
      { igdb: { release_date: new Date('2010').valueOf() / 1000 } }, //@ts-ignore
      { igdb: { release_date: new Date('1990').valueOf() / 1000 } },
    ];

    gameService.igdb = [
      //@ts-ignore
      { igdb: { release_date: new Date('2020').valueOf() / 1000 } }, //@ts-ignore
      { igdb: { release_date: new Date('1960').valueOf() / 1000 } }, //@ts-ignore
      { igdb: { release_date: new Date('1990').valueOf() / 1000 } },
    ];

    setTimeout(() => {
      expect(wrapper.find('option')).toHaveLength(8);
      expect(
        wrapper
          .find('option')
          .at(0)
          .matchesElement(<option>alle</option>)
      ).toBe(true);
      expect(
        wrapper
          .find('option')
          .at(1)
          .matchesElement(<option>alle</option>)
      ).toBe(true);
      expect(
        wrapper
          .find('option')
          .at(2)
          .matchesElement(<option>alle</option>)
      ).toBe(true);
      expect(
        wrapper
          .find('option')
          .at(3)
          .matchesElement(<option>1960</option>)
      ).toBe(true);
      expect(
        wrapper
          .find('option')
          .at(4)
          .matchesElement(<option>1980</option>)
      ).toBe(true);
      expect(
        wrapper
          .find('option')
          .at(5)
          .matchesElement(<option>1990</option>)
      ).toBe(true);
      expect(
        wrapper
          .find('option')
          .at(6)
          .matchesElement(<option>2010</option>)
      ).toBe(true);
      expect(
        wrapper
          .find('option')
          .at(7)
          .matchesElement(<option>2020</option>)
      ).toBe(true);

      done();
    });
  });
});

describe('SearchResult component', () => {
  test('SearchResult default', () => {
    //@ts-ignore
    const wrapper = shallow(<SearchResult game={testGameComplete} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('SearchResult with empty game', () => {
    const wrapper = shallow(<SearchResult game={testGameEmpty} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Click on button', (done) => {
    //@ts-ignore
    const wrapper = shallow(<SearchResult game={testGameComplete} />);
    const spy = jest.spyOn(history, 'push');

    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(history.push).toBeCalled();
      spy.mockRestore();
      done();
    });
  });
});
