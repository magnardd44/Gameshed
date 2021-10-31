import pool from './mysql-pool';

export type Review = {
  id: number;
  title: string;
  text: boolean;
  rating: number;
};

class ReviewService {
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
      pool.query(
        'SELECT review_id as id, review_title as title, text, rating FROM reviews WHERE review_id = ?',
        [id],
        (error, results) => {
          if (error) return reject(error);

          resolve(results[0]);
        }
      );
    });
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<Review[]>((resolve, reject) => {
      pool.query(
        'SELECT review_id as id, review_title as title, text, rating FROM reviews',
        (error, results) => {
          if (error) return reject(error);

          resolve(results);
        }
      );
    });
  }

  /**
   * Delete task with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Reviews WHERE id = ?', [id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }
}

const reviewService = new ReviewService();
export default reviewService;
