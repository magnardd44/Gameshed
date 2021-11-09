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
} from './widgets';
import { NavLink } from 'react-router-dom';
import { gameService, Game } from './services/game-services';
import { Genre, genreService } from './services/genre-service';
import { createHashHistory } from 'history';
import { platform } from 'os';
import { Platform, platformService } from './services/platform-service';
import axios from 'axios';
import Select from 'react-select';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class GameCard extends Component<{ match: { params: { igdb_id: number; db_id: number } } }> {
  game: Game = {
    game_id: 0,
    igdb_id: 0,
    game_title: '',
    genre: 0,
    genres: [],
    genre_id: 0,
    platform: 0,
    platforms: [],
    game_description: '',
  };
  render() {
    return (
      <Container>
        <Card title={this.game.game_title}>
          <h6 className="card-subtitle mb-2 text-muted">
            Terningkast:
            <ThumbNail
              small
              img="https://cdn-icons-png.flaticon.com/512/220/220725.png"
            ></ThumbNail>
          </h6>
          <Row>
            <Column width={2}>
              <ThumbNail img="https://cdn-icons-png.flaticon.com/512/686/686589.png"></ThumbNail>
            </Column>
            <Column width={6}>
              {this.game.game_description}
              <Linebreak></Linebreak>
            </Column>
            <Column width={2}></Column>
          </Row>
          <Linebreak></Linebreak>
          <Row>
            <Column>
              Sjanger:{' '}
              {this.game.genres.map((genre) => {
                <>{genre}</>;
              })}
            </Column>
          </Row>
          <Linebreak></Linebreak>
          <Row>
            <Column>Platform: {this.game.platform}</Column>
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
    );
  }

  mounted() {
    this.game.game_id = this.props.match.params.db_id;
    if (this.game.game_id > 0) {
      gameService.get(this.game.game_id).then((result) => {
        this.game = result;
        console.log(this.game);
      });
    }

    this.game.igdb_id = this.props.match.params.igdb_id;
    if (this.game.igdb_id > 0) {
      axios
        .get('search/get/' + this.game.igdb_id)
        .then((response) => {
          console.log(response.data);
          console.log(response.data[0].platforms);
        })
        .catch((err) => console.log(err));
    }
  }
  addReview() {
    history.push('/addReview');
  }
}

export class AddGame extends Component {
  maxGenreEl = 3;
  maxPlatformEl = 4;
  genreElCount = 1;
  platformElCount = 1;

  genreEl = Array();
  platformEl = Array();

  genre: Genre = {
    genre_id: 0,
    genre_name: '',
  };
  genres: Genre[] = [];

  platform: Platform = {
    platform_id: 0,
    platform_name: '',
  };

  platforms: Platform[] = [];

  game: Game = {
    game_id: 0,
    igdb_id: 0,
    game_title: '',
    genre: 0,
    genres: [],
    genre_id: 0,
    platform: 0,
    platforms: [],
    game_description: '',
  };

  games: Game[] = [];

  render() {
    return (
      <>
        <Card title="Legg til ett spill">
          <Row>
            <Column width={2}>
              <Form.Label>Tittel:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                placeholder={'Skriv inn tittel'}
                type="text"
                value={this.game.game_title}
                onChange={(event) => {
                  this.game.game_title = event.currentTarget.value;
                }}
              />
            </Column>
          </Row>
          <Linebreak></Linebreak>
          <Row>
            <Column width={2}>
              <Form.Label>Beskrivelse:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                placeholder={'Skriv inn en beskrivelse av spillet'}
                value={this.game.game_description ?? ''}
                onChange={(event) => {
                  this.game.game_description = event.currentTarget.value;
                }}
                rows={10}
              />
            </Column>
          </Row>
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
                      this.game.genres.pop();
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
                      this.game.platforms.pop();
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
              <Button.Success
                onClick={() => {
                  const genresCheck = Array.from(new Set(this.game.genres));
                  const platformsCheck = Array.from(new Set(this.game.platforms));
                  if (
                    this.games.find(
                      (el) => el.game_title.toLowerCase() === this.game.game_title.toLowerCase()
                    ) != undefined
                  ) {
                    console.log('Finnes');
                    Alert.danger('Spillet finnes allerede i databasen!');
                  } else if (this.game.genres.length != genresCheck.length) {
                    console.log('Alert!');
                    Alert.danger('Sjangerne må være ulike!');
                  } else if (this.game.platforms.length != platformsCheck.length) {
                    Alert.danger('Platformene må være ulike!');
                  } else if (
                    this.game.game_title === '' ||
                    this.game.game_description === '' ||
                    this.genreEl.map((el) => el === undefined) ||
                    this.platformEl.map((el) => el === undefined)
                  ) {
                    Alert.danger('Alle feltene må være fylt ut!');
                  } else {
                    gameService
                      .create(this.game.game_title, this.game.game_description)
                      .then((id) => {
                        for (let i = 0; i < this.genreElCount; i++) {
                          genreService.updateGenreMap(id, this.game.genres[i]);
                        }
                        for (let i = 0; i < this.platformElCount; i++) {
                          platformService.updatePlatformMap(this.game.platforms[i], id);
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
            <Column>
              <Button.Danger
                onClick={() => {
                  history.push('/');
                }}
              >
                Avbryt
              </Button.Danger>
            </Column>
          </Row>
        </Card>
      </>
    );
  }

  mounted() {
    genreService.getAll().then((res) => {
      this.genres = res;
      this.addGenreEl();
    });

    platformService.getAll().then((res) => {
      this.platforms = res;
      this.addPlatformEl();
    });

    gameService.getAll().then((res) => {
      this.games = res;
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
                  value={this.game.genres[i]}
                  onChange={(event) => {
                    this.game.genres[i] = Number(event.currentTarget.value);
                    this.addGenreEl();
                  }}
                >
                  <option hidden>Velg sjanger her:</option>
                  {this.genres.map((genre, i) => {
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
                  value={this.game.platforms[i]}
                  onChange={(event) => {
                    this.game.platforms[i] = Number(event.currentTarget.value);
                  }}
                >
                  <option hidden>Velg platform her:</option>
                  {this.platforms.map((platform) => {
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
