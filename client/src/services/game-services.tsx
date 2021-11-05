import axios from 'axios';
import { sharedComponentData } from 'react-simplified';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Game = {
  game_id: number;
  igdb_id: number;
  game_title: string;
  genre: number;
  genre_id: number;
  platform: number;
  game_description: string;
};

class GameService {
  game: Game = {
    game_id: 0,
	igdb_id: 0,
    game_title: '',
    genre: 0,
    genre_id: 0,
    platform: 0,
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
   * Create new game having the given title.
   *
   * Resolves the newly created game id.
   */
  create(title: string, description: string) {
    return axios
      .post<{ id: number }>('/games', {
        game_title: title,
        game_description: description,
      })
      .then((response) => response.data.id);
  }
}

export let gameService = sharedComponentData(new GameService());
