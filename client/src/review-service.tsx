import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Review = {
  id: number;
  title: string;
  text: boolean;
  rating: number;
};

class ReviewService {
  /**
   * Get task with given id.
   */
  get(id: number) {
    return axios.get<Review>('/reviews/' + id).then((response) => response.data);
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return axios.get<Review[]>('/reviews').then((response) => response.data);
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(title: string, text: string, rating: number) {
    return axios
      .post<{ id: number }>('/reviews', { review_title: title, text: text, rating: rating })
      .then((response) => response.data.id);
  }
}

const reviewService = new ReviewService();
export default reviewService;
