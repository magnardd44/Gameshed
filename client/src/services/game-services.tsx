import axios from 'axios';
import { sharedComponentData } from 'react-simplified';
import { Genre } from './genre-service';
import { Platform } from './platform-service';

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
  create(igdb_id: number, title: string, description: string) {
    return axios
      .post<{ id: number }>('/games', {
        igdb_id: igdb_id,
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
};

export type id_name_link = {
  id: number;
  name: string;
};

class GameService2 {
  games: Game2[] = [];

  game: Game2 = {
    game_id: 0,
    igdb_id: 0,
    game_title: '',
    genre: [],
    platform: [],
    game_description: '',
    igdb: null,
  };

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
    return axios.get<Game2>('search/get_all/' + id).then((response) => response.data);
  }

  get_igdb_extra(id: number) {
    return axios.get<extraIGDB>('search/get_extra/' + id).then((response) => response.data);
  }

  create(game: Game2) {
    return axios
      .post<{ id: number }>('/games', {
        game_title: game.game_title,
        game_description: game.game_description,
      })
      .then((response) => response.data.id);
  }
}

class GameService3 {
  db: Game2[] = [];
  igdb: Game2[] = [];

  current: Game2 = this.empty();

  empty() {
    return {
      game_id: 0,
      igdb_id: 0,
      game_title: '',
      genre: [],
      platform: [],
      game_description: '',
      igdb: null,
    };
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
    return axios
      .get<Game4[]>('/games')
      .then((response) => response.data)
      .then((games) => {
        this.db = [];
        games.forEach((g) => {
          this.db.push({
            game_id: g.game_id,
            igdb_id: g.igdb_id,
            game_title: g.game_title,
            genre: g.genre,
            platform: g.platform,
            game_description: g.game_description,
            igdb: null,
          });
        });
        console.log(this.db);
      })
      .catch((err) => console.log(err));
  }

  search_db(searchString: string) {
    axios
      .get('games/search/' + searchString)
      .then((response) => {
        this.db = response.data;
        //this.remove_duplicates();
      })
      .catch((err) => console.log(err));
  }

  search_igdb(searchString: string) {
    axios
      .post('search', { game: searchString })
      .then((response) => {
        this.igdb = response.data;
        this.remove_duplicates();
      })
      .catch((err) => console.log(err));
  }

  remove_duplicates() {
    this.igdb = this.igdb.filter((igdb) => {
      return (
        0 >
        this.db.findIndex((db) => {
          return igdb.igdb_id == db.igdb_id;
        })
      );
    });
  }

  clear() {
    this.db = [];
    this.igdb = [];
  }

  set(db_id: number, igdb_id: number) {
    if (db_id > 0) {
      this.get(db_id).then((response) => {
        this.current = response;
        if (this.current.igdb_id > 0) {
          this.get_igdb_extra(this.current.igdb_id).then((response) => {
            this.current.igdb = response;
          });
        }
      });
    } else if (igdb_id > 0) {
      this.get_igdb(igdb_id).then((response) => {
        this.current = response;
      });
    } else {
      console.log('gameService: No game selected.');
    }

    //  if (db_id > 0) {
    //    let game = this.db.find((g) => g.game_id == db_id);
    //    if (game) {
    //      this.current = game;
    //      if (game.igdb == null && game.igdb_id > 0) {
    //        this.get_igdb_extra(game.igdb_id)
    //          .then((response) => {
    //            this.current.igdb = response;
    //          })
    //          .catch(() => console.log('Cannot get igdb extra'));
    //      }
    //    } else {
    //      this.get(db_id)
    //        .then((response) => {
    //          this.current = response;
    //        })
    //        .catch(() => console.log('Cannot find game in database'));
    //    }
    //  } else {
    //    let game = this.igdb.find((g) => g.igdb_id == igdb_id);
    //    if (game) {
    //      this.current = game;
    //    } else {
    //      this.get_igdb(igdb_id)
    //        .then((response) => {
    //          this.current = response;
    //        })
    //        .catch(() => console.log('Cannot get game from igdb'));
    //    }
    //  }
  }

  get_igdb(id: number) {
    return axios.get<Game2>('search/get_all/' + id).then((response) => response.data);
  }

  get_igdb_extra(id: number) {
    return axios.get<extraIGDB>('search/get_extra/' + id).then((response) => response.data);
  }

  create(game: Game2) {
    return axios
      .post<{ id: number }>('/games', {
        game_title: game.game_title,
        game_description: game.game_description,
      })
      .then((response) => response.data.id);
  }

  search_db_and_extra(searchString: string) {
    axios
      .get('games/search/' + searchString)
      .then((response) => {
        this.db = response.data;
        this.db.forEach((game) => {
          this.get_igdb_extra(game.igdb_id).then((extra) => {
            game.igdb = extra;
          });
        });
      })
      .catch((err) => console.log(err));
  }

  search_both(searchString: string) {}
}

export type Game4 = {
  game_id: number;
  igdb_id: number;
  game_title: string;
  genre: string[];
  platform: string[];
  game_description: string;
};

export let gameService = sharedComponentData(new GameService());
export let gameService2 = sharedComponentData(new GameService2());
export let gameService3 = sharedComponentData(new GameService3());
