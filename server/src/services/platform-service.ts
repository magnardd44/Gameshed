import pool from '../mysql-pool';

export type Platform = {
  platform_id: number;
  platform_name: string;
};

class PlatformService {
  platform: Platform = {
    platform_id: 0,
    platform_name: '',
  };
  platforms: Platform[] = [];

  /**
   * Get platform id with given name.
   */
  getId(name: string) {
    return new Promise<Platform | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM platforms WHERE platform_name = ?', [name], (error, results) => {
        if (error) return reject(error);

        this.platform = results[0];

        resolve(results[0]);
      });
    });
  }

  /**
   * Get all platforms.
   */
  getAll() {
    return new Promise<Platform[]>((resolve, reject) => {
      pool.query('SELECT * FROM platforms', (error, results) => {
        if (error) return reject(error);
        this.platforms = results;

        resolve(results);
      });
    });
  }

  /**
   * Delete platform with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM platforms WHERE platform_id = ?', [id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  /**
   * Create new platform having the given name.
   */
  create(platform_name: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO platforms SET platform_name=?', [platform_name], (error, results) => {
        if (error) return reject(error);

        resolve(Number(results.insertId));
      });
    });
  }

  /**
   * Create new mapping platform.
   */
  updatePlatformMap(platform_id: number, game_id: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO mapping_platform SET platform_id=?, game_id=?',
        [platform_id, game_id],
        (error, results) => {
          if (error) return reject(error);

          resolve(Number(results.insertId));
        }
      );
    });
  }

  updatePlatformMapString(platform: string, game_id: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO mapping_platform(game_id, platform_id) SELECT ?, platform_id FROM platforms WHERE platform_name=?',
        [game_id, platform],
        (error, results) => {
          if (error) return reject(error);

          resolve(Number(results.insertId));
        }
      );
    });
  }
}

export const platformService = new PlatformService();
