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
  FormContainer,
  FormGroup,
  Linebreak,
} from './widgets';
import { NavLink } from 'react-router-dom';
import { Review, reviewService } from './services/review-service';

import { createHashHistory } from 'history';
import { Game, gameService } from './services/game-services';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class PublishedReviews extends Component {
  reviews: Review[] = [];
  games: Game[] = [];
  // game: Game = {
  //   game_id: 0,
  //   game_title: '',
  //   genre: [],
  //   genre_id: 0,
  //   platform: [],
  //   game_description: '',
  // };

  render() {
    return (
      <>
        <Card title=" Alle publiserte anmeldelser">
          <Row>
            <Column>
              <b>Spill</b>
            </Column>
            <Column>
              <b>Anmeldelse</b>
            </Column>
            <Column>
              <b>Terningkast</b>
            </Column>
          </Row>
          {this.reviews.map((review, index) => (
            <Row key={review.review_id}>
              <Column>{review.game_title}</Column>

              <Column>
                <NavLink to={'/publishedReviews/' + review.review_id}>
                  {review.review_title}
                </NavLink>
              </Column>
              <Column>{review.rating}</Column>
            </Row>
          ))}
        </Card>
      </>
    );
  }

  mounted() {
    reviewService
      .getPublisedReviews()
      .then((reviews) => (this.reviews = reviews))
      .catch((error) => Alert.danger('Error getting reviews: ' + error.message));
  }
}

export class PlatformReviews extends Component {
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
    game_id: '',
    game_title: '',
    review_title: '',
    text: '',
    user_id: 0,
    rating: 0,
    published: false,
    genre_id: 0,
    relevant: false,
    platform_id: 0,
  };

  platformCall(id: number) {
    reviewService
      .getPlatform(id)
      .then((data) => {
        console.log(data);
        this.reviews = data;
      })
      .catch((error) => Alert.danger('Error retrieving reviews: ' + error.message));
  }

  render() {
    return (
      <>
        <Row>
          <h5>Finn anmeldelser basert på plattform</h5>
          <Column width={1}>
            <Card title="Play Station 4">
              <Button.Success onClick={() => this.platformCall(145)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Play Station 5">
              <Button.Success onClick={() => this.platformCall(146)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Indie">
              <Button.Success onClick={() => this.platformCall(3)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Strategi">
              <Button.Success onClick={() => this.platformCall(4)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Kort og brett">
              <Button.Success onClick={() => this.platformCall(5)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Pek og klikk">
              <Button.Success onClick={() => this.platformCall(6)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Kampspill">
              <Button.Success onClick={() => this.platformCall(7)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Skyting">
              <Button.Success onClick={() => this.platformCall(8)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Musikk">
              <Button.Success onClick={() => this.platformCall(9)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Hjernetrim">
              <Button.Success onClick={() => this.platformCall(10)}>Open</Button.Success>
            </Card>
          </Column>
        </Row>
        <Row>
          <Column>Spill</Column>
          <Column>Anmeldelse</Column>
          <Column>Terningkast</Column>
        </Row>
        {this.reviews.map((review, index) => (
          <Row key={index}>
            <Column>{review.game_title}</Column>
            <Column>
              <NavLink to={'/publishedReviews/' + review.review_id}>{review.review_title}</NavLink>
            </Column>
            <Column>{review.rating}</Column>
          </Row>
        ))}
      </>
    );
  }

  mounted() {
    reviewService
      .getPublisedReviews()
      .then((reviews) => (this.reviews = reviews))
      .catch((error) => Alert.danger('Error getting reviews: ' + error.message));
  }
}
export class GenreReviews extends Component {
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
    game_id: '',
    game_title: '',
    review_title: '',
    text: '',
    user_id: 0,
    rating: 0,
    published: false,
    genre_id: 0,
    relevant: false,
  };

  genreCall(id: number) {
    reviewService
      .getGenre(id)
      .then((data) => {
        console.log(data);
        this.reviews = data;
      })
      .catch((error) => Alert.danger('Error retrieving reviews: ' + error.message));
  }

  render() {
    return (
      <>
        <Row>
          <h5>Finn anmeldelser basert på sjanger</h5>
          <Column width={1}>
            <Card title="Eventyr">
              <Button.Success onClick={() => this.genreCall(1)}>Eventyr</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Plattform">
              <Button.Success onClick={() => this.genreCall(2)}>Plattform</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Indie">
              <Button.Success onClick={() => this.genreCall(3)}>Indie</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Strategi">
              <Button.Success onClick={() => this.genreCall(4)}>Strategi</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Kort og brett">
              <Button.Success onClick={() => this.genreCall(5)}>Platform</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Pek og klikk">
              <Button.Success onClick={() => this.genreCall(6)}>Pek og klikk</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Kampspill">
              <Button.Success onClick={() => this.genreCall(7)}>Kampspill</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Skyting">
              <Button.Success onClick={() => this.genreCall(8)}>Skyting</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Musikk">
              <Button.Success onClick={() => this.genreCall(9)}>Musikk</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Hjernetrim">
              <Button.Success onClick={() => this.genreCall(10)}>Skyting</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Bilspill">
              <Button.Success onClick={() => this.genreCall(11)}>Bilspill</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Sanntidsstrategi">
              <Button.Success onClick={() => this.genreCall(12)}>RTS</Button.Success>
            </Card>
          </Column>
        </Row>
        <Row>
          <Column width={1}>
            <Card title="Rollespill">
              <Button.Success onClick={() => this.genreCall(13)}>Rollespill</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Simulator">
              <Button.Success onClick={() => this.genreCall(14)}>Simulator</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Sport">
              <Button.Success onClick={() => this.genreCall(15)}>Sport</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Turbasert strategi">
              <Button.Success onClick={() => this.genreCall(16)}>Turbasert strategi</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Taktisk">
              <Button.Success onClick={() => this.genreCall(17)}>Taktisk</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Spørrespill">
              <Button.Success onClick={() => this.genreCall(18)}>Spørrespill</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Nærkamp">
              <Button.Success onClick={() => this.genreCall(19)}>Nærkamp</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Flipperspill">
              <Button.Success onClick={() => this.genreCall(20)}>Flipperspill</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Arkadespill">
              <Button.Success onClick={() => this.genreCall(21)}>Arkadespill</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Visual Novel">
              <Button.Success onClick={() => this.genreCall(22)}>Visual Novel</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="MOBA">
              <Button.Success onClick={() => this.genreCall(23)}>MOBA</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Sandkassespill">
              <Button.Success onClick={() => this.genreCall(24)}>Sandkassespill</Button.Success>
            </Card>
          </Column>
        </Row>
        <Row>
          <Column>Spill</Column>
          <Column>Anmeldelse</Column>
          <Column>Terningkast</Column>
        </Row>
        {this.reviews.map((review, index) => (
          <Row key={index}>
            <Column>{review.game_title}</Column>
            <Column>
              <NavLink to={'/publishedReviews/' + review.review_id}>{review.review_title}</NavLink>
            </Column>
            <Column>{review.rating}</Column>
          </Row>
        ))}
      </>
    );
  }

  mounted() {
    reviewService
      .getPublisedReviews()
      .then((reviews) => (this.reviews = reviews))
      .catch((error) => Alert.danger('Error getting reviews: ' + error.message));
  }
}

/**
 * Renders form to create new task.
 */
export class AddReview extends Component {
  reviewTitle = '';
  gameTitle = '';
  genre = '';
  platform = '';
  text = '';
  rating = 1;
  showAlert = false;
  name = '';

  render() {
    return (
      <Container>
        <Card title="Skriv anmeldelse">
          <Row>
            <Column width={2}>Spill:</Column>
            <Column>{this.name}</Column>
          </Row>
          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>
          <FormContainer>
            <FormGroup>
              <Form.Label>Overskrift:</Form.Label>
              <Form.Input
                type="text"
                value={this.reviewTitle}
                onChange={(event) => (this.reviewTitle = event.currentTarget.value)}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>Anmeldelse:</Form.Label>
              <Form.Textarea
                value={this.text ?? ''}
                onChange={(event) => {
                  this.text = event.currentTarget.value;
                }}
                rows={10}
                cols={10}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>Terningkast:</Form.Label>
              <Form.Select
                value={this.rating}
                onChange={(event) => {
                  this.rating = Number(event.currentTarget.value);
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </Form.Select>
            </FormGroup>
          </FormContainer>
        </Card>
        <Linebreak></Linebreak>
        <Button.Success
          onClick={() => {
            reviewService
              .create(this.reviewTitle, this.text, this.rating)

              .then((id) => {
                alert('Anmeldelsen er lagret');
                history.push('/publishReview/' + id);
              })
              .catch((error) => Alert.danger('Error creating task: ' + error.message));
          }}
        >
          Lagre
        </Button.Success>
      </Container>
    );
  }
}

export class PublishReview extends Component<{ match: { params: { id: number } } }> {
  review: Review = {
    review_id: 0,
    review_title: '',
    game_title: '',
    text: '',
    rating: 0,
    published: false,
    game_id: '',
    user_id: 0,
    genre_id: 0,
    relevant: false,
  };

  render() {
    return (
      <>
        <Card title="Anmeldelse til publisering">
          <Row>
            <Column width={2}>Spill:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>
          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>

          <Row>
            <Column width={12}>
              <div>
                <b>{this.review.review_title}</b>
              </div>
            </Column>
          </Row>
          <Row>
            <Column width={12}>
              <div>{this.review.text}</div>
            </Column>
          </Row>
          <Row>
            <Column width={12}>
              <div>Terningkast: {this.review.rating}</div>
            </Column>
          </Row>
          <Row>
            <Column>
              <Button.Success
                onClick={() => history.push('/editReview/' + this.props.match.params.id)}
              >
                Rediger
              </Button.Success>
            </Column>
            <Column>
              <Button.Success
                onClick={() => {
                  reviewService.publish(Number(this.props.match.params.id)).then(() => {
                    history.push('/publishedReviews');
                  });
                }}
              >
                Publiser
              </Button.Success>
            </Column>

            <Column>
              <Button.Danger
                onClick={() => {
                  reviewService
                    .delete(
                      this.review.review_id,
                      this.review.review_title,
                      this.review.text,
                      this.review.rating
                    )
                    .then(() => {
                      history.push('/reviews');
                    })
                    .catch((error) => Alert.danger('Error deleting task: ' + error.message));
                }}
              >
                Slett
              </Button.Danger>
            </Column>
          </Row>
        </Card>
      </>
    );
  }

  mounted() {
    reviewService
      .get(this.props.match.params.id)
      .then((review) => (this.review = review))
      .catch((error) => Alert.danger('Error getting review: ' + error.message));
  }
}

export class CompleteReview extends Component<{ match: { params: { id: number } } }> {
  review: Review = {
    review_id: 0,
    review_title: '',
    game_title: '',
    text: '',
    rating: 0,
    published: false,
    game_id: '',
    user_id: 0,
    genre_id: 0,
    relevant: false,
  };
  counter: number = 0;
  render() {
    return (
      <>
        <Card title="Anmeldelse">
          <Row>
            <Column width={2}>Spill:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>
          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>

          <Row>
            <Column width={12}>
              <div>
                <b>{this.review.review_title}</b>
              </div>
            </Column>
          </Row>
          <Row>
            <Column width={12}>
              <div>{this.review.text}</div>
            </Column>
          </Row>
          <Row>
            <Column width={12}>
              <div>Terningkast: {this.review.rating}</div>
            </Column>
          </Row>
          <Row>
            <Column></Column>
            <Column>
              <Button.Success
                onClick={() => {
                  this.review.relevant = true;
                  this.counter == 0 ? 1 : 0;
                }}
              >
                Like
              </Button.Success>
            </Column>
            <Column>{this.counter}</Column>
          </Row>
        </Card>
      </>
    );
  }

  mounted() {
    reviewService
      .get(this.props.match.params.id)
      .then((review) => (this.review = review))
      .catch((error) => Alert.danger('Error getting review: ' + error.message));
  }
}

// /**
//  * Renders form to edit an existing review
//  */
export class EditReview extends Component<{ match: { params: { id: number } } }> {
  review: Review = {
    review_id: 0,
    review_title: '',
    text: '',
    rating: 0,
    game_id: '',
    user_id: 0,
    published: false,
    game_title: '',
    genre_id: 0,
    relevant: false,
  };

  render() {
    return (
      <>
        <Card title="Edit review">
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.review.review_title}
                onChange={(event) => (this.review.review_title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Text:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                value={this.review.text ?? ''}
                onChange={(event) => {
                  this.review.text = event.currentTarget.value;
                }}
                rows={10}
              />
            </Column>
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success
              onClick={() => {
                alert('review saved');

                reviewService
                  .edit(
                    this.review.review_id,
                    this.review.review_title,
                    this.review.text,
                    this.review.rating
                  )
                  .then(() => history.push('/publishReview/' + this.review.review_id))
                  .catch((error) => Alert.danger('Error editing review: ' + error.message));
              }}
            >
              Save
            </Button.Success>
          </Column>
        </Row>
      </>
    );
  }

  mounted() {
    reviewService
      .get(this.props.match.params.id)
      .then((review) => (this.review = review))
      .catch((error) => Alert.danger('Error getting review: ' + error.message));
  }
}
