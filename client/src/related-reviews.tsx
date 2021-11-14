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

// import Select from 'react-select';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class RelatedReviews extends Component<{ game_id?: number; genre_id?: number }> {
  reviews: Review[] = [];
  publishedreviews: Review[] = [];
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
    relevant: 0,
    platform_id: 0,
    likes: 0,
  };

  render() {
    return (
      <Container>
        <Row>
          <h5>Relaterte anmeldelser</h5>
          <ColumnCentre width={4}>
            <ReviewCard
              title={this.review.review_title}
              subtitle={this.review.game_title}
              terningkast={this.review.rating}
              relevanse={this.review.likes}
              text={this.review.text}
            ></ReviewCard>
          </ColumnCentre>
        </Row>
        <Row>
          {this.reviews.map((review) => {
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
      this.reviews = reviews;
      console.log('reviews' + this.reviews[0]);
    });

    reviewService
      .get(1)
      .then((review) => {
        this.review = review;
        console.log('reviews' + this.reviews[0]);
      })
      .catch((error) => Alert.danger('Error retrieving reviews: ' + error.message));
  }
}
