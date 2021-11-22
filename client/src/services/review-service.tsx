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
  user_nickname: string;
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
  user_nickname: string;
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
    user_nickname: '',
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
    user_nickname: '',
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
   * Get review with given game id.
   */
  getAllByGameId(id: number) {
    return userService.axios.get<Review[]>('/reviews/game/' + id).then((response) => response.data);
  }

  /**
   * Get review with given genre id.
   */
  getAllByGenreId(id: number) {
    return userService.axios
      .get<Review[]>('/reviews/genre/' + id)
      .then((response) => response.data);
  }

  /**
   * Get review with given platform id.
   */
  getAllByPlatformId(id: number) {
    return userService.axios
      .get<Review[]>('/reviews/platform/' + id)
      .then((response) => response.data);
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
  like(review_id: number, relevant: number) {
    return userService.axios
      .patch<Review>('/reviews/' + review_id + '/relevant', {
        relevant: relevant,
      })
      .then((response) => response.data);
  }

  //Check if a user has previously liked a review he is visiting
  isLiked(review_id: number) {
    return userService.axios
      .get<{ id: number; relevant: boolean }>('/reviews/' + review_id + '/relevant')
      .then((response) => response.data.relevant);
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

  //Fetch the ten most popular reviws based on likes
  getTopTen() {
    return axios.get<Review[]>('/reviews/topTen/').then((response) => response.data);
  }

  //Fetch the ten last published reviews

  getLastTen() {
    return axios.get<Review[]>('/reviews/lastTen/').then((response) => response.data);
  }
}

export let reviewService = sharedComponentData(new ReviewService());
