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
  //  game: Game = {
  //    game_id: 0,
  //    igdb_id: 0,
  //    game_title: '',
  //    genre: 0,
  //    genres: [],
  //    genre_id: 0,
  //    platform: 0,
  //    platforms: [],
  //    game_description: '',
  //  };
  game: Game2 = gameService2.game2;

  render() {
    return (
      <>
        <Container>
          <Card title={this.game.game_title}>
            <h6 className="card-subtitle mb-2 text-muted">
              <ColumnCentre>
                Terningkast:{' '}
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
              <ColumnCentre width={12} mdwidth={2}>
                <ThumbNail
                  img={
                    this.game.igdb?.cover_url ||
                    'https://cdn-icons-png.flaticon.com/512/686/686589.png'
                  }
                ></ThumbNail>
              </ColumnCentre>
              <ColumnCentre width={12} mdwidth={10}>
                {this.game.game_description}
                <Linebreak></Linebreak>
              </ColumnCentre>
              <ColumnCentre width={2}></ColumnCentre>
            </Row>
            <Linebreak></Linebreak>
            <Row>
              <ColumnCentre>
                Sjanger: {this.game.genre.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
              </ColumnCentre>
            </Row>
            <Row>
              <ColumnCentre>
                Plattformer: {this.game.platform.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
              </ColumnCentre>
            </Row>
            <Row>
              <ColumnCentre>
                Årstall:{' '}
                {this.game.igdb ? new Date(this.game.igdb?.release_date * 1000).getFullYear() : ''}
              </ColumnCentre>
            </Row>
            <Row>
              <ColumnCentre>
                Lignende spill:{' '}
                {this.game.igdb?.similar_games.map((e, i) => {
                  return (
                    <a key={i} href={'http://localhost:3000/#/games/0/' + e.id}>
                      {e.name},{' '}
                    </a>
                  );
                })}
              </ColumnCentre>
            </Row>
            <Row>
              {this.game.igdb?.screenshots_url.map((url, index) => {
                return (
                  <ColumnCentre width={12} smwidth={6} mdwidth={3}>
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
          <RelatedReviews></RelatedReviews>
        </Container>
      </>
    );
  }

  mounted() {
    //    this.game.game_id = this.props.match.params.db_id;
    //    if (this.game.game_id > 0) {
    //      gameService.get(this.game.game_id).then((result) => {
    //        this.game = result;
    //        console.log(this.game);
    //      });
    //    }
    //
    //    this.game.igdb_id = this.props.match.params.igdb_id;
    //    if (this.game.igdb_id > 0) {
    //      axios
    //        .get('search/get/' + this.game.igdb_id)
    //        .then((response) => {
    //          console.log(response.data);
    //          console.log(response.data[0].platforms);
    //        })
    //        .catch((err) => console.log(err));
    //    }
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
          this.game = result;
          //					this.game.game_id = result.game_id;
          //					this.game.igdb_id = result.igdb_id;
          //					this.game.game_title = result.game_title;
          //					this.game.genre = result.genre;
          //					this.game.platform = result.platform;
          //					this.game.game_description = result.game_description;
          //					this.game.igdb = null;
          console.log(result);
          console.log(this.game);

          if (this.game.igdb_id) {
            gameService2.get_igdb_extra(this.game.igdb_id).then((result_igdb) => {
              this.game.igdb = result_igdb;
              console.log(this.game.igdb);
            });
          }
        })
        .catch((err) => console.log(err));
    } else if (igdb_id > 0) {
      gameService2
        .get_igdb(igdb_id)
        .then((result) => {
          this.game = result;
          console.log(this.game);
        })
        .catch();
    }
  }
  addReview() {
    history.push(`/addReview/${this.game.game_id}/${this.game.igdb_id}`);
  }
  rating() {
    let terningkast = this.game.igdb
      ? Math.ceil((this.game.igdb?.aggregated_rating * 6) / 100)
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

  genre: Genre = {
    genre_id: 0,
    genre_name: '',
    genre_img: '',
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
                    Alert.danger('Spillet finnes allerede i databasen!');
                  } else if (this.game.genres.length != genresCheck.length) {
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
                    axios
                      .post('search', { game: this.game.game_title })
                      .then((response) => {
                        this.games = response.data;
                      })
                      .catch((err) => console.log(err));

                    gameService
                      .create(
                        this.games[0].igdb_id,
                        this.game.game_title,
                        this.game.game_description
                      )
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
                  value={this.platformEl[i]}
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
