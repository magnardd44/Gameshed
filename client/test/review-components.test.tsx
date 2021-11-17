import * as React from 'react';
import { shallow } from 'enzyme';
import { Card, Row, Column } from '../src/widgets';
import { PublishedReviews } from '../src/review-components';
import { NavLink } from 'react-router-dom';

jest.mock('../src/services/review-service', () => {
  class ReviewService {
    reviews = [];
    getPublishedReviews() {
      return Promise.resolve([
        { review_id: 1, review_title: 'test1', text: 'dette er en test1', rating: 4 },
        { review_id: 2, review_title: 'test2', text: 'dette er en test2', rating: 2 },
        { review_id: 3, review_title: 'test3', text: 'dette er en test2', rating: 3 },
      ]);
    }
    getComplete(review_id: number) {
      return Promise.resolve({
        review_id: review_id,
        review_title: `test${review_id}`,
        text: 'dette er en test',
        rating: 3,
      });
    }

    create() {
      return Promise.resolve(4); // Same as: return new Promise((resolve) => resolve(4));
    }
  }
  return { reviewService: new ReviewService() };
});
describe('Review component tests', () => {
  test('0 PublishedReviews draws correctly', (done) => {
    const wrapper = shallow(<PublishedReviews />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement([
          <NavLink to="/publishedReviews/1">test1</NavLink>,
          <NavLink to="/publishedReviews/2">test2</NavLink>,
          <NavLink to="/publishedReviews/3">test3</NavLink>,
        ])
      ).toEqual(true);
      done();
    });
  });
});
