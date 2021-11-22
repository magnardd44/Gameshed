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
  FormContainer,
  FormGroup,
  ReviewCard,
  FullReviewCard,
} from './widgets';
import { Link, NavLink } from 'react-router-dom';
import { gameService } from './services/game-service';
import { Genre, genreService } from './services/genre-service';
import { createHashHistory } from 'history';
import { platform } from 'os';
import { Platform, platformService } from './services/platform-service';
import axios from 'axios';
import { RelatedReviews } from './related-reviews';
import { reviewService, Review } from './services/review-service';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton } from 'react-share';
// import Select from 'react-select';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class GameCard extends Component<{ match: { params: { igdb_id: number; db_id: number } } }> {
  counter = 0;
  render() {
    return (
      <>
        <Container>
          <Card title={gameService.current.game_title} key={gameService.current.game_id}>
            <h6 className="card-subtitle mb-2 text-muted">
              <ColumnCentre>
                Terningkast:{' '}
                {gameService.current.igdb?.aggregated_rating != undefined ? (
                  <ThumbNail
                    small
                    img={
                      'https://helenaagustsson.github.io/INFT2002-images/images/dice-' +
                      this.rating() +
                      '.png'
                    }
                  ></ThumbNail>
                ) : (
                  ' Ikke tilgjengelig'
                )}
              </ColumnCentre>
            </h6>
            <Row>
              <ColumnCentre width={12} mdwidth={2} key={1}>
                <ThumbNail
                  img={
                    gameService.current.igdb?.cover_url ||
                    'https://cdn-icons-png.flaticon.com/512/686/686589.png'
                  }
                ></ThumbNail>
              </ColumnCentre>
              <ColumnCentre width={12} mdwidth={10}>
                {gameService.current.game_description}
                <Linebreak></Linebreak>
              </ColumnCentre>
            </Row>
            <Linebreak></Linebreak>
            <Row>
              <ColumnCentre>
                Sjanger:{' '}
                {gameService.current.genre.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
              </ColumnCentre>
            </Row>
            <Row>
              <ColumnCentre>
                Plattformer:{' '}
                {gameService.current.platform.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
              </ColumnCentre>
            </Row>
            <Row>
              {gameService.current.igdb?.release_date ? (
                <ColumnCentre>
                  Årstall:{' '}
                  {gameService.current.igdb
                    ? new Date(gameService.current.igdb?.release_date * 1000).getFullYear()
                    : ''}
                </ColumnCentre>
              ) : (
                ''
              )}
            </Row>
            <Row>
              {gameService.current.igdb?.similar_games ? (
                <ColumnCentre>
                  Lignende spill:{' '}
                  {gameService.current.igdb?.similar_games?.map((e, i) => {
                    return (
                      <a key={i} href={'http://localhost:3000/#/games/0/' + e.id}>
                        {e.name},{' '}
                      </a>
                    );
                  })}
                </ColumnCentre>
              ) : (
                ''
              )}
            </Row>
            <Row>
              {gameService.current.igdb?.screenshots_url?.map((url, i) => {
                return (
                  <ColumnCentre width={12} smwidth={6} mdwidth={3} key={i}>
                    <ThumbNail img={url} key={i} />
                  </ColumnCentre>
                );
              })}
            </Row>
          </Card>
          <Linebreak></Linebreak>
          <Row>
            <Column>
              <Button.Danger onClick={() => history.push('/')}>Tilbake til søk</Button.Danger>
            </Column>
            <Column right={true}>
              <Button.Success onClick={() => this.addReview()}>Anmeld dette spillet</Button.Success>
            </Column>
          </Row>
        </Container>
        <Container>
          <Card title="Anmeldelser for dette spillet:">
            {this.props.match.params.db_id == 0
              ? `Det finnes for øyeblikket ingen anmeldelser for dette spillet. `
              : reviewService.reviews.map((review, i) => {
                  return (
                    <Row key={i}>
                      <ReviewCard
                        key={i}
                        title={review.review_title}
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
                  );
                })}
          </Card>
        </Container>
      </>
    );
  }

  mounted() {
    let game_id = this.props.match.params.db_id;
    let igdb_id = this.props.match.params.igdb_id;

    if (game_id == 0 && igdb_id == 0) {
      Alert.danger('Heiheihei dette går ikke: Ingen spillId valgt.');
    }

    console.log(game_id);
    console.log(igdb_id);

    gameService.set(game_id, igdb_id).then(() => {
      console.log(gameService.current);
    });
    //    if (game_id > 0) {
    //      gameService2
    //        .get(game_id)
    //        .then((result) => {
    //          gameService2.game = result;
    //
    //          console.log(result);
    //          console.log(gameService2.game);
    //
    //          if (gameService2.game.igdb_id) {
    //            gameService2.get_igdb_extra(gameService2.game.igdb_id).then((result_igdb) => {
    //              gameService2.game.igdb = result_igdb;
    //              console.log(gameService2.game.igdb);
    //            });
    //          }
    //        })
    //        .catch((err) => console.log(err));
    //    } else if (igdb_id > 0) {
    //      gameService2
    //        .get_igdb(igdb_id)
    //        .then((result) => {
    //          gameService2.game = result;
    //          console.log(gameService2.game);
    //          console.log('sjanger: ' + gameService2.game.genre.join(', '));
    //        })
    //        .catch();
    //    }

    reviewService.reviews = [];
    reviewService.getAllByGameId(game_id).then((res) => {
      reviewService.reviews = res;
      reviewService.reviews.map((review, i) => {
        console.log(review);

        reviewService.get(review.review_id).then((res) => {
          reviewService.reviews[i] = res;
        });
      });
    });
  }
  addReview() {
    history.push(`/addReview/${gameService.current.game_id}/${gameService.current.igdb_id}`);
  }
  rating() {
    let terningkast = gameService.current.igdb
      ? Math.ceil((gameService.current.igdb?.aggregated_rating * 6) / 100)
      : '';
    return terningkast;
  }
}

export class AddGame extends Component {
  maxGenreEl = 3;
  maxPlatformEl = 4;
  genreElCount = 1;
  platformElCount = 1;

  genreEl = Array();
  platformEl = Array();

  render() {
    return (
      <Container>
        <Card title="Legg til ett spill">
          <FormContainer>
            <FormGroup>
              <Form.Label>Tittel:</Form.Label>

              <Form.Input
                id="titleInput"
                placeholder={'Skriv inn tittel'}
                type="text"
                value={gameService.current.game_title}
                onChange={(event) => {
                  gameService.current.game_title = event.currentTarget.value;
                }}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>Beskrivelse:</Form.Label>
              <Form.Textarea
                id="descriptionInput"
                placeholder={'Skriv inn en beskrivelse av spillet'}
                value={gameService.current.game_description ?? ''}
                onChange={(event) => {
                  gameService.current.game_description = event.currentTarget.value;
                }}
                rows={10}
                cols={10}
              />
            </FormGroup>
          </FormContainer>
          <Linebreak></Linebreak>
          <Row>
            <Column width={2}>
              <Form.Label>Sjanger:</Form.Label>
            </Column>
            <Column>
              {this.genreEl.map((el) => {
                return el;
              })}
            </Column>
          </Row>
          <Row>
            <Column>
              {this.genreElCount < this.maxGenreEl ? (
                <Button.Success
                  onClick={() => {
                    this.genreElCount++;
                    this.addGenreEl();
                  }}
                >
                  Legg til flere sjangere ({this.maxGenreEl - this.genreElCount})
                </Button.Success>
              ) : (
                ''
              )}
            </Column>
            <Column>
              {this.genreElCount > 1 ? (
                <Button.Danger
                  onClick={() => {
                    if (this.genreElCount != 1) {
                      this.genreElCount--;
                      gameService.current.genre.pop();
                      this.addGenreEl();
                    }
                  }}
                >
                  Fjern siste sjanger
                </Button.Danger>
              ) : (
                ''
              )}
            </Column>
          </Row>
          <Linebreak></Linebreak>
          <Row>
            <Column width={2}>
              <Form.Label>Platform:</Form.Label>
            </Column>
            <Column>
              {this.platformEl.map((el) => {
                return el;
              })}
            </Column>
          </Row>
          <Row>
            <Column>
              {this.platformElCount < this.maxPlatformEl ? (
                <Button.Success
                  onClick={() => {
                    this.platformElCount++;
                    this.addPlatformEl();
                  }}
                >
                  Legg til flere platformer ({this.maxPlatformEl - this.platformElCount})
                </Button.Success>
              ) : (
                ''
              )}
            </Column>
            <Column>
              {this.platformElCount > 1 ? (
                <Button.Danger
                  onClick={() => {
                    if (this.platformElCount != 1) {
                      this.platformElCount--;
                      gameService.current.platform.pop();
                      this.addPlatformEl();
                    }
                  }}
                >
                  Fjern siste platform
                </Button.Danger>
              ) : (
                ''
              )}
            </Column>
          </Row>
        </Card>
        <Card title={''}>
          <Alert />
          <Row>
            <Column>
              <Button.Danger
                onClick={() => {
                  history.push('/');
                }}
              >
                Avbryt
              </Button.Danger>
            </Column>
            <Column>
              <Button.Success
                onClick={() => {
                  const genresCheck = Array.from(new Set(gameService.current.genre));
                  const platformsCheck = Array.from(new Set(gameService.current.platform));
                  if (
                    gameService.db.find(
                      (el) =>
                        el.game_title.toLowerCase() === gameService.current.game_title.toLowerCase()
                    ) != undefined
                  ) {
                    Alert.danger('Spillet finnes allerede i databasen!');
                  } else if (gameService.current.genre.length != genresCheck.length) {
                    Alert.danger('Sjangerne må være ulike!');
                  } else if (gameService.current.platform.length != platformsCheck.length) {
                    Alert.danger('Platformene må være ulike!');
                  } else if (
                    gameService.current.game_title === '' ||
                    gameService.current.game_description === '' ||
                    this.genreEl.map((el) => el === undefined).length == 0 ||
                    this.platformEl.map((el) => el === undefined).length == 0
                  ) {
                    Alert.danger('Alle feltene må være fylt ut!');
                  } else {
                    gameService.search_igdb(gameService.current.game_title);
                    //                    axios
                    //                      .post('search', { game: gameService.game.game_title })
                    //                      .then((response) => {
                    //                        gameService.games = response.data;
                    //                      })
                    //                      .catch((err) => console.log(err));

                    gameService
                      .create(gameService.current)
                      // (
                      // gameService.games[0].igdb_id,
                      // gameService.game.game_title,
                      // gameService.game.game_description
                      // )
                      .then((id) => {
                        for (let i = 0; i < this.genreElCount; i++) {
                          genreService.updateGenreMapString(id, gameService.current.genre[i]);
                        }
                        for (let i = 0; i < this.platformElCount; i++) {
                          platformService.updatePlatformMapString(
                            gameService.current.platform[i],
                            id
                          );
                        }
                      })
                      .then((id) => {
                        Alert.success('Spillet er lagret!');
                        history.push('/');
                      })
                      .catch((error) => Alert.danger('Error creating game: ' + error.message));
                  }
                }}
              >
                Lagre
              </Button.Success>
            </Column>
          </Row>
        </Card>
      </Container>
    );
  }

  mounted() {
    gameService.current = gameService.empty();
    gameService.clear();

    genreService.getAll().then((res) => {
      genreService.genres = res;
      this.addGenreEl();
    });

    platformService.getAll().then((res) => {
      platformService.platforms = res;
      this.addPlatformEl();
    });

    gameService.getAll().then((res) => {});
  }

  addGenreEl() {
    if (this.genreElCount <= this.maxGenreEl) {
      this.genreEl = [];

      for (let i = 0; i < this.genreElCount; i++) {
        this.genreEl.push(
          <React.Fragment key={i}>
            <Row key={i}>
              <Column>
                <Form.Select
                  id="genreSel"
                  key={i}
                  value={this.genreEl[i]}
                  onChange={(event) => {
                    gameService.current.genre[i] = genreService.idToString(
                      Number(event.currentTarget.value)
                    );
                  }}
                >
                  <option hidden>Velg sjanger her:</option>
                  {genreService.genres.map((genre, index) => {
                    return (
                      <option key={index} value={genre.genre_id}>
                        {genre.genre_name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Column>
            </Row>
            <Linebreak />
          </React.Fragment>
        );
      }
    }
  }

  addPlatformEl() {
    if (this.platformElCount <= this.maxPlatformEl) {
      this.platformEl = [];
      for (let i = 0; i < this.platformElCount; i++) {
        this.platformEl.push(
          <React.Fragment key={i}>
            <Row key={i}>
              <Column>
                <Form.Select
                  id="platformSel"
                  key={i}
                  value={this.platformEl[i]}
                  onChange={(event) => {
                    gameService.current.platform[i] = platformService.idToString(
                      Number(event.currentTarget.value)
                    );
                  }}
                >
                  <option hidden>Velg platform her:</option>
                  {platformService.platforms.map((platform, index) => {
                    return (
                      <option key={index} value={platform.platform_id}>
                        {platform.platform_name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Column>
            </Row>
            <Linebreak />
          </React.Fragment>
        );
      }
    }
  }
}
