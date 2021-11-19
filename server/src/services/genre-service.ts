import pool from '../mysql-pool';

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

  /**
   * Get genre with given id.
   */
  get(id: number) {
    return new Promise<Genre | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM genres WHERE genre_id = ?', [id], (error, results) => {
        if (error) return reject(error);

        this.genre = results[0];

        resolve(results[0]);
      });
    });
  }

  /**
   * Get genreId with given name.
   */
  getId(name: string) {
    return new Promise<Genre | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM genres WHERE genre_name = ?', [name], (error, results) => {
        if (error) return reject(error);

        this.genre = results[0];

        resolve(results[0]);
      });
    });
  }

  /**
   * Get all genres.
   */
  getAll() {
    return new Promise<Genre[]>((resolve, reject) => {
      pool.query('SELECT * FROM genres', (error, results) => {
        if (error) return reject(error);
        this.genres = results;

        resolve(results);
      });
    });
  }

  /**
   * Delete genre with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM genres WHERE genre_id = ?', [id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  /**
   * Create new genre having the given name.
   */
  create(name: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO genres SET genre_name=?', [name], (error, results) => {
        if (error) return reject(error);

        resolve(Number(results.insertId));
      });
    });
  }

  updateGenreMap(game_id: number, genre_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO mapping_genre SET g_mapping_id=NULL, game_id=?, genre_id=?',
        [game_id, genre_id],
        (error, results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  updateGenreMapString(game_id: number, genre: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO mapping_genre(game_id, genre_id) SELECT ?, genre_id FROM genres WHERE genre_name=?',
        [game_id, genre],
        (error, results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
}

export const genreService = new GenreService();
