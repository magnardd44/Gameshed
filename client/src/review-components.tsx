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
import { Link, NavLink, useLocation } from 'react-router-dom';
import { reviewService } from './services/review-service';

import { createHashHistory } from 'history';
import { Game, Game2, gameService, gameService2 } from './services/game-services';
import { gameService3 } from './services/game-services';
import axios from 'axios';
import { genreService } from './services/genre-service';
import { platformService } from './services/platform-service';

import { FacebookShareButton, FacebookIcon, EmailShareButton, EmailIcon } from 'react-share';
import userService from './services/user-service';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

//Renders an overvew of all published reviews
export class PublishedReviews extends Component {
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
            <Column>
              <b>Relevant</b>
            </Column>
          </Row>
          {reviewService.reviews.map((review, index) => (
            <Row key={review.review_id}>
              <Column>{review.game_title}</Column>

              <Column>
                <NavLink to={'/publishedReviews/' + review.review_id}>
                  {review.review_title}
                </NavLink>
              </Column>
              <Column>{review.rating}</Column>
              <Column>{review.likes}</Column>
            </Row>
          ))}
        </Card>
      </>
    );
  }

  mounted() {
    console.log(reviewService);
    reviewService
      .getPublishedReviews()
      .then((reviews) => {
        reviewService.reviews = reviews;
        console.log(reviews);
      })
      .catch((error) => Alert.danger('Error getting reviews: ' + error.message));
  }
}

//Renders overview of published reviews based on genre
export class PlatformReviews extends Component {
  state = { isHidden: true };

  platformCall(id: number) {
    reviewService
      .getPlatform(id)
      .then((data) => {
        this.setState({ isHidden: false });
        console.log(data);
        reviewService.reviews = data;
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
            <Card title="Nintendo Switch">
              <Button.Success onClick={() => this.platformCall(119)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="XBox One">
              <Button.Success onClick={() => this.platformCall(186)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="XBox 360">
              <Button.Success onClick={() => this.platformCall(185)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="PC - Microsoft">
              <Button.Success onClick={() => this.platformCall(126)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Gameboy">
              <Button.Success onClick={() => this.platformCall(89)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Mac">
              <Button.Success onClick={() => this.platformCall(100)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="IOS">
              <Button.Success onClick={() => this.platformCall(98)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Nintendo DS">
              <Button.Success onClick={() => this.platformCall(114)}>Open</Button.Success>
            </Card>
          </Column>
          <Column width={1}>
            <Card title="Andre">
              <Button.Success onClick={() => this.platformCall(101 + 102)}>Open</Button.Success>
            </Card>
          </Column>
        </Row>
        {this.state.isHidden ? null : (
          <>
            <Row>
              <Column>Spill</Column>
              <Column>Anmeldelse</Column>
              <Column>Terningkast</Column>
              <Column>Relevant</Column>
            </Row>
            {reviewService.reviews.map((review, index) => (
              <Row key={index}>
                <Column>{review.game_title}</Column>
                <Column>
                  <NavLink to={'/publishedReviews/' + review.review_id}>
                    {review.review_title}
                  </NavLink>
                </Column>
                <Column>{review.rating}</Column>
                <Column>{review.likes}</Column>
              </Row>
            ))}
          </>
        )}
      </>
    );
  }

  mounted() {
    reviewService
      .getPublishedReviews()
      .then((reviews) => (reviewService.reviews = reviews))
      .catch((error) => Alert.danger('Error getting reviews: ' + error.message));
  }
}

//Renders overview of published reviews based on genre
export class GenreReviews extends Component {
  state = { isHidden: true };
  genreCall(id: number) {
    reviewService
      .getGenre(id)
      .then((data) => {
        console.log(data);
        reviewService.reviews = data;
      })
      .catch((error) => Alert.danger('Error retrieving reviews: ' + error.message));
    this.setState({ isHidden: false });
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
        {this.state.isHidden ? null : (
          <>
            <Row>
              <Column>Spill</Column>
              <Column>Anmeldelse</Column>
              <Column>Terningkast</Column>
              <Column>Relevant</Column>
            </Row>
            {reviewService.reviews.map((review, index) => (
              <Row key={index}>
                <Column>{review.game_title}</Column>
                <Column>
                  <NavLink to={'/publishedReviews/' + review.review_id}>
                    {review.review_title}
                  </NavLink>
                </Column>
                <Column>{review.rating}</Column>
                <Column>{review.likes}</Column>
              </Row>
            ))}
          </>
        )}
      </>
    );
  }

  mounted() {
    reviewService
      .getPublishedReviews()
      .then((reviews) => (reviewService.reviews = reviews))
      .catch((error) => Alert.danger('Error getting reviews: ' + error.message));
  }
}

/**
 * Renders form to create new task.
 */
export class AddReview extends Component<{
  match: { params: { igdb_id: number; db_id: number } };
}> {
  render() {
    return (
      <Container>
        <Card title="Skriv anmeldelse">
          <Row>
            <Column width={2}>Spill:</Column>
            <Column>{gameService2.game.game_title}</Column>
          </Row>
          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>{gameService2.game.genre.join(', ')}</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>{gameService2.game.platform.join(', ')}</Column>
          </Row>
          <FormContainer>
            <FormGroup>
              <Form.Label>Overskrift:</Form.Label>
              <Form.Input
                placeholder="Skriv inn overskriften her:"
                type="text"
                value={reviewService.review.review_title}
                onChange={(event) =>
                  (reviewService.review.review_title = event.currentTarget.value)
                }
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>Anmeldelse:</Form.Label>
              <Form.Textarea
                placeholder="Skriv inn anmeldelsen her:"
                value={reviewService.review.text ?? ''}
                onChange={(event) => {
                  reviewService.review.text = event.currentTarget.value;
                }}
                rows={10}
                cols={10}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>Terningkast:</Form.Label>
              <Form.Select
                placeholder={<div>Velg terningkast:</div>}
                value={reviewService.review.rating}
                onChange={(event) => {
                  reviewService.review.rating = Number(event.currentTarget.value);
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((num, i) => {
                  return (
                    <option key={i} value={num}>
                      {num}
                    </option>
                  );
                })}
              </Form.Select>
            </FormGroup>
          </FormContainer>
        </Card>
        <Linebreak />
        <Alert />
        <Column>
          <Button.Danger
            onClick={() => {
              history.push('/games/' + gameService2.game.game_id + '/' + gameService2.game.igdb);
            }}
          >
            Tilbake
          </Button.Danger>
        </Column>
        <Column right>
          <Button.Success
            onClick={async () => {
              if (
                reviewService.review.review_title == '' ||
                reviewService.review.text == '' ||
                reviewService.review.rating == 0
              ) {
                Alert.danger('Alle feltene må være fylt ut!');
              } else {
                if (this.props.match.params.db_id == 0) {
                  gameService2.game.genre.map((genre) => {
                    genreService
                      .getId(genre)
                      .then((res) => {
                        gameService.game.genres.push(res.genre_id);
                      })
                      .catch((err) => {
                        Alert.danger('Det oppsto en feil ved hentingen av genre_id: ' + err);
                      });
                  });
                  gameService2.game.platform.map((platform) => {
                    platformService
                      .getId(platform)
                      .then((res) => {
                        gameService.game.platforms.push(res.platform_id);
                      })
                      .catch((err) => {
                        Alert.danger('Det oppsto en feil ved hentingen av platform_id: ' + err);
                      });
                  });

                  gameService
                    .create(
                      gameService2.game.igdb_id,
                      gameService2.game.game_title,
                      gameService2.game.game_description
                    )
                    .then((res) => {
                      gameService.game.genres.map((genre) => {
                        genreService.updateGenreMap(res, genre).catch((err) => {
                          Alert.danger('Det oppsto en feil ved oppdateringen av genre_map: ' + err);
                        });
                      });

                      gameService.game.platforms.map((platform) => {
                        platformService.updatePlatformMap(platform, res).catch((err) => {
                          Alert.danger(
                            'Det oppsto en feil ved oppdateringen av platform_map: ' + err
                          );
                        });
                      });

                      reviewService
                        .create(
                          res,
                          reviewService.review.review_title,
                          reviewService.review.text,
                          reviewService.review.rating
                        )
                        .then((res) => {
                          Alert.success('Anmeldelsen er lagret!');
                          history.push('/publishReview/' + res);
                        });
                    });
                } else {
                  reviewService
                    .create(
                      this.props.match.params.db_id,
                      reviewService.review.review_title,
                      reviewService.review.text,
                      reviewService.review.rating
                    )
                    .then((res) => {
                      Alert.success('Anmeldelsen er lagret!');
                      history.push('/publishReview/' + res);
                    });
                }
              }
            }}
          >
            Lagre
          </Button.Success>
        </Column>
      </Container>
    );
  }
  mounted() {
    reviewService.review.review_id = 0;
    reviewService.review.review_title = '';
    reviewService.review.text = '';
    reviewService.review.rating = 0;
    gameService.game.igdb_id = this.props.match.params.igdb_id;
    if (gameService.game.igdb_id > 0) {
      gameService2
        .get_igdb(gameService.game.igdb_id)
        .then((result) => {
          gameService2.game = result;
          console.log(gameService2.game);
        })
        .catch((err) => {
          console.log('Err: ' + err);
        });
    }
  }
}

//Renders a draft review with option to edit, delete or publish
export class PublishReview extends Component<{ match: { params: { id: number } } }> {
  render() {
    return (
      <Container>
        <Card title="Anmeldelse til publisering">
          <Row>
            <Column width={2}>Spill:</Column>
            <Column>{gameService2.game.game_title}</Column>
          </Row>

          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>{gameService2.game.genre.join(', ')}</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>{gameService2.game.platform.join(', ')}</Column>
          </Row>
          <Linebreak />
          <Card title="">
            <Row>
              <Column width={12}>
                <div>
                  <b>Tittel: </b>
                  {reviewService.review.review_title}
                </div>
              </Column>
            </Row>
            <Linebreak />
            <Row>
              <Column width={12}>
                <div>
                  <b>Innhold: </b>
                  {reviewService.review.text}
                </div>
              </Column>
            </Row>
            <Linebreak />
            <Row>
              <Column width={12}>
                <div>
                  <b>Terningkast:</b> {reviewService.review.rating}
                </div>
              </Column>
            </Row>
          </Card>
          <Linebreak />
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
                    Alert.success('Anmeldelsen er publisert!');
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
                    .delete(reviewService.review.review_id)
                    .then(() => {
                      history.push(
                        `/games/${gameService.game.game_id}/${gameService.game.igdb_id}`
                      );
                      Alert.success('Review deleted');
                    })
                    .catch((error) => Alert.danger('Error deleting task: ' + error.message));
                }}
              >
                Slett
              </Button.Danger>
            </Column>
          </Row>
        </Card>
      </Container>
    );
  }

  mounted() {
    reviewService
      .getDraft(this.props.match.params.id)
      .then((review) => {
        reviewService.review = review;
        if (review.game_id) {
          gameService2.get(review.game_id).then((game) => {
            gameService2.game = game;
            console.log(gameService.game);
          });
        }
      })

      .catch((error) => Alert.danger('Error getting review: ' + error.message));
  }
}

// /**
//  * Renders form to edit an existing review
//  */
export class EditReview extends Component<{ match: { params: { id: number } } }> {
  render() {
    return (
      <Container>
        <Card title="Edit review">
          <Row>
            <Column width={2}>Spill:</Column>
            <Column>{gameService2.game.game_title}</Column>
          </Row>

          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>{gameService2.game.genre.join(', ')}</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>{gameService2.game.platform.join(', ')}</Column>
          </Row>
          <Linebreak />
          <FormContainer>
            <FormGroup>
              <Form.Label>Title:</Form.Label>

              <Form.Input
                type="text"
                value={reviewService.review.review_title}
                onChange={(event) =>
                  (reviewService.review.review_title = event.currentTarget.value)
                }
              />
            </FormGroup>

            <FormGroup>
              <Form.Label>Text:</Form.Label>

              <Form.Textarea
                value={reviewService.review.text ?? ''}
                onChange={(event) => {
                  reviewService.review.text = event.currentTarget.value;
                }}
                rows={10}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>Terningkast:</Form.Label>
              <Form.Select
                placeholder={<div>Velg terningkast:</div>}
                value={reviewService.review.rating}
                onChange={(event) => {
                  reviewService.review.rating = Number(event.currentTarget.value);
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((num, i) => {
                  return (
                    <option key={i} value={num}>
                      {num}
                    </option>
                  );
                })}
              </Form.Select>
            </FormGroup>
          </FormContainer>
        </Card>
        <Row>
          <Column>
            <Linebreak />
            <Button.Success
              onClick={() => {
                alert('review saved');

                reviewService
                  .edit(
                    reviewService.review.review_id,
                    reviewService.review.review_title,
                    reviewService.review.text,
                    reviewService.review.rating
                  )
                  .then(() => history.push('/publishReview/' + reviewService.review.review_id))
                  .catch((error) => Alert.danger('Error editing review: ' + error.message));
              }}
            >
              Save
            </Button.Success>
          </Column>
        </Row>
      </Container>
    );
  }

  mounted() {
    reviewService
      .getDraft(this.props.match.params.id)
      .then((review) => {
        reviewService.review = review;
        if (review.game_id) {
          gameService.get(review.game_id).then((game) => {
            gameService.game = game;
            console.log(gameService.game);
          });
          gameService2.get(review.game_id).then((game) => {
            gameService2.game = game;
          });
        }
      })
      .catch((error) => Alert.danger('Error getting review: ' + error.message));
  }
}

//Renders Single complete review with option to "like"
export class CompleteReview extends Component<{ match: { params: { id: number } } }> {
  counter: number = 0;
  render() {
    const shareButtonProps = {
      url: 'https://localhost:3000/#/publishedReviews/' + reviewService.review.review_id,
      network: 'Facebook',
      text: 'Tror du vil like denne anmeldelsen',
      longtext:
        'Social sharing buttons for React. Use one of the build-in themes or create a custom one from the scratch.',
    };

    return (
      <>
        <Card title="Anmeldelse">
          <Row>
            <Column width={2}>Spill:</Column>
            <Column>{gameService3.current.game_title}</Column>
          </Row>
          <Row>
            <Column width={2}>Sjanger: </Column>
            <Column>
              {gameService3.current.genre?.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
            </Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>
              {gameService3.current.platform?.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
            </Column>
          </Row>
          <Row>
            <Column>
              <ThumbNail
                img={
                  gameService3.current.igdb?.cover_url ? gameService3.current.igdb.cover_url : ''
                }
              ></ThumbNail>
            </Column>
          </Row>
          <Linebreak />
          <Row>
            <Column width={12}>
              <div>
                <b>{reviewService.review.review_title}</b>
              </div>
            </Column>
          </Row>
          <Linebreak />
          <Row>
            <Column width={12}>
              <div>{reviewService.review.text}</div>
            </Column>
          </Row>
          <Linebreak />
          <Row>
            <Column width={12}>
              <div>Terningkast: {reviewService.review.rating}</div>
            </Column>
          </Row>
          <Linebreak />
          <Row>
            <Column width={1}>
              <Button.Success
                onClick={() => {
                  this.counter = this.counter == 0 ? 1 : 0;
                  reviewService.like(
                    reviewService.review.review_id,
                    reviewService.review.user_id,
                    this.counter
                  );
                }}
              >
                Like
              </Button.Success>
            </Column>
            <Column width={1}>{this.counter}</Column>
            <Column></Column>
            <Column width={2}>
              <div> Del denne anmeldelsen:</div>
            </Column>
            <Column width={1}>
              <FacebookShareButton {...shareButtonProps}>
                <FacebookIcon size="40" round />
              </FacebookShareButton>
            </Column>
            <Column width={1}>
              <EmailShareButton
                {...shareButtonProps}
                subject="Tror du vil like denne spillanmeldelsen!"
              >
                <EmailIcon size="40" round />
              </EmailShareButton>
            </Column>
          </Row>
        </Card>
      </>
    );
  }

  mounted() {
    reviewService
      .get(this.props.match.params.id)
      .then((review) => {
        reviewService.review = review;
        gameService3.set(reviewService.review.game_id, 0);
      })
      .catch((error) => Alert.danger('Error getting review: ' + error.message));
  }
}

//Renders a draft review with option to edit, delete or publish
export class SavedDrafts extends Component<{ match: { params: { id: number } } }> {
  render() {
    if (userService.token) {
      if (reviewService.drafts.length > 0) {
        this.mounted();
        return (
          <Container>
            {reviewService.drafts.map((draft, i) => {
              gameService.get(draft.game_id).then((res) => {
                gameService.game = res;
              });
              return (
                <Card title="Mine utkast:" key={i}>
                  <Card title={`Utkast nr: ${(i += 1)}`} key={i}>
                    <Row key={i}>
                      <Column>Spillet anmeldelsen hører til:</Column>
                      <Column>
                        <b>{gameService.game.game_title}</b>
                      </Column>
                    </Row>
                    <Linebreak />
                    <Row key={draft.review_title}>
                      <Column>Tittel:</Column>
                      <Column>
                        <b>{draft.review_title}</b>
                      </Column>
                    </Row>
                    <Linebreak />
                    <Row key={draft.game_id}>
                      <Column>Innhold:</Column>
                      <Column>
                        <b>{draft.text}</b>
                      </Column>
                    </Row>
                    <Linebreak />
                    <Row key={draft.genre_id}>
                      <Column>Terningkast:</Column>
                      <Column>
                        <b>{draft.rating}</b>
                      </Column>
                    </Row>
                    <Linebreak />
                    <Row key={draft.user_id}>
                      <Column>
                        <Button.Success
                          onClick={() => {
                            reviewService
                              .publish(draft.review_id)
                              .then(() => {
                                reviewService.drafts.splice(i, 1);
                                this.mounted();
                                Alert.success('Review published!');
                              })
                              .catch((error) =>
                                Alert.danger('Error editing review: ' + error.message)
                              );
                          }}
                        >
                          Publiser
                        </Button.Success>
                      </Column>
                      <Column>
                        <Button.Light
                          onClick={() => {
                            history.push('/editReview/' + draft.review_id);
                          }}
                        >
                          Rediger
                        </Button.Light>
                      </Column>
                      <Column>
                        <Button.Danger
                          onClick={() => {
                            reviewService
                              .delete(draft.review_id)
                              .then(() => {
                                reviewService.drafts.splice(i, 1);
                                this.mounted();
                                Alert.success('Review deleted');
                              })
                              .catch((error) =>
                                Alert.danger('Error deleting task: ' + error.message)
                              );
                          }}
                        >
                          Slett ukastet
                        </Button.Danger>
                      </Column>
                    </Row>
                  </Card>
                </Card>
              );
            })}
          </Container>
        );
      } else {
        return (
          <Container>
            Du har ingen utkast, finn et spill du kan anmelde <Link to="/search"> her:</Link>
          </Container>
        );
      }
    } else {
      return <Container>Du er ikke logget inn. Logg inn for å se dine utkast.</Container>;
    }
  }
  mounted() {
    if (userService.token) {
      reviewService.getDrafts(userService.token?.id).then((res) => {
        reviewService.drafts = res;
      });
    }
  }
}
