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
} from './widgets';
import { NavLink } from 'react-router-dom';
import { gameService, Game, gameService3 } from './services/game-services';
import { gameService2, Game2 } from './services/game-services';
import { Genre, genreService } from './services/genre-service';
import { createHashHistory } from 'history';
import { platform } from 'os';
import { Platform, platformService } from './services/platform-service';
import axios from 'axios';
import { RelatedReviews } from './related-reviews';
// import Select from 'react-select';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class GameCard extends Component<{ match: { params: { igdb_id: number; db_id: number } } }> {
  render() {
    return (
      <>
        <Container>
          <Card title={gameService2.game.game_title}>
            <h6 className="card-subtitle mb-2 text-muted">
              <ColumnCentre key={0}>
                Terningkast:
                <ThumbNail
                  small
                  img={
                    'https://helenaagustsson.github.io/INFT2002-images/images/dice-' +
                    this.rating() +
                    '.png'
                  }
                ></ThumbNail>
              </ColumnCentre>
            </h6>
            <Row>
              <ColumnCentre width={12} mdwidth={2} key={1}>
                <ThumbNail
                  img={
                    gameService2.game.igdb?.cover_url ||
                    'https://cdn-icons-png.flaticon.com/512/686/686589.png'
                  }
                ></ThumbNail>
              </ColumnCentre>
              <ColumnCentre width={12} mdwidth={10} key={2}>
                {gameService2.game.game_description}
                <Linebreak></Linebreak>
              </ColumnCentre>
            </Row>
            <Linebreak></Linebreak>
            <Row>
              <ColumnCentre key={3}>
                Sjanger:{' '}
                {gameService2.game.genre.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
              </ColumnCentre>
            </Row>
            <Row>
              <ColumnCentre key={4}>
                Plattformer:{' '}
                {gameService2.game.platform.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
              </ColumnCentre>
            </Row>
            <Row>
              <ColumnCentre key={5}>
                Årstall:{' '}
                {gameService2.game.igdb
                  ? new Date(gameService2.game.igdb?.release_date * 1000).getFullYear()
                  : ''}
              </ColumnCentre>
            </Row>
            <Row>
              <ColumnCentre key={6}>
                Lignende spill:{' '}
                {gameService2.game.igdb?.similar_games?.map((e, i) => {
                  return (
                    <a key={i} href={'http://localhost:3000/#/games/0/' + e.id}>
                      {e.name},{' '}
                    </a>
                  );
                })}
              </ColumnCentre>
            </Row>
            <Row>
              {gameService2.game.igdb?.screenshots_url?.map((url, index) => {
                return (
                  <ColumnCentre width={12} smwidth={6} mdwidth={3} key={index}>
                    <ThumbNail img={url} key={index} />
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
          <RelatedReviews genre_id={1}></RelatedReviews>
        </Container>
      </>
    );
  }

  mounted() {
    let game_id = this.props.match.params.db_id;
    let igdb_id = this.props.match.params.igdb_id;

    if (game_id == 0 && igdb_id == 0) {
      Alert.danger('Heiheihei dette går ikke');
    }

    console.log(game_id);
    console.log(igdb_id);

    if (game_id > 0) {
      gameService2
        .get(game_id)
        .then((result) => {
          gameService2.game = result;

          console.log(result);
          console.log(gameService2.game);

          if (gameService2.game.igdb_id) {
            gameService2.get_igdb_extra(gameService2.game.igdb_id).then((result_igdb) => {
              gameService2.game.igdb = result_igdb;
              console.log(gameService2.game.igdb);
            });
          }
        })
        .catch((err) => console.log(err));
    } else if (igdb_id > 0) {
      gameService2
        .get_igdb(igdb_id)
        .then((result) => {
          gameService2.game = result;
          console.log(gameService2.game);
          console.log('sjanger: ' + gameService2.game.genre.join(', '));
        })
        .catch();
    }
  }
  addReview() {
    history.push(`/addReview/${gameService2.game.game_id}/${gameService2.game.igdb_id}`);
  }
  rating() {
    let terningkast = gameService2.game.igdb
      ? Math.ceil((gameService2.game.igdb?.aggregated_rating * 6) / 100)
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
                placeholder={'Skriv inn tittel'}
                type="text"
                value={gameService.game.game_title}
                onChange={(event) => {
                  gameService.game.game_title = event.currentTarget.value;
                }}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>Beskrivelse:</Form.Label>
              <Form.Textarea
                placeholder={'Skriv inn en beskrivelse av spillet'}
                value={gameService.game.game_description ?? ''}
                onChange={(event) => {
                  gameService.game.game_description = event.currentTarget.value;
                }}
                rows={10}
                cols={10}
              />
            </FormGroup>
            <FormGroup></FormGroup>
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
                      gameService.game.genres.pop();
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
                      gameService.game.platforms.pop();
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
                  const genresCheck = Array.from(new Set(gameService.game.genres));
                  const platformsCheck = Array.from(new Set(gameService.game.platforms));
                  if (
                    gameService.games.find(
                      (el) =>
                        el.game_title.toLowerCase() === gameService.game.game_title.toLowerCase()
                    ) != undefined
                  ) {
                    Alert.danger('Spillet finnes allerede i databasen!');
                  } else if (gameService.game.genres.length != genresCheck.length) {
                    Alert.danger('Sjangerne må være ulike!');
                  } else if (gameService.game.platforms.length != platformsCheck.length) {
                    Alert.danger('Platformene må være ulike!');
                  } else if (
                    gameService.game.game_title === '' ||
                    gameService.game.game_description === '' ||
                    this.genreEl.map((el) => el === undefined) ||
                    this.platformEl.map((el) => el === undefined)
                  ) {
                    Alert.danger('Alle feltene må være fylt ut!');
                  } else {
                    axios
                      .post('search', { game: gameService.game.game_title })
                      .then((response) => {
                        gameService.games = response.data;
                      })
                      .catch((err) => console.log(err));

                    gameService
                      .create(
                        gameService.games[0].igdb_id,
                        gameService.game.game_title,
                        gameService.game.game_description
                      )
                      .then((id) => {
                        for (let i = 0; i < this.genreElCount; i++) {
                          genreService.updateGenreMap(id, gameService.game.genres[i]);
                        }
                        for (let i = 0; i < this.platformElCount; i++) {
                          platformService.updatePlatformMap(gameService.game.platforms[i], id);
                        }
                      })
                      .then((id) => {
                        alert('Spillet er lagret');
                        history.push('/games/' + id);
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
    genreService.getAll().then((res) => {
      genreService.genres = res;
      this.addGenreEl();
    });

    platformService.getAll().then((res) => {
      platformService.platforms = res;
      this.addPlatformEl();
    });

    gameService.getAll().then((res) => {
      gameService.games = res;
    });
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
                  key={i}
                  value={gameService.game.genres[i]}
                  onChange={(event) => {
                    gameService.game.genres[i] = Number(event.currentTarget.value);
                  }}
                >
                  <option hidden>Velg sjanger her:</option>
                  {genreService.genres.map((genre, i) => {
                    return (
                      <option key={i} value={genre.genre_id}>
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
                  key={i}
                  value={this.platformEl[i]}
                  onChange={(event) => {
                    gameService.game.platforms[i] = Number(event.currentTarget.value);
                  }}
                >
                  <option hidden>Velg platform her:</option>
                  {platformService.platforms.map((platform) => {
                    return (
                      <option key={platform.platform_id} value={platform.platform_id}>
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
