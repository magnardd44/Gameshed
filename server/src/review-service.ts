import pool from './mysql-pool';

export type Review = {
  review_id: number;
  game_id: string;
  review_title: string;
  text: string;
  user_id: number;
  rating: number;
  published: boolean;
};

class ReviewService {
  review: Review = {
    review_id: 0,
    game_id: '',
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
        'INSERT INTO reviews SET review_title=?, text=?, rating=?, published=0',
        [review_title, text, rating],
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

  /**
   * Get published reviews
   */
  getPublished() {
    return new Promise<Review[]>((resolve, reject) => {
      pool.query('SELECT * FROM reviews WHERE published =1', (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
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
