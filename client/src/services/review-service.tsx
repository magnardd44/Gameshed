import axios from 'axios';
import { sharedComponentData } from 'react-simplified';
import userService from './user-service';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Oauth_token = {
  access_token: string;
  expire_time: number;
  token_type: string;
};

class SearchService {
  token: Oauth_token = {
    access_token: '',
    expire_time: 0,
    token_type: '',
  };
}

export type Review = {
  review_id: number;
  game_id: number;
  game_title: string;
  review_title: string;
  text: string;
  user_id: number;
  rating: number;
  published: boolean;
  genre_id: number;
  platform_id: number;
  relevant: number;
  likes: number;
};

export type RelatedReview = {
  review_id: number;
  game_id: number;
  game_title: string;
  review_title: string;
  text: string;
  user_id: number;
  rating: number;
  published: boolean;
  genre_id: number;
  platform_id: number;
  relevant: number;
  likes: number;
};

class ReviewService {
  review: Review = {
    review_id: 0,
    game_id: 0,
    game_title: '',
    review_title: '',
    text: '',
    user_id: 0,
    rating: 0,
    published: false,
    genre_id: 0,
    platform_id: 0,
    relevant: 0,
    likes: 0,
  };
  reviews: Review[] = [];

  relatedReview: RelatedReview = {
    review_id: 0,
    game_id: 0,
    game_title: '',
    review_title: '',
    text: '',
    user_id: 0,
    rating: 0,
    published: false,
    genre_id: 0,
    platform_id: 0,
    relevant: 0,
    likes: 0,
  };

  relatedReviews: RelatedReview[] = [];

  publishedreviews: Review[] = [];

  drafts: Review[] = [];

  /**
   * Get review with given id.
   */
  get(id: number) {
    return userService.axios.get<Review>('/reviews/review/' + id).then((response) => response.data);
  }

  /**
   * Get review with given id.
   */
  getAllByGameId(id: number) {
    return userService.axios.get<Review>('/reviews/' + id).then((response) => response.data);
  }

  /**
   * Get reviews with given id.
   */
  getAllById(user_id: number) {
    return axios.get<Review[]>('/reviews/users/' + user_id).then((response) => response.data);
  }

  /**
   * Get reviews with given id.
   */
  getAll() {
    return axios.get<Review[]>('/reviews/').then((response) => response.data);
  }

  /**
   * Get published reviews
   */
  getPublishedReviews() {
    return axios.get<Review[]>('/reviews/published').then((response) => response.data);
  }

  /**
   * Get reviews based on genre
   */
  getGenre(genre_id: number) {
    return axios.get<Review[]>('/reviews/genre/' + genre_id).then((response) => response.data);
  }

  //Get reviews based on platform
  getPlatform(platform_id: number) {
    return axios
      .get<Review[]>('/reviews/platform/' + platform_id)
      .then((response) => response.data);
  }

  /**
   * Create new review   *
   * Resolves the newly created review id.
   */
  create(game_id: number, title: string, text: string, rating: number) {
    return userService.axios
      .post<{ id: number }>('/reviews', {
        game_id: game_id,
        review_title: title,
        text: text,
        rating: rating,
      })
      .then((response) => response.data.id);
  }

  //Change review status to published
  publish(id: number) {
    return userService.axios
      .patch<Review>('/reviews/' + id + '/publish')
      .then((response) => response.data.review_id);
  }
  //Add like to review
  like(review_id: number, user_id: number, relevant: number) {
    return userService.axios
      .patch<Review>('/reviews/' + review_id + '/relevant', {
        relevant: relevant,
        user_id: user_id,
      })
      .then((response) => response.data);
  }

  //Edit review before publishing
  edit(id: number, title: string, text: string, rating: number) {
    return userService.axios
      .patch<Review>('/reviews/' + id, { title: title, text: text, rating: rating })
      .then((response) => response.data);
  }

  //Delete review
  delete(id: number) {
    return userService.axios
      .delete<Review>('reviews/' + id)
      .then((response) => response.data.review_id);
  }
}

export let reviewService = sharedComponentData(new ReviewService());
