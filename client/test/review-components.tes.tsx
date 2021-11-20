import * as React from 'react';
import { shallow } from 'enzyme';
import { useHistory } from 'react-router';
import { Card, Row, Column, Form, Button } from '../src/widgets';
import {
  AddReview,
  EditReview,
  PublishReview,
  CompleteReview,
  PublishedReviews,
  GenreReviews,
  PlatformReviews,
} from '../src/review-components';
import { NavLink } from 'react-router-dom';

import { reviewService } from '../src/services/review-service';

jest.mock('../src/services/review-service', () => {
  class ReviewService {
    reviews = [];
    review = { review_title: 'Elsker dette spillet' };

    getPublishedReviews() {
      return Promise.resolve([
        { review_id: 1, review_title: 'test1', text: 'dette er en test1', rating: 4 },
        { review_id: 2, review_title: 'test2', text: 'dette er en test2', rating: 2 },
        { review_id: 3, review_title: 'test3', text: 'dette er en test2', rating: 3 },
      ]);
    }
    get(review_id: number) {
      return Promise.resolve({
        review_id: review_id,
      });
    }
    getDraft(review_id: number) {
      return Promise.resolve({
        review_id: review_id,
      });
    }

    // edit(review_id: number) {
    //   return Promise.resolve({
    //     review_id: review_id,
    //   });
    // }

    getComplete(review_id: number) {
      return Promise.resolve({
        review_id: review_id,
      });
    }

    // create() {
    //   return Promise.resolve(); // Same as: return new Promise((resolve) => resolve(4));
    // }

    create = jest.fn().mockResolvedValue(3);

    delete = jest.fn().mockResolvedValue(3);

    publish = jest.fn().mockResolvedValue(3);

    edit = jest.fn().mockResolvedValue(3);

    like = jest.fn().mockResolvedValue(3);

    getGenre = jest.fn().mockResolvedValue(3);

    getPlatform = jest.fn().mockResolvedValue(3);
  }
  return { reviewService: new ReviewService() };
});

describe('Review components tests', () => {
  test('1 PublishedReviews draws correctly', (done) => {
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

  test('2 GenreReviews draws correctly', (done) => {
    const wrapper = shallow(<PublishedReviews />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement([
          <NavLink to="/genreReviews/1">test1</NavLink>,
          <NavLink to="/genreReviews/2">test2</NavLink>,
          <NavLink to="/genreReviews/3">test3</NavLink>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('3 PlatformReviews draws correctly', (done) => {
    const wrapper = shallow(<PublishedReviews />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement([
          <NavLink to="/platformReviews/1">test1</NavLink>,
          <NavLink to="/platformReviews/2">test2</NavLink>,
          <NavLink to="/platformReviews/3">test3</NavLink>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test.skip('save button in AddReview calls create method when clicked', (done) => {
    //@ts-ignore
    let newReview = new AddReview();
    //@ts-ignore
    const wrapper = shallow(<AddReview match={{ params: { review_id: 1 } }} />);
    wrapper.find(Button.Success).simulate('click');
    setTimeout(() => {
      //@ts-ignore
      expect(reviewService.create).toHaveBeenCalled();

      done();
    });
  });

  test('delete button in PublishReview calls delete method when clicked', (done) => {
    //@ts-ignore
    let newReview = new PublishReview();
    //@ts-ignore
    const wrapper = shallow(<PublishReview match={{ params: { review_id: 1 } }} />);
    wrapper.find(Button.Danger).simulate('click');
    setTimeout(() => {
      //@ts-ignore
      expect(reviewService.delete).toHaveBeenCalled();

      done();
    });
  });

  test('publish button in PublishReview calls publish method when clicked', (done) => {
    //@ts-ignore
    let newReview = new PublishReview();
    //@ts-ignore
    const wrapper = shallow(<PublishReview match={{ params: { review_id: 1 } }} />);
    wrapper.find(Button.Success).at(1).simulate('click');
    setTimeout(() => {
      //@ts-ignore
      expect(reviewService.publish).toHaveBeenCalled();

      done();
    });
  });

  test.skip('edit button in PublishReview calls history.push method when clicked', (done) => {
    //@ts-ignore
    history.push = jest.fn().mockResolvedValue(3);
    //@ts-ignore
    let newReview = new PublishReview();
    //@ts-ignore
    const wrapper = shallow(<PublishReview match={{ params: { review_id: 1 } }} />);
    wrapper.find(Button.Success).at(0).simulate('click');
    setTimeout(() => {
      //@ts-ignore
      expect(history.push).toHaveBeenCalled();

      done();
    });
  });

  test('save button in EditReview calls edit method when clicked', (done) => {
    //@ts-ignore
    let edit = new EditReview();
    //@ts-ignore
    const wrapper = shallow(<EditReview match={{ params: { review_id: 1 } }} />);
    wrapper.find(Button.Success).simulate('click');
    setTimeout(() => {
      //@ts-ignore
      expect(reviewService.edit).toHaveBeenCalled();

      done();
    });
  });

  test('like button in CompleteReview calls like method when clicked', (done) => {
    //@ts-ignore
    let newReview = new CompleteReview();
    //@ts-ignore
    const wrapper = shallow(<CompleteReview match={{ params: { review_id: 1 } }} />);
    wrapper.find(Button.Success).simulate('click');
    setTimeout(() => {
      //@ts-ignore
      expect(reviewService.like).toHaveBeenCalled();

      done();
    });
  });

  test('buttons in GenreReview calls getGenre method when clicked', (done) => {
    //@ts-ignore
    let reviews = new GenreReviews();
    //@ts-ignore
    const wrapper = shallow(<GenreReviews match={{ params: { review_id: 1 } }} />);
    wrapper.find(Button.Success).at(0).simulate('click');

    setTimeout(() => {
      //@ts-ignore
      expect(reviewService.getGenre).toHaveBeenCalled();

      done();
    });
  });

  test('buttons in PlatformReview calls platformGenre method when clicked', (done) => {
    //@ts-ignore
    let reviews = new PlatformReviews();
    //@ts-ignore
    const wrapper = shallow(<PlatformReviews match={{ params: { review_id: 1 } }} />);
    wrapper.find(Button.Success).at(0).simulate('click');
    setTimeout(() => {
      //@ts-ignore
      expect(reviewService.getPlatform).toHaveBeenCalled();

      done();
    });
  });

  test('x addReview correctly sets path on create', (done) => {
    //@ts-ignore
    const wrapper = shallow(<AddReview match={{ params: { db_id: 1 } }} />);

    wrapper
      .find(Form.Input)

      .simulate('change', { currentTarget: { value: 'Elsker dette spillet' } });
    console.log(wrapper.debug());
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="Elsker dette spillet" />)).toEqual(
      true
    );

    wrapper.find(Button.Success).simulate('click');
    // Wait for events to complete
    setTimeout(() => {
      expect(location.hash).toEqual('/publishedReviews/4');
      done();
    });
  });
});

describe('Snapshot component tests', () => {
  test('1 Snapshot - AddReview draws correctly', () => {
    const match = { params: { id: 1 } };
    //@ts-ignore
    const wrapper = shallow(<AddReview match={match} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('2 Snapshot - EditReview draws correctly', () => {
    const match = { params: { id: 1 } };
    //@ts-ignore
    const wrapper = shallow(<EditReview match={match} />);

    expect(wrapper).toMatchSnapshot();
  });
  test('3 Snapshot - CompleteReview draws correctly', () => {
    const match = { params: { id: 1 } };
    //@ts-ignore
    const wrapper = shallow(<CompleteReview match={match} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('4 Snapshot - PublishReview draws correctly', () => {
    const match = { params: { id: 1 } };
    //@ts-ignore
    const wrapper = shallow(<PublishReview match={match} />);

    expect(wrapper).toMatchSnapshot();
  });
});
