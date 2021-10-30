import axios from 'axios';
import { sharedComponentData } from 'react-simplified';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Game = {
  game_id: number;
  game_title: string;
  genre: string[];
  genre_id: number;
  platform: string[];
  game_description: string;
};

export type Review = {
  review_id: number;
  game_id: string;
  external_game_id: string[];
  game_title: number;
  genre: string[];
  platform: string;
  review_title: string;
  text: string;
  user_id: number;
  rating: number;
  published: boolean;
};

class GameService {
  game: Game = {
    game_id: 0,
    game_title: '',
    genre: [],
    genre_id: 0,
    platform: [],
    game_description: '',
  };
  games: Game[] = [];

  /**
   * Get game with given id.
   */
  get(id: number) {
    return axios.get<Game>('/games/' + id).then((response) => response.data);
  }

  /**
   * Get all games.
   */
  getAll() {
    return axios.get<Game[]>('/games').then((response) => response.data);
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(title: string, genre: string, platform: number, description: string) {
    return axios
      .post<{ id: number }>('/games', {
        game_title: title,
        genre: genre,
        platform: platform,
        game_description: description,
      })
      .then((response) => response.data.id);
  }
}

class ReviewService {
  review: Review = {
    review_id: 0,
    game_id: '',
    external_game_id: [],
    game_title: 0,
    genre: [],
    platform: '',
    review_title: '',
    text: '',
    user_id: 0,
    rating: 0,
    published: false,
  };
  reviews: Review[] = [];

  /**
   * Get review with given id.
   */
  get(id: number) {
    return axios.get<Review>('/reviews/' + id).then((response) => response.data);
  }

  /**
   * Get all reviews.
   */
  getAll() {
    return axios.get<Review[]>('/reviews').then((response) => response.data);
  }

  /**
   * Create new review having the given title.
   *
   * Resolves the newly created review id.
   */
  create(title: string, text: string, rating: number) {
    return axios
      .post<{ id: number }>('/reviews', { review_title: title, text: text, rating: rating })
      .then((response) => response.data.id);
  }
}

export let gameService = sharedComponentData(new GameService());
export let reviewService = sharedComponentData(new ReviewService());
