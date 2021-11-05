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

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class GameCard extends Component {
  game: Game = {
    game_id: 0,
    game_title: '',
    genre: 0,
    genre_id: 0,
    platform: 0,
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
            <Column>Sjanger: {this.game.genre}</Column>
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
    gameService.get(this.game.game_id).then((result) => {
      this.game = result;
      console.log(this.game);
    });
  }
  addReview() {
    history.push('/addReview');
  }
}

export class AddGame extends Component {
  genres: Genre[] = [];
  platforms: Platform[] = [];

  platform: Platform = {
    platform_id: 0,
    platform_name: '',
  };

  genre: Genre = {
    genre_id: 0,
    genre_name: '',
  };

  game: Game = {
    game_id: 0,
    game_title: '',
    genre: 0,
    genre_id: 0,
    platform: 0,
    game_description: '',
  };

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
                onChange={(event) => (this.game.game_title = event.currentTarget.value)}
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
              <Form.Select
                value={this.game.genre}
                onChange={(event) => {
                  this.game.genre = Number(event.currentTarget.value);
                  console.log(this.game.genre);
                }}
              >
                <option hidden>Velg sjanger her:</option>
                {this.genres.map((genre) => {
                  return (
                    <option key={genre.genre_name} value={genre.genre_id}>
                      {genre.genre_name}
                    </option>
                  );
                })}
              </Form.Select>
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Platform:</Form.Label>
            </Column>
            <Column>
              <Form.Select
                value={this.game.platform}
                onChange={(event) => {
                  this.game.platform = Number(event.currentTarget.value);
                  console.log(this.game.platform);
                }}
              >
                <option hidden>Velg platform her:</option>
                {this.platforms.map((platform) => {
                  return (
                    <option key={platform.platform_name} value={platform.platform_id}>
                      {platform.platform_name}
                    </option>
                  );
                })}
              </Form.Select>
            </Column>
          </Row>
          <Row>
            <Column>
              <Button.Success
                onClick={() => {
                  gameService
                    .create(this.game.game_title, this.game.game_description)
                    .then((id) => {
                      platformService.updatePlatformMap(this.game.platform, id);
                      genreService.updateGenreMap(id, this.game.genre);
                    })
                    .then((id) => {
                      alert('Spillet er lagret');
                      history.push('/games/' + id);
                    })
                    .catch((error) => Alert.danger('Error creating game: ' + error.message));
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
    });
    platformService.getAll().then((res) => {
      this.platforms = res;
    });
  }
}
