import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Alert,
  Card,
  Row,
  Column,
  Form,
  Button,
  ThumbNail,
  Container,
  ColumnCentre,
  Linebreak,
  ReviewCard,
} from './widgets';
import { NavLink } from 'react-router-dom';
import { gameService, Game } from './services/game-services';
import { gameService2, Game2 } from './services/game-services';
import { Genre, genreService } from './services/genre-service';
import { Review, reviewService } from './services/review-service';
import { createHashHistory } from 'history';
import { platform } from 'os';
import { Platform, platformService } from './services/platform-service';
import axios from 'axios';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class RelatedReviews extends Component<{ game_id?: number; genre_id?: number }> {
  render() {
    return (
      <Container>
        <Row>
          <h5>Relaterte anmeldelser</h5>
          <ColumnCentre width={4}>
            <ReviewCard
              title={reviewService.relatedReview.review_title}
              subtitle={reviewService.relatedReview.game_title}
              terningkast={reviewService.relatedReview.rating}
              relevanse={reviewService.relatedReview.likes}
              text={reviewService.relatedReview.text}
            ></ReviewCard>
          </ColumnCentre>
        </Row>
        <Row>
          {reviewService.relatedReviews.map((review) => {
            <ColumnCentre width={4}>
              <ReviewCard
                title={review.review_title}
                subtitle={review.game_title}
                terningkast={review.rating}
                relevanse={review.likes}
                text={review.text}
              ></ReviewCard>
            </ColumnCentre>;
          })}
        </Row>
      </Container>
    );
  }

  mounted() {
    reviewService.getGenre(1).then((reviews) => {
      reviewService.relatedReviews = reviews;
      console.log('reviews' + reviewService.relatedReviews[0].review_title);
    });

    reviewService
      .get(1)
      .then((review) => {
        reviewService.relatedReview = review;
        console.log('reviews' + reviewService.relatedReviews[0].review_title);
      })
      .catch((error) => Alert.danger('Error retrieving reviews: ' + error.message));
  }
}
