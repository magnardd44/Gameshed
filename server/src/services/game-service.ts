import pool from '../mysql-pool';

export type Game = {
  game_id: number;
  igdb_id: number | null;
  game_title: string;
  genre: string[];
  genre_id?: number;
  platform: string[];
  game_description: string;
};

class GameService {
  game: Game = {
    game_id: 0,
    igdb_id: 0,
    game_title: '',
    genre: [],
    genre_id: 0,
    platform: [],
    game_description: '',
  };
  games: Game[] = [];

  /**
   * Search for game on partial name
   */
  search(searchString: string) {
    return new Promise<Game[]>((resolve, reject) => {
      pool.query(
        'SELECT * FROM games WHERE LOWER(game_title) LIKE ?',
        ['%' + searchString.toLowerCase() + '%'],
        (error, results) => {
          if (error) return reject(error);

          //resolve(results);

          this.games = results;
          if (this.games.length > 0) {
            this.games.map((game) => {
              let platformPromise = new Promise<void>((resolve, reject) => {
                pool.query(
                  'SELECT platform_name FROM mapping_platform left join platforms on mapping_platform.platform_id = platforms.platform_id WHERE mapping_platform.game_id = ?',
                  [game.game_id],
                  (error, results) => {
                    if (error) return reject(error);

                    game.platform = results.map((e: any) => e.platform_name);

                    resolve();
                  }
                );
              });

              let genrePromise = new Promise<void>((resolve, reject) => {
                pool.query(
                  'SELECT genre_name FROM mapping_genre left join genres on mapping_genre.genre_id = genres.genre_id WHERE mapping_genre.game_id = ?',
                  [game.game_id],
                  (error, results) => {
                    if (error) return reject(error);

                    game.genre = results.map((e: any) => e.genre_name);

                    resolve();
                  }
                );
              });

              Promise.all([platformPromise, genrePromise]).then((result) => resolve(this.games));
            });
          } else resolve(this.games);
        }
      );
    });
  }

  /**
   * Create new game having the given title.
   */
  create(igdb_id: number, title: string, description: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO games SET igdb_id=?, game_title=?, game_description=?',
        [igdb_id > 0 ? igdb_id : null, title, description],
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

        if (this.game) {
          let platformPromise = new Promise<void>((resolve, reject) => {
            pool.query(
              'SELECT platform_name FROM mapping_platform left join platforms on mapping_platform.platform_id = platforms.platform_id WHERE mapping_platform.game_id = ?',
              [this.game.game_id],
              (error, results) => {
                if (error) return reject(error);

                this.game.platform = results.map((e: any) => e.platform_name);

                resolve();
              }
            );
          });

          let genrePromise = new Promise<void>((resolve, reject) => {
            pool.query(
              'SELECT genre_name FROM mapping_genre left join genres on mapping_genre.genre_id = genres.genre_id WHERE mapping_genre.game_id = ?',
              [this.game.game_id],
              (error, results) => {
                if (error) return reject(error);

                this.game.genre = results.map((e: any) => e.genre_name);

                resolve();
              }
            );
          });

          Promise.all([platformPromise, genrePromise]).then((result) => resolve(this.game));
        } else {
          resolve(results[0]);
        }
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
}

export const gameService = new GameService();
