import pool from './mysql-pool';

export type Task = {
  id: number;
  review_title: string;
  
};

class TaskService {

  /**
   * Create new review having the given title.
   *
   
   */
   create(review_title: string, text: string, rating: number ) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO reviews SET review_title=?, text=?, rating=?', [review_title, text, rating], 
      (error, results) => {
        if (error) return reject(error);

        resolve(Number(results.insertId));
      });
    });
  }

  /**
   * Get task with given id.
   */
  get(id: number) {
    return new Promise<Task | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM Tasks WHERE id = ?', [id], (error, results) => {
        if (error) return reject(error);

        resolve(results[0]);
      });
    });
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<Task[]>((resolve, reject) => {
      pool.query('SELECT * FROM Tasks', (error, results) => {
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
      pool.query('DELETE FROM Tasks WHERE id = ?', [id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }
}

const taskService = new TaskService();
export default taskService;
