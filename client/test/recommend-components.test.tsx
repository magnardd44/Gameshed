import * as React from 'react';
//import ReactDOM from 'react-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';
import { history, TopTenStars, LastTen, ReviewList } from '../src/recommend-components';
import {
  ReviewCard,
  ColumnCentre,
  Form,
  Card,
  Alert,
  Button,
  Container,
  Column,
} from '../src/widgets';

jest.setTimeout(1000);

const mockAdapter = new MockAdapter(axios);

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
];

describe('TopTenStars component', () => {
  test('TopTenStars default', () => {
    mockAdapter.onGet('/reviews/topTen/').reply(200, []);

    //@ts-ignore
    const wrapper = shallow(<TopTenStars />);
    expect(wrapper).toMatchSnapshot();
  });

  test('TopTenStars with reviews', (done) => {
    mockAdapter.onGet('/reviews/topTen/').reply(200, completeReviews);

    //@ts-ignore
    const wrapper = shallow(<TopTenStars />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      //@ts-ignore
      expect(wrapper.instance().reviews).toHaveLength(2);
      done();
    });
  });

  test('TopTenStars without reviews', (done) => {
    const spy = jest.spyOn(Alert, 'danger');
    mockAdapter.onGet('/reviews/topTen/').reply(500);

    //@ts-ignore
    const wrapper = shallow(<TopTenStars />);

    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    });
  });
});

describe('LastTen component', () => {
  test('LastTen default', () => {
    mockAdapter.onGet('/reviews/topTen/').reply(200, []);

    //@ts-ignore
    const wrapper = shallow(<LastTen />);
    expect(wrapper).toMatchSnapshot();
  });

  test('LastTen with reviews', (done) => {
    mockAdapter.onGet('/reviews/lastTen/').reply(200, completeReviews);

    //@ts-ignore
    const wrapper = shallow(<LastTen />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      //@ts-ignore
      expect(wrapper.instance().reviews).toHaveLength(2);
      done();
    });
  });

  test('LastTen without reviews', (done) => {
    const spy = jest.spyOn(Alert, 'danger');
    mockAdapter.onGet('/reviews/lastTen/').reply(500);

    //@ts-ignore
    const wrapper = shallow(<LastTen />);

    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    });
  });
});

describe('ReviewList component', () => {
  test('ReviewList default', () => {
    //@ts-ignore
    const wrapper = shallow(<ReviewList reviews={[]} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ReviewCard)).toHaveLength(0);
  });

  test('ReviewList with reviews', () => {
    //@ts-ignore
    const wrapper = shallow(<ReviewList reviews={completeReviews} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ReviewCard)).toHaveLength(2);
  });

  test('Click on review', () => {
    //@ts-ignore
    const wrapper = shallow(<ReviewList reviews={completeReviews} />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find(Button.Success).at(0).simulate('click');

    expect(spy).toBeCalled();
  });
});
