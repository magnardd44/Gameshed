import pool from './mysql-pool';

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
   * Create new game having the given title.
   */
  create(title: string, description: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO games SET game_title=?, game_description=?',
        [title, description],
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
      pool.query('SELECT * FROM games WHERE game_id = ?', [id], (error, results) => {
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

export const gameService = new GameService();
