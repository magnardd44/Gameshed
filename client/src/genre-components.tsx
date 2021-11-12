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
} from './widgets';
import { NavLink } from 'react-router-dom';
import { gameService, Game } from './services/game-services';
import { Genre } from './services/genre-service';
import { createHashHistory } from 'history';
import axios from 'axios';
import { genreService } from './services/genre-service';
import { Review, reviewService } from './services/review-service';

const history = createHashHistory();

export class Category extends Component {
  genres: Genre[] = [];
  reviews: Review[] = [];
  games: Game[] = [];
  game: Game = {
    game_id: 0,
    game_title: '',
    genre: 0,
    genre_id: 0,
    platform: 0,
    game_description: '',
    igdb_id: 0,
    genres: [],
    platforms: [],
  };
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
  };
  state = { isHidden: false };
  genreCall(id: number) {
    reviewService
      .getGenre(id)
      .then((data) => {
        console.log(data);
        this.reviews = data;
      })
      .catch((error) => Alert.danger('Error retrieving reviews: ' + error.message));
    this.setState({ isHidden: false });
  }
  render() {
    return (
      <Container>
        Velg kategori/sjanger:
        <Row>
          <ColumnCentre width={12} smwidth={4} mdwidth={2}>
            {this.genres.map((genre) => (
              <CategoryCard
                key={genre.genre_id}
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
                <Button.Success onClick={() => this.genreCall(genre.genre_id)}>
                  {genre.genre_name}
                </Button.Success>
              </CategoryCard>
            ))}
          </ColumnCentre>
          <ColumnCentre>
            {this.state.isHidden ? null : (
              <div className="sticky-top">
                {this.reviews.map((review, index) => (
                  <Row key={index}>
                    <Column>{review.game_title}</Column>
                    <Column>
                      <NavLink to={'/publishedReviews/' + review.review_id}>
                        {review.review_title}
                      </NavLink>
                    </Column>
                    <Column>{review.rating}</Column>
                  </Row>
                ))}
              </div>
            )}
          </ColumnCentre>
        </Row>
      </Container>
    );
  }
  mounted() {
    genreService
      .getAll()
      .then((genres) => {
        this.genres = genres;
      })
      .catch((error) => Alert.danger('Error getting reviews: ' + error.message));
  }
}
