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
  ReviewCard,
  FullReviewCard,
} from './widgets';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { reviewService } from './services/review-service';

import { createHashHistory } from 'history';
import { gameService } from './services/game-service';
import axios from 'axios';
import { genreService } from './services/genre-service';
import { platformService } from './services/platform-service';

import { FacebookShareButton, FacebookIcon, EmailShareButton, EmailIcon } from 'react-share';
import userService from './services/user-service';

export const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

//Renders an overvew of all published reviews
export class PublishedReviews extends Component {
  render() {
    return (
      <Container>
        <Card title=" Alle publiserte anmeldelser">
          {reviewService.reviews.map((review, index) => (
            <Row key={index}>
              <ReviewCard
                key={index}
                title={review.review_title}
                subtitle={review.game_title}
                terningkast={review.rating}
                relevanse={review.likes}
                text={' '}
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
          ))}
        </Card>
      </Container>
    );
  }

  mounted() {
    //console.log(reviewService);
    reviewService.getAll().then(() => {
      reviewService
        .getPublishedReviews()
        .then((reviews) => {
          reviewService.reviews = reviews;
          //console.log(reviews);
        })
        .catch((error) => Alert.danger('Error getting reviews: ' + error.message));
    });
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
            <Column>{gameService.current.game_title}</Column>
          </Row>
          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>{gameService.current.genre.join(', ')}</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>{gameService.current.platform.join(', ')}</Column>
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
        <Column>
          <Button.Danger
            onClick={() => {
              history.push(
                '/games/' + gameService.current.game_id + '/' + gameService.current.igdb
              );
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
                  gameService
                    .create(gameService.current)

                    .then((res) => {
                      gameService.current.genre.map((genre) => {
                        genreService.updateGenreMapString(res, genre).catch((err) => {
                          Alert.danger('Det oppsto en feil ved oppdateringen av genre_map: ' + err);
                        });
                      });

                      gameService.current.platform.map((platform) => {
                        platformService.updatePlatformMapString(platform, res).catch((err) => {
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
                          history.push('/myReviews');
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
                      history.push('/myReviews');
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

    let db_id = this.props.match.params.db_id;
    let igdb_id = this.props.match.params.igdb_id;

    gameService
      .set(db_id, igdb_id)
      .then((result) => {
        //gameService2.game = result;
        //console.log(gameService.current);
      })
      .catch((err) => {
        //console.log('Err: ' + err);
      });
  }
}

//Renders a draft review with option to edit, delete or publish
export class PublishReview extends Component<{ match: { params: { id: number } } }> {
  render() {
    return (
      <Container>
        <Card title="Anmeldelse til publisering">
          <Row>
            <Column width={2}>
              <b>Spill:</b>
            </Column>
            <Column>{gameService.current.game_title}</Column>
          </Row>

          <Row>
            <Column width={2}>
              <b>Sjanger:</b>
            </Column>
            <Column>{gameService.current.genre.join(', ')}</Column>
          </Row>
          <Row>
            <Column width={2}>
              <b>Plattform:</b>
            </Column>
            <Column>{gameService.current.platform.join(', ')}</Column>
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
            {reviewService.review.published ? (
              ''
            ) : (
              <>
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
              </>
            )}

            <Column>
              <Button.Danger
                onClick={() => {
                  reviewService
                    .delete(reviewService.review.review_id)
                    .then(() => {
                      history.push(
                        `/games/${gameService.current.game_id}/${gameService.current.igdb_id}`
                      );
                      Alert.success('Review deleted');
                    })
                    .catch((error) => Alert.danger('Error deleting task: ' + error.message));
                }}
              >
                Slett
              </Button.Danger>
            </Column>
            <Column>
              <Button.Light
                onClick={() => {
                  Alert.success(
                    'Anmeldelsen er lagret som utkast, og du finner den under "Mine anmeldelser"'
                  );
                  history.push('/search');
                }}
              >
                Lagre som utkast
              </Button.Light>
            </Column>
          </Row>
        </Card>
      </Container>
    );
  }

  mounted() {
    reviewService
      .get(this.props.match.params.id)
      .then((review) => {
        reviewService.review = review;
        if (review.game_id) {
          //gameService2.get(review.game_id).then((game) => {
          gameService.set(review.game_id, 0).then(() => {
            //gameService2.game = game;
            //console.log(gameService.current);
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
            <Column>{gameService.current.game_title}</Column>
          </Row>

          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>{gameService.current.genre.join(', ')}</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>{gameService.current.platform.join(', ')}</Column>
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
                reviewService
                  .edit(
                    reviewService.review.review_id,
                    reviewService.review.review_title,
                    reviewService.review.text,
                    reviewService.review.rating
                  )
                  .then(() => {
                    history.push('/myReviews');
                    Alert.info('Endringene er lagret!');
                  })
                  .catch((error) => Alert.danger('Error editing review: ' + error.message));
              }}
            >
              Lagre
            </Button.Success>
          </Column>
        </Row>
      </Container>
    );
  }

  mounted() {
    reviewService
      .get(this.props.match.params.id)
      .then((review) => {
        reviewService.review = review;
        if (review.game_id) {
          //gameService.get(review.game_id).then((game) => {
          gameService.set(review.game_id, 0).then(() => {
            //gameService.game = game;
            //console.log(gameService.current);
          });
          //          gameService2.get(review.game_id).then((game) => {
          //            gameService2.game = game;
          //          });
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
      <Container>
        <FullReviewCard
          title={reviewService.review.review_title}
          subtitle={gameService.current.game_title}
          text={reviewService.review.text}
          terningkast={reviewService.review.rating}
          relevanse={reviewService.review.likes}
          img={gameService.current.igdb?.cover_url ? gameService.current.igdb.cover_url : ' '}
          user={reviewService.review.user_nickname}
        >
          <Row>
            <Column width={2}>Sjanger: </Column>
            <Column>
              {gameService.current.genre?.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
            </Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>
              {gameService.current.platform?.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
            </Column>
          </Row>
          <Linebreak></Linebreak>
          <Row>
            <Column width={1}>
              <Button.Success
                onClick={() => {
                  this.counter = this.counter == 0 ? 1 : 0;

                  reviewService
                    .like(
                      reviewService.review.review_id,

                      this.counter
                    )
                    .then(() => {
                      this.setState(() => {});
                    });
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
        </FullReviewCard>
      </Container>
    );
  }

  mounted() {
    reviewService
      .get(this.props.match.params.id)
      .then((review) => {
        reviewService.review = review;
        gameService.set(reviewService.review.game_id, 0);
        reviewService.isLiked(this.props.match.params.id).then((relevant) => {
          if (relevant) {
            this.counter = 1;
          } else {
            this.counter = 0;
          }
        });
      })
      .catch((error) => Alert.danger('Error getting review: ' + error.message));
  }
}

//Renders a draft review with option to edit, delete or publish
export class MyReviews extends Component<{ match: { params: { id: number } } }> {
  render() {
    if (userService.token) {
      this.render();
      if (reviewService.reviews.length > 0) {
        return (
          <Container>
            {reviewService.reviews.map((review, i) => {
              //gameService.set(review.game_id, 0);

              return (
                <Card title={`Anmeldelse nr: ${(i += 1)}`} key={i}>
                  <Linebreak />
                  <Row>
                    <Column>Spillet anmeldelsen hører til:</Column>
                    <Column>
                      <b>{review.game_title}</b>
                    </Column>
                  </Row>
                  <Linebreak />
                  <Row key={review.review_title}>
                    <Column>Tittel:</Column>
                    <Column>
                      <b>{review.review_title}</b>
                    </Column>
                  </Row>
                  <Linebreak />
                  <Row key={review.game_id}>
                    <Column>Innhold:</Column>
                    <Column>
                      <b>
                        <i>{review.text}</i>
                      </b>
                    </Column>
                  </Row>
                  <Linebreak />
                  <Row key={review.genre_id}>
                    <Column>Terningkast:</Column>
                    <Column>
                      <b>{review.rating}</b>
                    </Column>
                  </Row>
                  <Linebreak />
                  {review.published ? (
                    <Row>
                      <Column>Status:</Column>
                      <Column>
                        <b>Publisert</b>
                      </Column>
                    </Row>
                  ) : (
                    <Row>
                      <Column>Status:</Column>
                      <Column>
                        <b>Ikke publisert</b>
                      </Column>
                    </Row>
                  )}
                  <Linebreak />
                  <Row key={review.user_id}>
                    {review.published ? (
                      <Column>
                        <Button.Success
                          onClick={() => {
                            history.push('/publishedReviews/' + review.review_id);
                          }}
                        >
                          Ta meg til anmeldelsen
                        </Button.Success>
                      </Column>
                    ) : (
                      <>
                        <Column>
                          <Button.Success
                            onClick={() => {
                              let sikkerSlett = confirm(
                                'Er du sikker på at du vil publisere denne anmeldelsen?'
                              );
                              if (sikkerSlett) {
                                reviewService
                                  .publish(review.review_id)
                                  .then(() => {
                                    reviewService.reviews.splice(i, 1);
                                    Alert.success('Anmeldelse publisert!');
                                    this.mounted();
                                    this.render();
                                  })
                                  .catch((error) =>
                                    Alert.danger(
                                      'Det oppsto en feil når anmeldelsen: ' + error.message
                                    )
                                  );
                              }
                            }}
                          >
                            Publiser
                          </Button.Success>
                        </Column>
                      </>
                    )}

                    <Column>
                      <Button.Light
                        onClick={() => {
                          history.push('/editReview/' + review.review_id);
                        }}
                      >
                        Rediger
                      </Button.Light>
                    </Column>

                    <Column>
                      <Button.Danger
                        onClick={() => {
                          let sikkerPubliser = confirm(
                            'Er du sikker på at du vil slette denne anmeldelsen?'
                          );
                          if (sikkerPubliser) {
                            reviewService
                              .delete(review.review_id)
                              .then(() => {
                                reviewService.reviews.splice(i, 1);
                                Alert.success('Anmeldelse slettet');
                                this.mounted();
                                this.render();
                              })
                              .catch((error) =>
                                Alert.danger(
                                  'Det oppsto en feil ved sletting av anmeldelse: ' + error.message
                                )
                              );
                          }
                        }}
                      >
                        Slett
                      </Button.Danger>
                    </Column>
                  </Row>
                </Card>
              );
            })}
          </Container>
        );
      } else {
        return (
          <Container>
            Du har ingen anmeldelser, finn et spill du kan anmelde <Link to="/search"> her:</Link>
          </Container>
        );
      }
    } else {
      return <Container>Du er ikke logget inn. Logg inn for å se dine anmeldelser.</Container>;
    }
  }
  mounted() {
    //console.log(userService.token?.id);
    if (userService.token) {
      reviewService
        .getAllById(userService.token.id)
        .then((res) => {
          reviewService.reviews = res;
          reviewService.reviews.sort((a, b) => (a.published > b.published ? 1 : -1));
          //console.log(reviewService.reviews);
        })
        .then(() => {
          reviewService.reviews.map((review, i) => {
            reviewService.get(review.review_id).then((res) => {
              reviewService.reviews[i] = res;
            });
          });
        })

        .catch((err) => {
          Alert.info('Det oppsto et problem ved henting av anmeldelsene: ' + err);
        });
    }
  }
}
