import pool from '../mysql-pool';

export type Review = {
  review_id: number;
  game_id: number;
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
    game_id: 0,
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
  create(
    game_id: number,
    review_title: string,
    text: string,
    rating: number,
    user_id: number,
    published: boolean
  ) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO reviews SET game_id=?, review_title=?, text=?, rating=?, published=?, user_id=?',
        [game_id, review_title, text, rating, published, user_id],
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

          resolve(review_id);
        }
      );
    });
  }

  /**
   * Get all reviews
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
   * Get all reviews based on user ID
   */
  getAllById(user_id: number) {
    return new Promise<Review[]>((resolve, reject) => {
      pool.query('SELECT * FROM reviews WHERE user_id = ?', [user_id], (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  /**
   * Get all reviews based on game id
   */
  getAllByGameId(game_id: number) {
    return new Promise<Review[]>((resolve, reject) => {
      pool.query('SELECT * FROM reviews WHERE game_id = ?', [game_id], (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  /**
   * Get all reviews based on genre id
   */
  getAllByGenreId(genre_id: number) {
    return new Promise<Review[]>((resolve, reject) => {
      pool.query('SELECT * FROM reviews WHERE genre_id = ?', [genre_id], (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  /**
   * Get all reviews based on genre id
   */
  getAllByPlatformId(platform_id: number) {
    return new Promise<Review[]>((resolve, reject) => {
      pool.query('SELECT * FROM reviews WHERE platform_id = ?', [platform_id], (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  /**
   * Get single complete review based on ID
   */
  get(review_id: number) {
    return new Promise<Review | undefined>((resolve, reject) => {
      pool.query(
        `SELECT r.*, (SELECT COUNT(*) FROM mapping_relevant WHERE review_id = r.review_id) AS likes, u.user_nickname, g.game_title FROM reviews r LEFT JOIN games g ON r.game_id = g.game_id LEFT JOIN users u ON r.user_id = u.user_id WHERE r.review_id = ?`,
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

  isRelevant(review_id: number, user_id: number) {
    return new Promise<boolean>((resolve, reject) => {
      pool.query(
        `SELECT COUNT(1) AS relevant_count FROM mapping_relevant WHERE review_id=? AND user_id=? `,
        [review_id, user_id],
        (error, results) => {
          if (error) return reject(error);
          console.log(results[0]);
          resolve(results && results.length > 0 && results[0].relevant_count > 0);
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
        WHERE published = 1 ORDER BY likes DESC;`,
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
        `SELECT ge.genre_id, ge.genre_name, g.game_title, r.review_id, r.review_title, r.rating, r.text, COUNT(mr.relevant_id) AS likes
        FROM reviews r
        INNER JOIN games g ON g.game_id = r.game_id
        LEFT OUTER JOIN mapping_relevant mr on r.review_id = mr.review_id
        INNER JOIN mapping_genre mg ON mg.game_id = g.game_id
        INNER JOIN genres ge ON mg.genre_id = ge.genre_id
        WHERE ge.genre_id = ? AND PUBLISHED = 1
        GROUP BY ge.genre_id, ge.genre_name, g.game_title, r.review_id, r.review_title, r.rating, r.text
        ORDER BY likes DESC `,
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
        `SELECT p.platform_id, p.platform_name, g.game_title, r.review_id, r.review_title, r.text, r.rating, (SELECT COUNT(*) FROM mapping_relevant WHERE review_id = r.review_id) AS likes
        FROM reviews r
        INNER JOIN games g ON g.game_id = r.game_id
        INNER JOIN mapping_platform mp ON mp.game_id = g.game_id
        INNER JOIN platforms p ON mp.platform_id = p.platform_id
        WHERE published=1 AND p.platform_id = ?
        ORDER BY likes DESC`,
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

  getTopTen() {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        `SELECT * FROM reviews
		  INNER JOIN (SELECT review_id, COUNT(*) AS likes FROM mapping_relevant
					  GROUP BY review_id) derived USING(review_id)
		  LEFT JOIN (SELECT game_title, game_id FROM games) g USING (game_id)
		  WHERE published = 1 ORDER BY likes DESC LIMIT 10`,
        (error, results) => {
          if (error) return reject(error);

          resolve(results);
        }
      );
    });
  }

  getLastTen() {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        `SELECT * FROM reviews
		  INNER JOIN (SELECT review_id, COUNT(*) AS likes FROM mapping_relevant
					  GROUP BY review_id) derived USING(review_id)
		  LEFT JOIN (SELECT game_title, game_id FROM games) g USING (game_id)
		  WHERE published = 1 ORDER BY review_id DESC LIMIT 10`,
        (error, results) => {
          if (error) return reject(error);

          resolve(results);
        }
      );
    });
  }
}

export const reviewService = new ReviewService();
