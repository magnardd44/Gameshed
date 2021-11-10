import axios from 'axios';
import { sharedComponentData } from 'react-simplified';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Game = {
  game_id: number;
  igdb_id: number;
  game_title: string;
  genre: number;
  genres: number[];
  genre_id: number;
  platform: number;
  platforms: number[];
  game_description: string;
};

class GameService {
  game: Game = {
    game_id: 0,
    igdb_id: 0,
    game_title: '',
    genre: 0,
    genres: [],
    genre_id: 0,
    platform: 0,
    platforms: [],
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

export type Game2 = {
	game_id: number;
	igdb_id: number;
	game_title: string;
	genre: string[];
	platform: string[];
	game_description: string;
	igdb?: extraIGDB | null;
};

export type extraIGDB = {
	cover_url: '';
	aggregated_rating: number;
	screenshots_url: string[];
	similar_games: id_name_link[];
	release_date: number;
}

export type id_name_link = {
	id: number;
	name: string;
}

class GameService2 {
	games: Game2[] = [];

	emptyGame(): Game2 {
		return {
			game_id: 0,
			igdb_id: 0,
			game_title: '',
			genre: [],
			platform: [],
			game_description: '',
			igdb: null
		}
	}

	/**
	 * Get game with given id.
	 */
	get(id: number) {
		return axios.get<Game2>('/games/' + id).then((response) => response.data);
	}

	/**
	 * Get all games.
	 */
	getAll() {
		return axios.get<Game[]>('/games').then((response) => response.data);
	}

	get_igdb(id: number) {
		return axios.get<Game2>('search/get_all/' + id)
			.then((response) => response.data)
	}

	get_igdb_extra(id: number) {
		return axios.get<extraIGDB>('search/get_extra/' + id)
			.then((response) => response.data)
	}

	create(game: Game2) {
		return axios
			.post<{ id: number }>('/games', {
				game_title: game.game_title,
				game_description: game.game_description,
			})
			.then((response) => response.data.id);
			}
}

export let gameService = sharedComponentData(new GameService());
export let gameService2 = sharedComponentData(new GameService2());
