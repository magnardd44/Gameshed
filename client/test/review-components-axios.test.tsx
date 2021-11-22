import * as React from 'react';
import { shallow } from 'enzyme';
import { Home, ReviewHome } from '../src/home-components';
import { Alert, Card, Row, Column, Form, Button } from '../src/widgets';
import {
  history,
  AddReview,
  EditReview,
  PublishReview,
  CompleteReview,
  PublishedReviews,
  MyReviews,
} from '../src/review-components';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { reviewService } from '../src/services/review-service';
import { FacebookIcon, FacebookShareButton } from 'react-share';
import { userInfo } from 'os';
import userService from '../src/services/user-service';
import { gameService } from '../src/services/game-service';

const validToken = { id: 1, token: 'token' };

const mockAdapter = new MockAdapter(axios);
const mockUserAdapter = new MockAdapter(userService.axios);

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

describe('PublishedReviews', () => {
  test('Maps reviews', (done) => {
    const spy = jest.spyOn(history, 'push');
    mockAdapter.onGet('/reviews/').reply(200, completeReviews);

    reviewService.reviews = completeReviews;

    const wrapper = shallow(<PublishedReviews />);

    setTimeout(() => {
      wrapper.find(Button.Success).first().simulate('click');
      setTimeout(() => {
        expect(spy).toBeCalled();
        done();
      });
    });
  });
});

describe('AddReview', () => {
  test('Game set', (done) => {
    mockAdapter.onGet('search/get_all/1').reply(200, testGameComplete);

    //reviewService.reviews = completeReviews;

    const spy = jest.spyOn(gameService, 'set');

    //@ts-ignore
    const wrapper = shallow(<AddReview match={{ params: { igdb_id: 1, db_id: 0 } }} />);

    setTimeout(() => {
      expect(spy).resolves;
      done();
      //			wrapper.find(Button.Success).first().simulate('click');
      //			setTimeout(()=>{
      //					expect(spy).toBeCalled();
      //					});
    });
  });
  test('No game', (done) => {
    //mockAdapter.onGet('/reviews/').reply(200, completeReviews);

    //reviewService.reviews = completeReviews;

    const spy = jest.spyOn(gameService, 'set');

    //@ts-ignore
    const wrapper = shallow(<AddReview match={{ params: { igdb_id: 0, db_id: 0 } }} />);

    setTimeout(() => {
      expect(spy).rejects;
      done();
      //			wrapper.find(Button.Success).first().simulate('click');
      //			setTimeout(()=>{
      //					expect(spy).toBeCalled();
      //					});
    });
  });
  test('Input fields', (done) => {
    mockAdapter.onGet('search/get_all/1').reply(200, testGameComplete);

    //@ts-ignore
    const wrapper = shallow(<AddReview match={{ params: { igdb_id: 1, db_id: 0 } }} />);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'review title' } });
    wrapper.find(Form.Textarea).simulate('change', { currentTarget: { value: 'review text' } });
    wrapper.find(Form.Select).simulate('change', { currentTarget: { value: '1' } });

    setTimeout(() => {
      expect(reviewService.review.review_title).toEqual('review title');
      expect(reviewService.review.text).toEqual('review text');
      expect(reviewService.review.rating).toEqual(1);
      done();
    });
  });

  test('Input fields', (done) => {
    const spy = jest.spyOn(history, 'push');

    //@ts-ignore
    const wrapper = shallow(<AddReview match={{ params: { igdb_id: 0, db_id: 0 } }} />);

    wrapper.find({ children: 'Tilbake' }).simulate('click');

    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    });
  });

  test('Create game if in db', (done) => {
    const spy = jest.spyOn(history, 'push');
    const spyAlert = jest.spyOn(Alert, 'success');
    mockAdapter.onGet('search/get_all/1').reply(200, testGameComplete);
    mockUserAdapter.onPost('reviews').reply(200, 1);

    //@ts-ignore
    const wrapper = shallow(<AddReview match={{ params: { igdb_id: 1, db_id: 1 } }} />);

    reviewService.review.review_title = 'title';
    reviewService.review.text = 'title';
    reviewService.review.rating = 1;

    wrapper.find({ children: 'Lagre' }).simulate('click');

    setTimeout(() => {
      expect(spyAlert).toBeCalled;
      expect(spy).toBeCalledWith('/myReviews');
      done();
    });
  });

  test('Create game if not in db', (done) => {
    const spy = jest.spyOn(history, 'push');
    const spyAlert = jest.spyOn(Alert, 'success');
    mockAdapter.onGet('search/get_all/1').reply(200, testGameComplete);
    mockUserAdapter.onPost('games').reply(200, 1);
    mockUserAdapter.onPost('genres/map/string').reply(200, 1);
    mockUserAdapter.onPost('platforms/map/string').reply(200, 1);
    mockUserAdapter.onPost('reviews').reply(200, 1);

    //@ts-ignore
    const wrapper = shallow(<AddReview match={{ params: { igdb_id: 1, db_id: 0 } }} />);

    reviewService.review.review_title = 'title';
    reviewService.review.text = 'title';
    reviewService.review.rating = 1;

    wrapper.find({ children: 'Lagre' }).simulate('click');

    setTimeout(() => {
      expect(spyAlert).toBeCalled;
      expect(spy).toBeCalledWith('/myReviews');
      done();
    });
  });
});

describe('CompleteReview', () => {
  test('Like the review', (done) => {
    mockAdapter.onGet('/games/1').reply(200, testGameComplete);
    mockAdapter.onGet('/search/get_extra/22').reply(200, testGameComplete.igdb);
    mockUserAdapter.onGet('/reviews/review/1').reply(200, completeReviews[0]);
    mockUserAdapter.onGet('/reviews/1/relevant').reply(200, true);
    mockUserAdapter.onPatch('/reviews/1/relevant').reply(200);

    const wrapper = shallow(<CompleteReview match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.find({ children: 'Like' }).first().simulate('click');
      setTimeout(() => {
        //@ts-ignore
        expect(wrapper.instance().counter).toBe(1);
        wrapper.find({ children: 'Like' }).first().simulate('click');
        setTimeout(() => {
          //@ts-ignore
          expect(wrapper.instance().counter).toBe(0);

          done();
        });
      });
    });
  });
});

describe('MyReviews', () => {
  beforeEach(() => {
    userService.token = validToken;
    reviewService.reviews = completeReviews;
  });

  test('Publish my review', (done) => {
    const wrapper = shallow(<MyReviews match={{ params: { id: 1 } }} />);

    const spy = jest.spyOn(history, 'push');
    wrapper.find({ children: 'Ta meg til anmeldelsen' }).first().simulate('click');

    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    });
  });

  test('Publish my review', (done) => {
    const wrapper = shallow(<MyReviews match={{ params: { id: 1 } }} />);

    const spy = jest.spyOn(window, 'confirm');
    spy.mockImplementationOnce(() => true);

    mockUserAdapter
      .onPatch('/reviews/' + completeReviews[2].review_id + '/publish')
      .reply(200, Promise.resolve(1));

    const spyAlert = jest.spyOn(Alert, 'success');
    wrapper.find({ children: 'Publiser' }).first().simulate('click');

    //    const spy = jest.spyOn(history, 'push');
    //    const spyAlert = jest.spyOn(Alert, 'success');
    //    mockAdapter.onGet('search/get_all/1').reply(200, testGameComplete);
    //    mockUserAdapter.onPost('games').reply(200, 1);
    //    mockUserAdapter.onPost('genres/map/string').reply(200, 1);
    //    mockUserAdapter.onPost('platforms/map/string').reply(200, 1);
    //    mockUserAdapter.onPost('reviews').reply(200, 1);
    //
    //    //@ts-ignore
    //    const wrapper = shallow(<AddReview match={{ params: { igdb_id: 1, db_id: 0 } }} />);
    //
    //    reviewService.review.review_title = 'title';
    //    reviewService.review.text = 'title';
    //    reviewService.review.rating = 1;
    //
    //    wrapper.find({ children: 'Lagre' }).simulate('click');
    //
    setTimeout(() => {
      expect(spyAlert).toBeCalledWith('Anmeldelse publisert!');
      //     expect(spy).toBeCalledWith('/myReviews');
      done();
    });
  });

  test('Edit review', (done) => {
    const wrapper = shallow(<MyReviews match={{ params: { id: 1 } }} />);

    const spy = jest.spyOn(history, 'push');
    //spy.mockImplementationOnce(()=>true);

    //mockUserAdapter.onDelete('/reviews/' + completeReviews[0].review_id).reply(200, Promise.resolve(1));

    //const spyAlert = jest.spyOn(Alert, 'success');
    wrapper.find({ children: 'Rediger' }).first().simulate('click');

    //    const spy = jest.spyOn(history, 'push');
    //    const spyAlert = jest.spyOn(Alert, 'success');
    //    mockAdapter.onGet('search/get_all/1').reply(200, testGameComplete);
    //    mockUserAdapter.onPost('games').reply(200, 1);
    //    mockUserAdapter.onPost('genres/map/string').reply(200, 1);
    //    mockUserAdapter.onPost('platforms/map/string').reply(200, 1);
    //    mockUserAdapter.onPost('reviews').reply(200, 1);
    //
    //    //@ts-ignore
    //    const wrapper = shallow(<AddReview match={{ params: { igdb_id: 1, db_id: 0 } }} />);
    //
    //    reviewService.review.review_title = 'title';
    //    reviewService.review.text = 'title';
    //    reviewService.review.rating = 1;
    //
    //    wrapper.find({ children: 'Lagre' }).simulate('click');
    //
    setTimeout(() => {
      //expect(spyAlert).toBeCalledWith('Anmeldelse slettet');
      expect(spy).toBeCalledWith('/editReview/' + completeReviews[0].review_id);
      done();
    });
  });

  test('Delete review', (done) => {
    const wrapper = shallow(<MyReviews match={{ params: { id: 1 } }} />);

    const spy = jest.spyOn(window, 'confirm');
    spy.mockImplementationOnce(() => true);

    mockUserAdapter
      .onDelete('/reviews/' + completeReviews[0].review_id)
      .reply(200, Promise.resolve(1));

    const spyAlert = jest.spyOn(Alert, 'success');
    wrapper.find({ children: 'Slett' }).first().simulate('click');

    //    const spy = jest.spyOn(history, 'push');
    //    const spyAlert = jest.spyOn(Alert, 'success');
    //    mockAdapter.onGet('search/get_all/1').reply(200, testGameComplete);
    //    mockUserAdapter.onPost('games').reply(200, 1);
    //    mockUserAdapter.onPost('genres/map/string').reply(200, 1);
    //    mockUserAdapter.onPost('platforms/map/string').reply(200, 1);
    //    mockUserAdapter.onPost('reviews').reply(200, 1);
    //
    //    //@ts-ignore
    //    const wrapper = shallow(<AddReview match={{ params: { igdb_id: 1, db_id: 0 } }} />);
    //
    //    reviewService.review.review_title = 'title';
    //    reviewService.review.text = 'title';
    //    reviewService.review.rating = 1;
    //
    //    wrapper.find({ children: 'Lagre' }).simulate('click');
    //
    setTimeout(() => {
      expect(spyAlert).toBeCalledWith('Anmeldelse slettet');
      expect(reviewService.reviews).toHaveLength(2);
      //     expect(spy).toBeCalledWith('/myReviews');
      done();
    });
  });
});
