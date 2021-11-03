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

export let gameService = sharedComponentData(new GameService());
