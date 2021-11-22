import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';
import { history, Platform } from '../src/platform-components';
import { Review, reviewService } from '../src/services/review-service';

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

const mockAdapter = new MockAdapter(axios);

const completeReview = {
  review_id: 3,
  game_id: 1,
  game_title: 'abc',
  review_title: 'def',
  text: 'ghi',
  user_id: 1,
  rating: 4,
  published: true,
  genre_id: 1,
  platform_id: 145,
  relevant: 1,
  likes: 1,
  user_nickname: 'jkl',
};

const noReviews: Review[] = [];

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
    platform_id: 145,
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
    platform_id: 145,
    relevant: 1,
    likes: 2,
    user_nickname: 'jkl',
  },
];

describe('Platform component', () => {
  test('Platform component default', () => {
    mockAdapter.onGet('/platforms/').reply(200, []);

    const wrapper = shallow(<Platform />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Button go to genre', () => {
    const wrapper = shallow(<Platform />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Klikk her' }).simulate('click');

    expect(spy).toBeCalledWith('/reviews-by-genre');
  });

  test('Test all platform buttons', () => {
    const wrapper = shallow(<Platform />);

    const spy = jest.spyOn(reviewService, 'getPlatform');

    wrapper.find({ children: 'Vis' }).forEach((b) => b.simulate('click'));

    expect(spy).toBeCalledTimes(11);
  });

  test('Got no reviews', (done) => {
    const wrapper = shallow(<Platform />);

    mockAdapter.onGet('/reviews/platform/145').reply(200, noReviews);

    wrapper.find({ children: 'Vis' }).at(0).simulate('click');

    setTimeout(() => {
      expect(reviewService.reviews).toHaveLength(0);
      done();
    });
  });

  test('Test reviews are shown', (done) => {
    const wrapper = shallow(<Platform />);

    ///reviewService.reviews = completeReviews

    setTimeout(() => {
      //expect(wrapper.find('Les mer')).toHaveLength(2)
      done();
    });
    //expect(spy).toBeCalledTimes(11);
  });

  //  test('Test getting reviews by platform', (done) => {
  //    const wrapper = shallow(<Platform />);
  //
  //	mockAdapter.onGet('/reviews/platform/145').reply(200, completeReviews);
  //	mockAdapter.onGet('/reviews/review/1').reply(200);
  //	mockAdapter.onGet('/reviews/review/2').reply(200);
  //
  //    //const spy = jest.spyOn(reviewService, 'getPlatform');
  //
  //    wrapper.find({ children: 'Vis' }).at(0).simulate('click');
  //
  //	setTimeout(()=>{
  //		expect(reviewService.reviews[0].review_id).toBe(1)
  //		expect(reviewService.reviews[1].review_id).toBe(2)
  //	});
  //    //expect(spy).toBeCalledTimes(11);
  //  });
});
