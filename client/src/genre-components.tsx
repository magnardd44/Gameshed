import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
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
  FormContainer,
  FormGroup,
  CategoryCard,
  ReviewCard,
} from './widgets';
import { NavLink } from 'react-router-dom';
import { Genre } from './services/genre-service';
import { createHashHistory } from 'history';
import axios from 'axios';
import { genreService } from './services/genre-service';
import { Review, reviewService } from './services/review-service';
import { RelatedReviews } from './related-reviews';

export const history = createHashHistory();

export class Category extends Component {
  genres: Genre[] = [];
  reviews: Review[] = [];
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
    user_nickname: '',
  };
  state = { isHidden: false };

  render() {
    return (
      <>
        <Container>
          <h3 className="text-center">Her kan du søke anmeldelser etter sjanger</h3>
          <div className="text-center">
            <Button.Success
              small
              onClick={() => {
                history.push('/reviews-by-platform');
              }}
            >
              Klikk her
            </Button.Success>{' '}
            for å søke etter plattform
          </div>
          <Linebreak></Linebreak>
          <h5>Velg sjanger:</h5>

          <Row>
            <ColumnCentre width={6} smwidth={4} mdwidth={2}>
              {this.genres.map((genre, index) => (
                <CategoryCard
                  key={index}
                  img={
                    genre.genre_img
                      ? 'https://helenaagustsson.github.io/INFT2002-images/images/' +
                        genre.genre_img +
                        '.png'
                      : 'https://helenaagustsson.github.io/INFT2002-images/images/' +
                        genre.genre_name +
                        '.png'
                  }
                >
                  <Button.Success
                    onClick={() => {
                      this.genreCall(genre.genre_id);
                    }}
                  >
                    {genre.genre_name}
                  </Button.Success>
                </CategoryCard>
              ))}
            </ColumnCentre>

            <ColumnCentre>
              {this.state.isHidden ? (
                ' '
              ) : (
                <div className="sticky-top">
                  <div>Resultater:</div>
                  {reviewService.reviews.length == 0 ? (
                    <Row>
                      <Column>Ingen resultater</Column>
                    </Row>
                  ) : (
                    reviewService.reviews.map((review, index) => (
                      <Row key={index}>
                        <ReviewCard
                          title={review.review_title}
                          subtitle={review.game_title}
                          terningkast={review.rating}
                          relevanse={review.likes}
                          text={review.text}
                          user_nickname={review.user_nickname}
                        >
                          <Button.Success
                            small
                            onClick={() => {
                              history.push('/publishedReviews/' + review.review_id);
                            }}
                          >
                            Les mer
                          </Button.Success>
                        </ReviewCard>
                      </Row>
                    ))
                  )}
                </div>
              )}
            </ColumnCentre>
          </Row>
        </Container>
      </>
    );
  }
  mounted() {
    genreService
      .getAll()
      .then((genres) => {
        this.genres = genres;
      })
      .then(() => {})
      .catch((error) => {
        Alert.danger('Error getting genres: ' + error.message);
      });
  }
  genreCall(id: number) {
    reviewService.reviews = [];
    reviewService
      .getAllByGenreId(id)
      .then((res) => {
        //console.log(res);
        reviewService.reviews = res;
        reviewService.reviews.map((review, i) => {
          //console.log(review);
          reviewService.get(review.review_id).then((res) => {
            reviewService.reviews[i] = res;
          });
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.danger('Error retrieving reviews: ' + error.message);
      });
    this.setState({ isHidden: false });
  }
}
