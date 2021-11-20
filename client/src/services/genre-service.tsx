import axios, { AxiosInstance } from 'axios';
import { sharedComponentData } from 'react-simplified';
import userService from './user-service';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Genre = {
  genre_id: number;
  genre_name: string;
  genre_img: string;
};

class GenreService {
  genre: Genre = {
    genre_id: 0,
    genre_name: '',
    genre_img: '',
  };
  genres: Genre[] = [];

  axios!: AxiosInstance;

  async test() {
    this.axios.get('/test').then(function (response) {
      console.log(response.data);
    });
  }

  /**
   * Get genre with given id.
   */
  get(id: number) {
    return axios.get<Genre>('/genres/' + id).then((response) => response.data);
  }

  /**
   * Get genre id with given name.
   */
  getId(name: string) {
    return axios.get<Genre>('/genres/get/' + name).then((response) => response.data);
  }

  /**
   * Get all genres.
   */
  getAll() {
    return axios.get<Genre[]>('/genres').then((response) => response.data);
  }

  /**
   * Create new genre having the given name.
   *
   * Resolves the newly created genre id.
   */
  create(name: string) {
    return userService.axios
      .post<{ id: number }>('/genres', {
        name: name,
      })
      .then((response) => response.data.id);
  }
  updateGenreMap(game_id: number, genre_id: number) {
    return userService.axios
      .post<{ id: number }>('/genres/map', {
        game_id: game_id,
        genre_id: genre_id,
      })
      .then((response) => response.data.id);
  }

  stringToId(genre: string) {
    return this.genres.find((s) => s.genre_name == genre)?.genre_id || 0;
  }

  idToString(id: number) {
    return this.genres.find((s) => s.genre_id == id)?.genre_name || 'None';
  }

  updateGenreMapString(game_id: number, genre: string) {
    return userService.axios
      .post<{ id: number }>('/genres/map/string', {
        game_id: game_id,
        genre: genre,
      })
      .then((response) => response.data.id);
  }
}

export let genreService = sharedComponentData(new GenreService());
