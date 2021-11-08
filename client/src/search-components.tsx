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
} from './widgets';
import { NavLink } from 'react-router-dom';
import { gameService, Game } from './services/game-services';
import { Genre } from './services/genre-service';
import { createHashHistory } from 'history';
import axios from 'axios';
import { genreService } from './services/genre-service';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

type gameType = {
  id: number;
  name: string;
};

class SharedGame {
  game: gameType = {
    id: 0,
    name: '',
  };
  games: gameType[] = [];
}

let shared = sharedComponentData(new SharedGame());

export class Search extends Component {
  input: string = '';

  games: Game[] = [];
  filtered: Game[] = [];

  render() {
    return (
      <>
        <Container textalign={'centre'}>
          <Row>
            <ColumnCentre width={6} offset={2}>
              <Form.Input
                type={this.input}
                value={this.input}
                placeholder="Søk etter et spill"
                onChange={(event) => {
                  this.input = event.currentTarget.value;

                  if (this.input && this.input.length >= 3) {
                    setTimeout(() => {
                      this.IGDB_update();
                    }, 2000);
                  } else {
                    shared.games = [];
                  }

                  this.filtered = this.games.filter((game) =>
                    game.game_title.toLowerCase().includes(this.input.toLowerCase())
                  );
                }}
                onKeyUp={(event: { key: string }) => {
                  if (event.key == 'Enter') {
                    this.search();
                  }
                }}
              />
              {this.filtered.map((game) => {
                if (this.input != '') {
                  return (
                    <div
                      id={game.game_title}
                      key={game.game_id}
                      role="option"
                      className=" option"
                      style={{
                        borderRadius: '5px',
                        border: '1px solid black',
                        cursor: 'pointer',
                        marginTop: '10px',
                        backgroundColor: 'lightgray',
                      }}
                      onClick={(event) => {
                        this.input = event.currentTarget.id;
                      }}
                    >
                      {game.game_title}
                    </div>
                  );
                }
              })}

              {shared.games.map((game) => {
                if (this.input != '') {
                  return (
                    <div
                      key={game.id}
                      role="option"
                      className=" option"
                      style={{
                        borderRadius: '5px',
                        border: '1px solid black',
                        cursor: 'pointer',
                        marginTop: '10px',
                        backgroundColor: 'lightgray',
                      }}
                      onClick={(event) => {
                        this.input = event.currentTarget.innerHTML;
                      }}
                    >
                      {game.name}
                    </div>
                  );
                }
              })}
            </ColumnCentre>
            <ColumnCentre width={4}>
              <Button.Danger
                onClick={() => {
                  this.mounted();
                }}
              >
                Tøm
              </Button.Danger>
              <Button.Success
                onClick={() => {
                  this.search();
                }}
              >
                Søk
              </Button.Success>
            </ColumnCentre>
          </Row>
        </Container>
      </>
    );
  }

  mounted() {
    /** */
    gameService.getAll().then((result) => {
      this.input = '';
      this.games = result;
      console.log(this.games);
    });
  }

  search() {
    console.log('search');
    shared.games = []; //Opprensking så ikkje gamle resultat forstyrrer.
    axios
      .post('search', { game: this.input })
      .then((response) => {
        shared.games = response.data;
      })
      .catch((err) => console.log(err));
    history.push('/results');
  }

  IGDB_update() {
    console.log('IGDB search ');
    shared.games = [];
    axios
      .post('search', { game: this.input })
      .then((response) => {
        shared.games = response.data;
      })
      .catch((err) => console.log(err));
  }
}

export class SearchListings extends Component {
  genres: Genre[] = [];
  render() {
    return (
      <>
        <Container>
          Filtrer dine søkeresultater:
          <FormContainer>
            <FormGroup>
              <Form.Label>Sjanger: </Form.Label>
              <Form.Select value={'Adventure'} onChange={() => console.log('sjanger')}>
                {this.genres.map((genre) => (
                  <option>{genre.genre_name}</option>
                ))}
              </Form.Select>

              <Form.Label>Platform: </Form.Label>
              <Form.Select value={'Adventure'} onChange={() => console.log('sjanger')}>
                <option value="1">Playstation</option>
              </Form.Select>

              <Form.Label>År: </Form.Label>
              <Form.Select value={'Adventure'} onChange={() => console.log('sjanger')}>
                <option value="1">2020</option>
              </Form.Select>
            </FormGroup>
          </FormContainer>
        </Container>
        <Container>
          <SearchResult key={0}></SearchResult>
          {shared.games.map((game, index) => (
            <IGDBResult game={game} key={index}></IGDBResult>
          ))}
        </Container>

        <Container>
          Fant du ikke det du lette etter?
          <Linebreak></Linebreak>
          <Button.Success onClick={() => history.push('/addGame')}>
            Legg til nytt spill
          </Button.Success>
        </Container>
      </>
    );
  }
  mounted() {
    genreService.getAll().then((results) => {
      this.genres = results;
    });
  }
}

export class SearchResult extends Component {
  game: Game = {
    game_id: 0,
	igdb_id: 0,
    game_title: '',
    genre: 0,
    genre_id: 0,
    platform: 0,
    game_description: '',
  };
  render() {
    return (
      <Card title={this.game.game_title}>
        <h6 className="card-subtitle mb-2 text-muted">
          Terningkast:
          <ThumbNail small img="https://cdn-icons-png.flaticon.com/512/220/220725.png"></ThumbNail>
        </h6>
        <Row>
          <Column width={2}>
            <ThumbNail img="https://cdn-icons-png.flaticon.com/512/686/686589.png"></ThumbNail>
          </Column>
          <Column width={8}>
            {this.game.game_description}
            <Linebreak></Linebreak>
          </Column>
          <Column width={2}>
            {' '}
            <Button.Success onClick={() => history.push('/games/' + this.game.game_id + '/' + this.game.igdb_id)}>
              Les mer
            </Button.Success>
          </Column>
        </Row>
        <Linebreak></Linebreak>
      </Card>
    );
  }
  mounted() {
    gameService.get(this.game.game_id).then((result) => {
      this.game = result;
      console.log(this.game);
    });
  }
}

export class IGDBResult extends Component<{ game: any }> {
  render() {
    return (
      <Card title={this.props.game.name}>
        <h6 className="card-subtitle mb-2 text-muted">
          Terningkast:
          <ThumbNail small img="https://cdn-icons-png.flaticon.com/512/220/220725.png"></ThumbNail>
        </h6>
        <Row>
          <Column width={2}>
            <ThumbNail
              img={this.props.game.cover ? 'https:' + this.props.game.cover.url : ''}
            ></ThumbNail>
          </Column>
          <Column width={8}>
            {this.props.game.summary ? this.props.game.summary : 'Ingen beskrivelse'}
            <Linebreak></Linebreak>
          </Column>
          <Column width={2}>
            {' '}
            <Button.Success onClick={() => history.push('/games/0/' + this.props.game.id)}>
              Les mer
            </Button.Success>
          </Column>
        </Row>
        <Row>Sjanger: {this.props.game.genres}</Row>
        <Row>Platform: {this.props.game.platforms}</Row>
        <Row>År: </Row>
        <Linebreak></Linebreak>
      </Card>
    );
  }
}
