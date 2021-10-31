import pool from './mysql-pool';

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
   * Create new game having the given title.
   */
  create(title: string, genre: string, platform: string[], description: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO games SET game_title=?, genre=?, platform=?, game_description',
        [title, genre, platform, description],
        (error, results) => {
          if (error) return reject(error);

          resolve(Number(results.insertId));
        }
      );
    });
  }

  /**
   * Get game with given id.
   */
  get(id: number) {
    return new Promise<Game | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM games WHERE id = ?', [id], (error, results) => {
        if (error) return reject(error);

        this.game = results[0];

        resolve(results[0]);
      });
    });
  }

  /**
   * Get all games.
   */
  getAll() {
    return new Promise<Game[]>((resolve, reject) => {
      pool.query('SELECT * FROM games', (error, results) => {
        if (error) return reject(error);
        this.games = results;

        resolve(results);
      });
    });
  }

  /**
   * Delete game with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM games WHERE id = ?', [id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
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
   * Create new review having the given title.
   *
   
   */
  create(review_title: string, text: string, rating: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO reviews SET review_title=?, text=?, rating=?',
        [review_title, text, rating],
        (error, results) => {
          if (error) return reject(error);

          resolve(Number(results.insertId));
        }
      );
    });
  }

  /**
   * Get review based on ID
   */
  get(id: number) {
    return new Promise<Review | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM reviews WHERE review_id = ?', [id], (error, results) => {
        if (error) return reject(error);

        resolve(results[0]);
      });
    });
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<Review[]>((resolve, reject) => {
      pool.query('SELECT * FROM reviews', (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  /**
   * Delete task with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Reviews WHERE review_id = ?', [id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }
}

export const gameService = new GameService();
export const reviewService = new ReviewService();
