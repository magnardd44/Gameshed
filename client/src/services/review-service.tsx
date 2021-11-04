import axios from 'axios';
import { sharedComponentData } from 'react-simplified';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Review = {
  review_id: number;
  game_id: string;
  game_title: string;
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
    game_title: '',
    review_title: '',
    text: '',
    user_id: 0,
    rating: 0,
    published: false,
  };
  reviews: Review[] = [];

  /**
   * Get review with given id.
   */
  get(id: number) {
    return axios.get<Review>('/reviews/' + id).then((response) => response.data);
  }

  /**
   * Get published reviews
   */
  getPublisedReviews() {
    return axios.get<Review[]>('/publishedReviews').then((response) => response.data);
  }

  /**
   * Create new review   *
   * Resolves the newly created review id.
   */
  create(title: string, text: string, rating: number) {
    return axios
      .post<{ id: number }>('/reviews', { review_title: title, text: text, rating: rating })
      .then((response) => response.data.id);
  }

  //Change review status to published
  publish(id: number) {
    return axios
      .patch<Review>('/reviews/' + id + '/publish')
      .then((response) => response.data.review_id);
  }

  //Edit review before publishing
  edit(id: number, title: string, text: string, rating: number) {
    return axios
      .patch<Review>('/reviews/' + id, { title: title, text: text, rating: rating })
      .then((response) => response.data);
  }

  //Delete review
  delete(id: number, title: string, text: string, rating: number) {
    return axios.delete<Review>('reviews/' + id).then((response) => response.data.review_id);
  }
}
export let reviewService = sharedComponentData(new ReviewService());
