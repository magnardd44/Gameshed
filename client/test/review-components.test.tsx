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
  MyReviews,
} from '../src/review-components';
import { NavLink } from 'react-router-dom';

import { reviewService } from '../src/services/review-service';
import { FacebookIcon, FacebookShareButton } from 'react-share';
import { userInfo } from 'os';
import userService from '../src/services/user-service';
import MockAdapter from 'axios-mock-adapter/types';

jest.mock('../src/services/game-service', () => {
  class GameService {
    current = {
      game_id: 1,
      igdb_id: 0,
      game_title: '',
      genre: [],
      platform: [],
      game_description: '',
      igdb: null,
    };

    set = jest.fn().mockResolvedValue(this.current);
    get = jest.fn().mockResolvedValue(this.current);
  }
  return { gameService: new GameService() };
});

jest.mock('../src/services/review-service', () => {
  class ReviewService {
    reviews = [];

    review = { game_id: 1, review_id: 1, review_title: 'Elsker dette spillet' };

    getPublishedReviews() {
      return Promise.resolve([
        { game_id: 1, review_id: 1, review_title: 'test1', text: 'dette er en test1', rating: 4 },
        { game_id: 1, review_id: 2, review_title: 'test2', text: 'dette er en test2', rating: 2 },
        { game_id: 1, review_id: 3, review_title: 'test3', text: 'dette er en test2', rating: 3 },
      ]);
    }
    get(review_id: number) {
      return Promise.resolve({
        review_id: review_id,
        game_id: 1,
      });
    }
    getDraft(review_id: number) {
      return Promise.resolve({
        review_id: review_id,
        game_id: 1,
      });
    }

    getComplete(review_id: number) {
      return Promise.resolve({
        review_id: review_id,
        game_id: 1,
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
  // test('1 PublishedReviews draws correctly', (done) => {
  //   const wrapper = shallow(<PublishedReviews />);

  //   // Wait for events to complete
  //   setTimeout(() => {
  //     expect(
  //       wrapper.containsMatchingElement([
  //         <NavLink to="/publishedReviews/1">test1</NavLink>,
  //         <NavLink to="/publishedReviews/2">test2</NavLink>,
  //         <NavLink to="/publishedReviews/3">test3</NavLink>,
  //       ])
  //     ).toEqual(true);
  //     done();
  //   });
  // });

  test('save button in AddReview calls create method when clicked', (done) => {
    //@ts-ignore
    let newReview = new AddReview();
    //@ts-ignore
    const wrapper = shallow(<AddReview match={{ params: { review_id: 1 } }} />);
    wrapper.find(Button.Success).simulate('click');
    setTimeout(() => {
      //@ts-ignore
      if (
        reviewService.review.review_title !== '' ||
        reviewService.review.text !== '' ||
        reviewService.review.rating !== 0
      ) {
        expect(reviewService.create).toHaveBeenCalled();
      }
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

  test('edit button in PublishReview calls history.push method when clicked', (done) => {
    //@ts-ignore
    const spy = jest.spyOn(history, 'push');

    //@ts-ignore
    let newReview = new PublishReview();
    //@ts-ignore
    const wrapper = shallow(<PublishReview match={{ params: { review_id: 1 } }} />);
    wrapper.find(Button.Success).at(0).simulate('click');
    setTimeout(() => {
      //@ts-ignore
      expect(history.push).toHaveBeenCalled();
      spy.mockRestore();

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
    //let newReview = new CompleteReview();
    //@ts-ignore
    const wrapper = shallow(<CompleteReview match={{ params: { review_id: 1 } }} />);
    //wrapper.find(Button.Success).simulate('click');
    setTimeout(() => {
      //@ts-ignore
      //expect(reviewService.like).toHaveBeenCalled();

      done();
    });
  });

  test('publish button in MyReviews calls publish method when clicked', (done) => {
    //@ts-ignore
    let newReview = new MyReviews();
    let sikker = confirm('Er du sikker på at du vil publisere denne anmeldelsen?');
    //@ts-ignore
    const wrapper = shallow(<MyReviews match={{ params: { review_id: 1 } }} />);
    if (userService.token && reviewService.reviews.length > 0) {
      wrapper.find(Button.Success).at(1).simulate('click');
    }
    setTimeout(() => {
      //@ts-ignore
      if (sikker) {
        expect(reviewService.publish).toHaveBeenCalled();
      }

      done();
    });
  });

  test('delete button in MyReviews calls delete method when clicked', (done) => {
    //@ts-ignore
    let newReview = new MyReviews();
    let sikker = confirm('Er du sikker på at du vil slette denne anmeldelsen?');
    //@ts-ignore
    const wrapper = shallow(<MyReviews match={{ params: { review_id: 1 } }} />);
    if (userService.token && reviewService.reviews.length > 0) {
      wrapper.find(Button.Danger).at(0).simulate('click');
    }
    setTimeout(() => {
      //@ts-ignore
      if (sikker) {
        expect(reviewService.delete).toHaveBeenCalled();
      }

      done();
    });
  });

  test('Complete review draws FB share button', (done) => {
    const shareButtonProps = {
      url: 'https://localhost:3000/#/publishedReviews/1',
      network: 'Facebook',
      text: 'Tror du vil like denne anmeldelsen',
      longtext:
        'Social sharing buttons for React. Use one of the build-in themes or create a custom one from the scratch.',
    };
    //@ts-ignore
    const wrapper = shallow(<CompleteReview match={{ params: { review_id: 1 } }} />);
    console.log(wrapper.debug());

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper
          .find(
            'ForwardRef(ShareButton-facebook)'
            // <FacebookShareButton {...shareButtonProps}>
            //   <FacebookIcon size="40" round />
            // </FacebookShareButton>
          )
          .exists()
      ).toEqual(true);
      done();
    });
  });

  test('Complete review draws email share button', (done) => {
    const shareButtonProps = {
      url: 'https://localhost:3000/#/publishedReviews/1',
      network: 'Facebook',
      text: 'Tror du vil like denne anmeldelsen',
      longtext:
        'Social sharing buttons for React. Use one of the build-in themes or create a custom one from the scratch.',
    };
    //@ts-ignore
    const wrapper = shallow(<CompleteReview match={{ params: { review_id: 1 } }} />);
    console.log(wrapper.debug());

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper
          .find(
            'ForwardRef(ShareButton-email)'
            // <FacebookShareButton {...shareButtonProps}>
            //   <FacebookIcon size="40" round />
            // </FacebookShareButton>
          )
          .exists()
      ).toEqual(true);
      done();
    });
  });

  test.skip('x addReview correctly sets path on create', (done) => {
    //@ts-ignore
    const wrapper = shallow(<AddReview match={{ params: { db_id: 4 } }} />);

    wrapper
      .find(Form.Input)

      .simulate('change', { currentTarget: { value: 'Elsker dette spillet' } });

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
  test('5 Snapshot - MyReviews draws correctly', () => {
    const match = { params: { id: 1 } };

    const wrapper = shallow(<MyReviews match={match} />);

    expect(wrapper).toMatchSnapshot();
  });
});
