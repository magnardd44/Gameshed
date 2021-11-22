import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';
import { history, Category } from '../src/genre-components';
import userService from '../src/services/user-service';

import {
  CategoryCard,
  ReviewCard,
  ColumnCentre,
  Form,
  Card,
  Alert,
  Button,
  Container,
  Column,
} from '../src/widgets';
import { reviewService } from '../src/services/review-service';

const mockAdapter = new MockAdapter(axios);
const mockUserAdapter = new MockAdapter(userService.axios);

const genres = [
  {
    genre_id: 1,
    genre_name: 'a',
    genre_img: 'a',
  },
  {
    genre_id: 2,
    genre_name: 'b',
  },
];

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
    genre_id: 1,
    platform_id: 145,
    relevant: 1,
    likes: 2,
    user_nickname: 'jkl',
  },
];

describe('Category component', () => {
  beforeEach(() => {
    mockAdapter.reset();
  });
  test('Category component default', () => {
    //mockAdapter.onGet('/genres/').reply(200, []);

    const wrapper = shallow(<Category />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Button go to platform', () => {
    const wrapper = shallow(<Category />);

    const spy = jest.spyOn(history, 'push');

    wrapper.find({ children: 'Klikk her' }).simulate('click');

    expect(spy).toBeCalledWith('/reviews-by-platform');
  });

  test('Reviews are mapped', () => {
    reviewService.reviews = completeReviews;
    const wrapper = shallow(<Category />);

    setTimeout(() => {
      expect(wrapper.find(ReviewCard)).toHaveLength(2);
    });
  });

  test('Get genres', (done) => {
    mockAdapter.onGet('/genres').reply(200, ['genre1', 'genre2']);

    const wrapper = shallow(<Category />);

    setTimeout(() => {
      expect(wrapper.find(CategoryCard)).toHaveLength(2);
      done();
    });
  });

  test('Set genre', (done) => {
    mockAdapter.onGet('/genres').reply(200, [
      { genre_id: 1, genre_name: 'genre1' },
      { genre_id: 2, genre_name: 'genre2' },
    ]);
    mockUserAdapter.onGet('/reviews/genre/1').reply(200, completeReviews);
    mockUserAdapter.onGet('/reviews/review/1').reply(200, completeReviews[0]);
    mockUserAdapter.onGet('/reviews/review/2').reply(200, completeReviews[1]);

    const wrapper = shallow(<Category />);

    setTimeout(() => {
      wrapper.find({ children: 'genre1' }).simulate('click');
      done();
      //expect(wrapper.find(ReviewCard)).toHaveLength(2);
    });
  });

  test('Read more button', (done) => {
    mockAdapter.onGet('/genres').reply(200, [
      { genre_id: 1, genre_name: 'genre1' },
      { genre_id: 2, genre_name: 'genre2' },
    ]);
    mockUserAdapter.onGet('/reviews/genre/1').reply(200, completeReviews);
    mockUserAdapter.onGet('/reviews/review/1').reply(200, completeReviews[0]);
    mockUserAdapter.onGet('/reviews/review/2').reply(200, completeReviews[1]);

    const wrapper = shallow(<Category />);

    const spy = jest.spyOn(history, 'push');
    spy.mockClear();

    setTimeout(() => {
      wrapper.find({ children: 'Les mer' }).first().simulate('click');
      expect(spy).toBeCalledWith('/publishedReviews/' + completeReviews[0].review_id);
      done();
      //expect(wrapper.find(ReviewCard)).toHaveLength(2);
    });
  });

  //  test('Genrebutton is pressed', (done) => {
  //	mockAdapter.onGet('/genres').reply(200, genres);
  //    const wrapper = shallow(<Category />);
  //
  //	//mockAdapter.onGet('/reviews/genre/1').reply(200, completeReviews);
  //
  //	///reviewService.reviews = completeReviews
  //	//
  //
  //	setTimeout(()=>{
  //	wrapper.find({ children: genres[0].genre_name}).simulate('click');
  //
  //	setTimeout(()=>{
  //		expect(wrapper.instance().genreCall).toBeCalled();
  ////		expect(reviewService.reviews).toHaveLength(2)
  ////		expect(wrapper.find('Les mer')).toHaveLength(2)
  //		done()
  //	});
  //
  //	});
  //  });
});
