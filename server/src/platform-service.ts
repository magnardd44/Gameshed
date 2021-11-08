import pool from './mysql-pool';

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
   * Get platform with given id.
   */
  get(id: number) {
    return new Promise<Platform | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM platforms WHERE platform_id = ?', [id], (error, results) => {
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
  create(name: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO platforms SET platform_name=?', [name], (error, results) => {
        if (error) return reject(error);

        resolve(Number(results.insertId));
      });
    });
  }
  updatePlatformMap(platform_id: number, game_id: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO mapping_platform SET p_mapping_id=NULL, platform_id=?, game_id=?',
        [platform_id, game_id],
        (error, results) => {
          if (error) return reject(error);

          resolve(Number(results.insertId));
        }
      );
    });
  }
}

export const platformService = new PlatformService();
