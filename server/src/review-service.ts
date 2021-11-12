import { resolveConfig } from 'prettier';
import pool from './mysql-pool';

export type Review = {
  review_id: number;
  game_id: string;
  game_title: string;
  review_title: string;
  text: string;
  user_id: number;
  rating: number;
  published: boolean;
  genre_id: number;
  platform_id: number;
  relevant: number;
  likes: number;
};

class ReviewService {
  review: Review = {
    review_id: 0,
    game_id: '',
    game_title: '',
    review_title: '',
    text: '',
    user_id: 0,
    rating: 0,
    published: false,
    genre_id: 0,
    platform_id: 0,
    relevant: 0,
    likes: 0,
  };
  reviews: Review[] = [];

  /**
   * Create new review having the given title.
   *
   
   */
  create(game_id: number, review_title: string, text: string, rating: number, user_id: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO reviews SET game_id=?, review_title=?, text=?, rating=?, published=0, user_id=?',
        [game_id, review_title, text, rating, user_id],
        (error, results) => {
          if (error) return reject(error);

          resolve(Number(results.insertId));
        }
      );
    });
  }

  //Edit existing review before publishing
  edit(review_id: number, review_title: string, text: string, rating: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'UPDATE reviews SET review_title=?, text=?, rating=? WHERE review_id=?',
        [review_title, text, rating, review_id],
        (error, results) => {
          if (error) return reject(error);

          resolve(Number(results.insertId));
        }
      );
    });
  }

  /**
   * Get unpublished review based on ID
   */
  getDraft(review_id: number) {
    return new Promise<Review | undefined>((resolve, reject) => {
      pool.query(
        'SELECT * FROM reviews WHERE PUBLISHED=0 AND review_id = ?',
        [review_id],
        (error, results) => {
          if (error) return reject(error);

          resolve(results[0]);
        }
      );
    });
  }

  /**
   * Get single complete review based on ID
   */
  get(review_id: number) {
    return new Promise<Review | undefined>((resolve, reject) => {
      pool.query(
        `SELECT *, (SELECT COUNT(*) FROM mapping_relevant WHERE review_id = r.review_id) AS likes FROM reviews r WHERE PUBLISHED=1 AND review_id = ?`,
        [review_id],
        (error, results) => {
          if (error) return reject(error);

          resolve(results[0]);
        }
      );
    });
  }

  //add review to published list
  publish(id: number, published: boolean) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'UPDATE reviews SET PUBLISHED=? WHERE review_id=?',
        [published, id],
        (error, results) => {
          if (error) return reject(error);

          resolve(id);
        }
      );
    });
  }

  //add like to a review
  relevant(review_id: number, user_id: number, relevant: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        relevant == 0
          ? `DELETE FROM mapping_relevant WHERE review_id = ? AND user_id=?`
          : `INSERT INTO mapping_relevant (review_id, user_id) VALUES (?, ?)`,
        [review_id, user_id],
        (error, results) => {
          if (error) return reject(error);

          resolve(Number(results.insertId));
        }
      );
    });
  }

  /**
   * Get published reviews
   */
  getPublished() {
    return new Promise<Review[]>((resolve, reject) => {
      pool.query(
        `SELECT game_title, review_id, review_title, rating, (SELECT COUNT(*) FROM mapping_relevant WHERE review_id = r.review_id) AS likes 
        FROM games g INNER JOIN reviews r ON g.game_id = r.game_id 
        WHERE published = 1 ORDER BY game_title, review_title;`,
        (error, results) => {
          if (error) return reject(error);

          resolve(results);
        }
      );
    });
  }

  //Get published reviews based on genre

  getGenre(genre_id: number) {
    return new Promise<Review[]>((resolve, reject) => {
      pool.query(
        `SELECT ge.genre_id, ge.genre_name, g.game_title, r.review_id, r.review_title, r.rating, r.text, (SELECT COUNT(*) FROM mapping_relevant WHERE review_id = r.review_id) AS likes 
        FROM reviews r
        INNER JOIN games g ON g.game_id = r.game_id
        INNER JOIN mapping_genre mg ON mg.game_id = g.game_id
        INNER JOIN genres ge ON mg.genre_id = ge.genre_id
        WHERE published= 1 AND ge.genre_id = ?`,
        [genre_id],
        (error, results) => {
          if (error) return reject(error);

          resolve(results);
        }
      );
    });
  }

  //Get published reviews based on platform

  getPlatform(platform_id: number) {
    return new Promise<Review[]>((resolve, reject) => {
      pool.query(
        `SELECT p.platform_id, p.platform_name, g.game_title, r.review_id, r.review_title, r.rating, (SELECT COUNT(*) FROM mapping_relevant WHERE review_id = r.review_id) AS likes
        FROM reviews r
        INNER JOIN games g ON g.game_id = r.game_id
        INNER JOIN mapping_platform mp ON mp.game_id = g.game_id
        INNER JOIN platforms p ON mp.platform_id = p.platform_id
        WHERE published=1 AND p.platform_id = ?`,
        [platform_id],
        (error, results) => {
          if (error) return reject(error);

          resolve(results);
        }
      );
    });
  }

  /**
   * Delete review with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM reviews WHERE review_id = ?', [id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }
}

export const reviewService = new ReviewService();
