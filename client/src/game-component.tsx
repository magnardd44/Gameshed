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
import { gameService3, Game2 } from './services/game-services';
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
          <Card title={gameService3.current.game_title}>
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
                    gameService3.current.igdb?.cover_url ||
                    'https://cdn-icons-png.flaticon.com/512/686/686589.png'
                  }
                ></ThumbNail>
              </ColumnCentre>
              <ColumnCentre width={12} mdwidth={10} key={2}>
                {gameService3.current.game_description}
                <Linebreak></Linebreak>
              </ColumnCentre>
            </Row>
            <Linebreak></Linebreak>
            <Row>
              <ColumnCentre key={3}>
                Sjanger:{' '}
                {gameService3.current.genre.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
              </ColumnCentre>
            </Row>
            <Row>
              <ColumnCentre key={4}>
                Plattformer:{' '}
                {gameService3.current.platform.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
              </ColumnCentre>
            </Row>
            <Row>
              <ColumnCentre key={5}>
                Årstall:{' '}
                {gameService3.current.igdb
                  ? new Date(gameService3.current.igdb?.release_date * 1000).getFullYear()
                  : ''}
              </ColumnCentre>
            </Row>
            <Row>
              <ColumnCentre key={6}>
                Lignende spill:{' '}
                {gameService3.current.igdb?.similar_games?.map((e, i) => {
                  return (
                    <a key={i} href={'http://localhost:3000/#/games/0/' + e.id}>
                      {e.name},{' '}
                    </a>
                  );
                })}
              </ColumnCentre>
            </Row>
            <Row>
              {gameService3.current.igdb?.screenshots_url?.map((url, index) => {
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

	gameService3.set(game_id, igdb_id);
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
  }
  addReview() {
    history.push(`/addReview/${gameService3.current.game_id}/${gameService3.current.igdb_id}`);
  }
  rating() {
    let terningkast = gameService3.current.igdb
      ? Math.ceil((gameService3.current.igdb?.aggregated_rating * 6) / 100)
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
                value={gameService3.current.game_title}
                onChange={(event) => {
                  gameService3.current.game_title = event.currentTarget.value;
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
                value={gameService3.current.game_description ?? ''}
                onChange={(event) => {
                  gameService3.current.game_description = event.currentTarget.value;
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
                      gameService3.current.genre.pop();
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
                      gameService3.current.platform.pop();
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
                  const genresCheck = Array.from(new Set(gameService3.current.genre));
                  const platformsCheck = Array.from(new Set(gameService3.current.platform));
                  if (
                    gameService3.db.find(
                      (el) =>
                        el.game_title.toLowerCase() === gameService3.current.game_title.toLowerCase()
                    ) != undefined
                  ) {
                    Alert.danger('Spillet finnes allerede i databasen!');
                  } else if (gameService3.current.genre.length != genresCheck.length) {
                    Alert.danger('Sjangerne må være ulike!');
                  } else if (gameService3.current.platform.length != platformsCheck.length) {
                    Alert.danger('Platformene må være ulike!');
                  } else if (
                    gameService3.current.game_title === '' ||
                    gameService3.current.game_description === '' ||
                    this.genreEl.map((el) => el === undefined) ||
                    this.platformEl.map((el) => el === undefined)
                  ) {
                    Alert.danger('Alle feltene må være fylt ut!');
                  } else {
					gameService3.search_igdb(gameService3.current.game_title);
//                    axios
//                      .post('search', { game: gameService.game.game_title })
//                      .then((response) => {
//                        gameService.games = response.data;
//                      })
//                      .catch((err) => console.log(err));

                    gameService3
                      .create(
					  gameService3.current

                       // gameService.games[0].igdb_id,
                       // gameService.game.game_title,
                       // gameService.game.game_description
                      )
                      .then((id) => {
                        for (let i = 0; i < this.genreElCount; i++) {
                          genreService.updateGenreMapString(id, gameService3.current.genre[i]);
                        }
                        for (let i = 0; i < this.platformElCount; i++) {
                          platformService.updatePlatformMapString(gameService3.current.platform[i], id);
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
	gameService3.current = gameService3.empty();
	gameService3.clear();

    genreService.getAll().then((res) => {
      genreService.genres = res;
      this.addGenreEl();
    });

    platformService.getAll().then((res) => {
      platformService.platforms = res;
      this.addPlatformEl();
    });

    gameService3.getAll().then((res) => {
      //gameService.games = res;
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
                  value={gameService3.current.genre[i]}
                  onChange={(event) => {
                    gameService3.current.genre[i] = genreService.idToString(Number(event.currentTarget.value));
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
                  key={i}
                  value={this.platformEl[i]}
                  onChange={(event) => {
                    gameService3.current.platform[i] = platformService.idToString(Number(event.currentTarget.value));
                  }}
                >
                  <option hidden>Velg platform her:</option>
                  {platformService.platforms.map((platform,index) => {
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
