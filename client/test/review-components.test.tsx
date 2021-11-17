import * as React from 'react';
import { shallow } from 'enzyme';
import { Card, Row, Column } from '../src/widgets';
import reviewService from '../src/services/review-service';

jest.mock('../src/review-service', () => {
  class ReviewService {
    PublishedReviews() {
      return Promise.resolve([
        { review_id: 1, review_title: 'test', text: 'dette er en test', rating: 4 },
        { id: 2, title: 'Møt opp på forelesning', done: false },
        { id: 3, title: 'Gjør øving', done: false },
      ]);
    }
    getComplete(review_id: number) {
      return Promise.resolve({
        review_id: review_id,
        review_title: `test${review_id}`,
        text: 'dette er en test'
        rating: 
      });
    }

    create() {
      return Promise.resolve(4); // Same as: return new Promise((resolve) => resolve(4));
    }
  }
  return new ReviewService();
});

describe('Hello test', () => {
  test('Hello test', () => {
    expect(true).toEqual(true);
  });
});
